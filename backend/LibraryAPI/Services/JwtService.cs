using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LibraryAPI.Models;
using Microsoft.IdentityModel.Tokens;

namespace LibraryAPI.Services
{
    public class JwtService
    {
        private readonly IConfiguration _configuration;
        private static readonly string _deploymentId = Guid.NewGuid().ToString();  // Unique ID for this deployment

        public JwtService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        
        // Method to get the current deployment ID
        public static string GetDeploymentId()
        {
            return _deploymentId;
        }

        public string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["JwtSettings:Secret"] ?? throw new InvalidOperationException("JWT Secret not configured"));
            
            // Set default values for issuer and audience if not specified in config
            var issuer = _configuration["JwtSettings:Issuer"] ?? "libraryhub-api";
            var audience = _configuration["JwtSettings:Audience"] ?? "libraryhub-client";
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role.ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(12),  // Changed from 7 days to 12 hours for better security
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = issuer,
                Audience = audience
            };
            
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
