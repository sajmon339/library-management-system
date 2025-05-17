namespace LibraryAPI.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body, bool isHtml = false);
        Task SendPasswordResetEmailAsync(string email, string resetToken);
    }
}
