using LibraryAPI.Models;
using System.ComponentModel.DataAnnotations;

namespace LibraryAPI.DTOs
{
    public class BookDto
    {
        public int Id { get; set; }
        
        [Required]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Author { get; set; } = string.Empty;
        
        [Required]
        public int PublishedYear { get; set; }
        
        [Required]
        public string Publisher { get; set; } = string.Empty;
        
        [Required]
        public Genre Genre { get; set; }
        
        public string CatalogNumber { get; set; } = string.Empty;
        
        [Required]
        public int TotalCopies { get; set; } = 1;
        
        public int AvailableCopies { get; set; } = 1;
        
        // Flag indicating if the book has a cover image
        public bool HasCoverImage { get; set; }
    }

    public class CreateBookDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Author { get; set; } = string.Empty;
        
        [Required]
        [Range(1000, 9999)]
        public int PublishedYear { get; set; }
        
        [Required]
        public string Publisher { get; set; } = string.Empty;
        
        [Required]
        public Genre Genre { get; set; }
        
        public string? CatalogNumber { get; set; }
        
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Total copies must be at least 1")]
        public int TotalCopies { get; set; } = 1;
    }

    public class UpdateBookDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Author { get; set; } = string.Empty;
        
        [Required]
        [Range(1000, 9999)]
        public int PublishedYear { get; set; }
        
        [Required]
        public string Publisher { get; set; } = string.Empty;
        
        [Required]
        public Genre Genre { get; set; }
    }

    public class UpdateBookQuantityDto
    {
        [Required]
        [Range(0, int.MaxValue)]
        public int Quantity { get; set; }
    }
}
