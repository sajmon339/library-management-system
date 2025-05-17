using LibraryAPI.Interfaces;
using System.Net;
using System.Net.Mail;

namespace LibraryAPI.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendEmailAsync(string to, string subject, string body, bool isHtml = false)
        {
            try
            {
                var mailSettings = _configuration.GetSection("EmailSettings");
                var smtpServer = mailSettings["SmtpServer"];
                var smtpPort = int.Parse(mailSettings["SmtpPort"] ?? "587");
                var smtpUsername = mailSettings["SmtpUsername"];
                var smtpPassword = mailSettings["SmtpPassword"];
                var fromEmail = mailSettings["FromEmail"];
                var fromName = mailSettings["FromName"];

                var client = new SmtpClient(smtpServer, smtpPort)
                {
                    EnableSsl = true,
                    Credentials = new NetworkCredential(smtpUsername, smtpPassword)
                };

                var message = new MailMessage
                {
                    From = new MailAddress(fromEmail ?? "", fromName ?? "Library Management System"),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = isHtml
                };

                message.To.Add(new MailAddress(to));

                await client.SendMailAsync(message);
                _logger.LogInformation($"Email sent to {to}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error sending email to {to}");
                throw;
            }
        }

        public async Task SendPasswordResetEmailAsync(string email, string resetToken)
        {
            var baseUrl = _configuration["ApplicationSettings:BaseUrl"] ?? "http://localhost:3000";
            var resetUrl = $"{baseUrl}/reset-password?email={WebUtility.UrlEncode(email)}&token={WebUtility.UrlEncode(resetToken)}";
            
            var subject = "Password Reset - Library Management System";
            var body = $@"
                <html>
                <body>
                    <h2>Password Reset</h2>
                    <p>You requested a password reset for your Library Management System account.</p>
                    <p>Click the link below to reset your password:</p>
                    <p><a href='{resetUrl}'>Reset Password</a></p>
                    <p>If you didn't request this, please ignore this email.</p>
                    <p>This link will expire in 24 hours.</p>
                </body>
                </html>";
            
            await SendEmailAsync(email, subject, body, true);
        }
    }
}
