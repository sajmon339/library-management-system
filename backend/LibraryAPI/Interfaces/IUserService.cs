using LibraryAPI.Models;

namespace LibraryAPI.Interfaces
{
    public interface IUserService
    {
        Task<User?> GetUserByIdAsync(int id);
        Task<User?> GetUserByEmailAsync(string email);
        Task<User?> GetUserByUsernameAsync(string username);
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User> RegisterUserAsync(User user, string password);
        Task<User?> UpdateUserAsync(int id, User user);
        Task<bool> DeleteUserAsync(int id);
        Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword);
        Task<string> GeneratePasswordResetTokenAsync(string email);
        Task<bool> ResetPasswordAsync(string email, string token, string newPassword);
        Task<bool> ValidateUserCredentialsAsync(string email, string password);
        Task<bool> UpdateUserRoleAsync(int userId, UserRole newRole);
    }
}
