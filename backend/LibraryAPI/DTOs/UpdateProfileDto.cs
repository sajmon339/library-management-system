using System.ComponentModel.DataAnnotations;

namespace LibraryAPI.DTOs
{
    public class UpdateProfileDto
    {
        [Required]
        [StringLength(50, MinimumLength = 3)]
        public string UserName { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}
