using LibraryAPI.Data;
using LibraryAPI.Interfaces;
using LibraryAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.SetIsOriginAllowed(_ => true) // Allow any origin for development
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Database configuration
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure JSON serialization
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

// Register services
builder.Services.AddScoped<IBookService, BookService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICheckOutService, CheckOutService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddSingleton<JwtService>();

// Configure JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                builder.Configuration["JwtSettings:Secret"] ?? throw new InvalidOperationException("JWT Secret not configured"))),
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
        
        // Add event handlers for token validation
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"Authentication failed: {context.Exception.Message}");
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                Console.WriteLine("Token successfully validated");
                return Task.CompletedTask;
            },
            OnChallenge = context =>
            {
                Console.WriteLine($"OnChallenge: {context.Error}, {context.ErrorDescription}");
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

// Configure Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Library Management API", Version = "v1" });
    
    // Configure Swagger to use JWT Authentication
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Apply pending migrations at startup with retry mechanism
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var maxRetries = 10;
    var retryDelayMs = 5000; // 5 seconds
    for (int retry = 0; retry < maxRetries; retry++)
    {
        try
        {
            var context = services.GetRequiredService<ApplicationDbContext>();
              // Try to connect to the database
            Console.WriteLine($"Attempt {retry + 1}/{maxRetries} to connect to the database...");
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            Console.WriteLine($"Using connection string: {connectionString?.Replace("Password=admin", "Password=***") ?? "No connection string found"}");
            
            // Check if tables exist before applying migrations
            bool tablesExist = false;
            try
            {
                // Try to query the Books table to see if it exists
                var bookCount = context.Books.Count();
                Console.WriteLine($"Found {bookCount} books in the database. Tables already exist.");
                tablesExist = true;
                
                // Insert migration history to avoid future migration attempts
                if (!context.Database.GetAppliedMigrations().Any())
                {
                    Console.WriteLine("Inserting migration history records...");
                    using (var command = context.Database.GetDbConnection().CreateCommand())
                    {                        command.CommandText = @"
                            INSERT INTO ""__EFMigrationsHistory"" (""MigrationId"", ""ProductVersion"")
                            VALUES ('20250302114621_InitialCreate', '9.0.2'),
                                   ('20250517074811_AddUserAndCheckOutModels', '9.0.2'),
                                   ('20250517190616_AddCoverImagePathToBooks', '9.0.2')
                            ON CONFLICT DO NOTHING;";
                        
                        context.Database.OpenConnection();
                        command.ExecuteNonQuery();
                    }
                }
            }
            catch
            {
                // Tables don't exist or another error occurred
                tablesExist = false;
            }
            
            if (!tablesExist)
            {
                context.Database.Migrate();  // Run migrations automatically
            }            // Always ensure admin user exists
            var userService = services.GetRequiredService<IUserService>();            // Check if admin@library.com exists
            var adminEmail = "admin@library.com";
            var adminUser = await context.Users.FirstOrDefaultAsync(u => u.Email == adminEmail);
              if (adminUser == null)
            {
                // Create admin user if it doesn't exist
                var newAdminUser = new LibraryAPI.Models.User
                {
                    UserName = "admin",
                    Email = adminEmail,
                    Role = LibraryAPI.Models.UserRole.Admin
                };
                  // Define the default password outside the try block so it's accessible in all blocks
                var defaultPassword = "Admin123!";
                
                try 
                {
                    // Register the admin with a known password
                    await userService.RegisterUserAsync(newAdminUser, defaultPassword);
                    Console.WriteLine($"Admin user created with default credentials. Email: {adminEmail}, Password: {defaultPassword}");
                }
                catch (InvalidOperationException iex) when (iex.Message.Contains("already in use")) 
                {
                    // If the error is just that the username/email already exists but the query didn't find it,
                    // then we should still try to update the password directly
                    Console.WriteLine($"Admin user exists but wasn't found in the initial query. Attempting password reset.");
                    
                    // Try to find the user again
                    adminUser = await context.Users.FirstOrDefaultAsync(u => u.Email == adminEmail || u.UserName == "admin");
                    
                    if (adminUser != null)
                    {
                        await userService.ResetPasswordAsync(adminEmail, adminUser.ResetToken ?? "force-reset", defaultPassword);
                        Console.WriteLine($"Admin password has been reset to the default: {defaultPassword}");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error creating admin user: {ex.Message}");
                }
            }
            else
            {
                Console.WriteLine("Admin user already exists.");
            }
            
            Console.WriteLine("Database migration completed successfully!");
            break; // Exit the retry loop if successful
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Database migration/initialization error: {ex.Message}");
            
            if (retry < maxRetries - 1)
            {
                Console.WriteLine($"Retrying in {retryDelayMs/1000} seconds...");
                Thread.Sleep(retryDelayMs);
            }
            else
            {
                Console.WriteLine("Maximum retries reached. Could not connect to the database.");
            }
        }
    }
}

// Enable Swagger in both development and production for demo purposes
app.UseSwagger();
app.UseSwaggerUI();

// Configure middleware
app.UseHttpsRedirection();
app.UseCors();

// Enable static files to serve book covers
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

// Use the port from environment variable if set, otherwise use 8001
var port = Environment.GetEnvironmentVariable("PORT") ?? "8001";
app.Urls.Add($"http://+:{port}");

// Register controllers
app.MapControllers();

app.Run();
