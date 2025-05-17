using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryAPI.Models
{
    public class Book
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string Author { get; set; } = string.Empty;

        [Required]
        public int PublishedYear { get; set; }

        [Required]
        [MaxLength(100)]
        public string Publisher { get; set; } = string.Empty;

        [Required]
        public Genre Genre { get; set; }

        [Required]
        [MaxLength(20)]
        public string CatalogNumber { get; set; } = string.Empty;

        [Required]
        public int TotalCopies { get; set; } = 1;

        public int AvailableCopies { get; set; } = 1;
        
        // Add cover image property
        public string? CoverImagePath { get; set; }

        public virtual ICollection<CheckOut> CheckOuts { get; set; } = new List<CheckOut>();
    }
}
