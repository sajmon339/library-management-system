using LibraryAPI.Data;
using LibraryAPI.Interfaces;
using LibraryAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryAPI.Services
{
    public class BookService : IBookService
    {
        private readonly ApplicationDbContext _context;

        public BookService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Book>> GetAllBooksAsync()
        {
            return await _context.Books.ToListAsync();
        }

        public async Task<IEnumerable<Book>> SearchBooksAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return await GetAllBooksAsync();
            }
            
            searchTerm = searchTerm.ToLower();
            
            return await _context.Books
                .Where(b => 
                    b.Title.ToLower().Contains(searchTerm) ||
                    b.Author.ToLower().Contains(searchTerm) ||
                    b.Publisher.ToLower().Contains(searchTerm) ||
                    b.Genre.ToString().ToLower().Contains(searchTerm) ||
                    b.CatalogNumber.ToLower().Contains(searchTerm))
                .ToListAsync();
        }

        public async Task<IEnumerable<Book>> FilterBooksAsync(string? author, int? year, string? publisher, Genre? genre)
        {
            var query = _context.Books.AsQueryable();

            if (!string.IsNullOrWhiteSpace(author))
            {
                query = query.Where(b => b.Author.ToLower().Contains(author.ToLower()));
            }

            if (year.HasValue)
            {
                query = query.Where(b => b.PublishedYear == year.Value);
            }

            if (!string.IsNullOrWhiteSpace(publisher))
            {
                query = query.Where(b => b.Publisher.ToLower().Contains(publisher.ToLower()));
            }

            if (genre.HasValue)
            {
                query = query.Where(b => b.Genre == genre.Value);
            }

            return await query.ToListAsync();
        }

        public async Task<Book?> GetBookByIdAsync(int id)
        {
            return await _context.Books.FindAsync(id);
        }

        public async Task<Book?> GetBookByCatalogNumberAsync(string catalogNumber)
        {
            return await _context.Books.FirstOrDefaultAsync(b => b.CatalogNumber == catalogNumber);
        }

        public async Task<Book> AddBookAsync(Book book)
        {
            // If no catalog number is provided, generate one
            if (string.IsNullOrEmpty(book.CatalogNumber))
            {
                book.CatalogNumber = GenerateCatalogNumber(book);
            }

            book.AvailableCopies = book.TotalCopies;
            
            _context.Books.Add(book);
            await _context.SaveChangesAsync();
            return book;
        }

        public async Task<Book?> UpdateBookAsync(int id, Book book)
        {
            var existingBook = await _context.Books.FindAsync(id);
            if (existingBook == null)
            {
                return null;
            }

            existingBook.Title = book.Title;
            existingBook.Author = book.Author;
            existingBook.PublishedYear = book.PublishedYear;
            existingBook.Publisher = book.Publisher;
            existingBook.Genre = book.Genre;
            
            // Don't update CatalogNumber, TotalCopies, or AvailableCopies here
            // Those are managed through separate methods

            await _context.SaveChangesAsync();
            return existingBook;
        }

        public async Task<bool> DeleteBookAsync(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return false;
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateBookQuantityAsync(int id, int quantity)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return false;
            }

            var checkOutCount = await _context.CheckOuts
                .Where(c => c.BookId == id && c.Status == CheckOutStatus.Active)
                .CountAsync();

            book.TotalCopies = quantity;
            book.AvailableCopies = Math.Max(0, quantity - checkOutCount);

            await _context.SaveChangesAsync();
            return true;
        }

        // Add a method to update only the CoverImagePath
        public async Task<bool> UpdateCoverImagePathAsync(int id, string imagePath)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return false;
            }

            book.CoverImagePath = imagePath;
            await _context.SaveChangesAsync();
            return true;
        }

        private string GenerateCatalogNumber(Book book)
        {
            // Format: GENRE[first 3 chars]-AUTHOR[first 3 chars]-PUBYEAR[last 2 digits]-RANDOM[3 digits]
            string genreCode = book.Genre.ToString().Substring(0, Math.Min(3, book.Genre.ToString().Length)).ToUpper();
            string authorCode = book.Author.Length >= 3 
                ? new string(book.Author.Where(char.IsLetter).Take(3).ToArray()).ToUpper() 
                : book.Author.ToUpper().PadRight(3, 'X');
            string yearCode = book.PublishedYear.ToString().Substring(Math.Max(0, book.PublishedYear.ToString().Length - 2));
            
            // Random digits for uniqueness
            var random = new Random();
            string uniqueCode = random.Next(100, 1000).ToString();

            return $"{genreCode}-{authorCode}-{yearCode}-{uniqueCode}";
        }
    }
}
