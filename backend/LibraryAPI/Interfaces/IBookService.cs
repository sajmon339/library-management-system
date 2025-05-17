using LibraryAPI.Models;

namespace LibraryAPI.Interfaces
{
    public interface IBookService
    {
        Task<IEnumerable<Book>> GetAllBooksAsync();
        Task<IEnumerable<Book>> SearchBooksAsync(string searchTerm);
        Task<IEnumerable<Book>> FilterBooksAsync(string? author, int? year, string? publisher, Genre? genre);
        Task<Book?> GetBookByIdAsync(int id);
        Task<Book?> GetBookByCatalogNumberAsync(string catalogNumber);
        Task<Book> AddBookAsync(Book book);
        Task<Book?> UpdateBookAsync(int id, Book book);
        Task<bool> DeleteBookAsync(int id);
        Task<bool> UpdateBookQuantityAsync(int id, int quantity);
        Task<bool> UpdateCoverImagePathAsync(int id, string imagePath);
    }
}
