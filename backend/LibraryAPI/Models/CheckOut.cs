using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryAPI.Models
{
    public enum CheckOutStatus
    {
        Active,
        Returned,
        Overdue,
        Lost
    }

    public class CheckOut
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int BookId { get; set; }

        [ForeignKey("BookId")]
        public virtual Book Book { get; set; } = null!;

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;

        [Required]
        public DateTime CheckOutDate { get; set; } = DateTime.UtcNow;

        [Required]
        public DateTime DueDate { get; set; }

        public DateTime? ReturnDate { get; set; }

        [Required]
        public CheckOutStatus Status { get; set; } = CheckOutStatus.Active;

        public string? Notes { get; set; }
    }
}
