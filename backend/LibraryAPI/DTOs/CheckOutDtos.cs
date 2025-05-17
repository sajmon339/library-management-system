using LibraryAPI.Models;
using System.ComponentModel.DataAnnotations;

namespace LibraryAPI.DTOs
{
    public class CheckOutDto
    {
        public int Id { get; set; }
        public int BookId { get; set; }
        public string BookTitle { get; set; } = string.Empty;
        public string CatalogNumber { get; set; } = string.Empty;
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public DateTime CheckOutDate { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public CheckOutStatus Status { get; set; }
        public string? Notes { get; set; }
    }

    public class CreateCheckOutDto
    {
        [Required]
        public int BookId { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        public int DaysToReturn { get; set; } = 14;
        
        public string? Notes { get; set; }
    }

    public class UpdateCheckOutStatusDto
    {
        [Required]
        public CheckOutStatus Status { get; set; }
        
        public string? Notes { get; set; }
    }
}
