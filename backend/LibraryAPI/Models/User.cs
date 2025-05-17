using System.ComponentModel.DataAnnotations;

namespace LibraryAPI.Models
{
    public enum UserRole
    {
        Customer,
        Admin
    }

    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string UserName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        public string PasswordSalt { get; set; } = string.Empty;

        [Required]
        public UserRole Role { get; set; } = UserRole.Customer;

        public string? ResetToken { get; set; }

        public DateTime? ResetTokenExpiry { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public virtual ICollection<CheckOut> CheckOuts { get; set; } = new List<CheckOut>();
    }
}
