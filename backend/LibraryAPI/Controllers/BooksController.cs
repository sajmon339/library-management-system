using LibraryAPI.Data;
using LibraryAPI.DTOs;
using LibraryAPI.Interfaces;
using LibraryAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace LibraryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly IBookService _bookService;
        private readonly IWebHostEnvironment _environment;
        
        public BooksController(IBookService bookService, IWebHostEnvironment environment)
        {
            _bookService = bookService;
            _environment = environment;
        }

        [HttpGet]
        public async Task<IActionResult> GetBooks([FromQuery] string? search, [FromQuery] string? author, 
            [FromQuery] int? year, [FromQuery] string? publisher, [FromQuery] Genre? genre)
        {
            try
            {
                if (!string.IsNullOrEmpty(search))
                {
                    var searchResults = await _bookService.SearchBooksAsync(search);
                    return Ok(searchResults);
                }
                
                if (author != null || year != null || publisher != null || genre != null)
                {
                    var filteredResults = await _bookService.FilterBooksAsync(author, year, publisher, genre);
                    return Ok(filteredResults);
                }
                
                var books = await _bookService.GetAllBooksAsync();
                return Ok(books);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBook(int id)
        {
            try
            {
                var book = await _bookService.GetBookByIdAsync(id);
                if (book == null)
                {
                    return NotFound();
                }
                
                return Ok(book);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        
        [HttpGet("catalog/{catalogNumber}")]
        public async Task<IActionResult> GetBookByCatalogNumber(string catalogNumber)
        {
            try
            {
                var book = await _bookService.GetBookByCatalogNumberAsync(catalogNumber);
                if (book == null)
                {
                    return NotFound();
                }
                
                return Ok(book);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateBook([FromBody] CreateBookDto bookDto)
        {
            try
            {
                var book = new Book
                {
                    Title = bookDto.Title,
                    Author = bookDto.Author,
                    PublishedYear = bookDto.PublishedYear,
                    Publisher = bookDto.Publisher,
                    Genre = bookDto.Genre,
                    CatalogNumber = bookDto.CatalogNumber ?? string.Empty,
                    TotalCopies = bookDto.TotalCopies
                };
                
                var createdBook = await _bookService.AddBookAsync(book);
                return CreatedAtAction(nameof(GetBook), new { id = createdBook.Id }, createdBook);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateBook(int id, [FromBody] UpdateBookDto bookDto)
        {
            try
            {
                var book = new Book
                {
                    Title = bookDto.Title,
                    Author = bookDto.Author,
                    PublishedYear = bookDto.PublishedYear,
                    Publisher = bookDto.Publisher,
                    Genre = bookDto.Genre
                };
                
                var updatedBook = await _bookService.UpdateBookAsync(id, book);
                if (updatedBook == null)
                {
                    return NotFound();
                }
                
                return Ok(updatedBook);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPatch("{id}/quantity")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateBookQuantity(int id, [FromBody] UpdateBookQuantityDto quantityDto)
        {
            try
            {
                var success = await _bookService.UpdateBookQuantityAsync(id, quantityDto.Quantity);
                if (!success)
                {
                    return NotFound();
                }
                
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            try
            {
                var success = await _bookService.DeleteBookAsync(id);
                if (!success)
                {
                    return NotFound();
                }
                
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        
        // Book Cover Image Endpoints
        
        [HttpPost("{id}/cover")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UploadCoverImage(int id, IFormFile coverImage)
        {
            try
            {
                var book = await _bookService.GetBookByIdAsync(id);
                if (book == null)
                {
                    return NotFound();
                }
                
                // Validate file
                if (coverImage == null || coverImage.Length == 0)
                {
                    return BadRequest("No file was uploaded.");
                }
                
                // Check file is an image
                if (!coverImage.ContentType.StartsWith("image/"))
                {
                    return BadRequest("Only image files are allowed.");
                }
                
                // Check file size (5MB max)
                if (coverImage.Length > 5 * 1024 * 1024)
                {
                    return BadRequest("File size should be less than 5MB.");
                }
                
                // Create uploads directory if it doesn't exist
                var uploadsDirectory = Path.Combine(_environment.ContentRootPath, "wwwroot", "uploads", "covers");
                if (!Directory.Exists(uploadsDirectory))
                {
                    Directory.CreateDirectory(uploadsDirectory);
                }
                
                // Delete old image if exists
                if (!string.IsNullOrEmpty(book.CoverImagePath) && System.IO.File.Exists(book.CoverImagePath))
                {
                    System.IO.File.Delete(book.CoverImagePath);
                }
                
                // Generate unique filename
                var fileName = $"{book.Id}_{Guid.NewGuid()}{Path.GetExtension(coverImage.FileName)}";
                var filePath = Path.Combine(uploadsDirectory, fileName);
                
                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await coverImage.CopyToAsync(stream);
                }
                
                // Update book record with image path
                await _bookService.UpdateCoverImagePathAsync(book.Id, filePath);
                
                return Ok(new { message = "Cover image uploaded successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        
        [HttpGet("{id}/cover")]
        public async Task<IActionResult> GetCoverImage(int id)
        {
            try
            {
                var book = await _bookService.GetBookByIdAsync(id);
                if (book == null)
                {
                    return NotFound();
                }
                
                // Check if book has cover image
                if (string.IsNullOrEmpty(book.CoverImagePath) || !System.IO.File.Exists(book.CoverImagePath))
                {
                    // Return a placeholder image or not found
                    return NotFound("No cover image available");
                }
                
                // Determine content type based on file extension
                var contentType = "image/jpeg"; // Default to jpeg
                var extension = Path.GetExtension(book.CoverImagePath).ToLowerInvariant();
                
                switch (extension)
                {
                    case ".png":
                        contentType = "image/png";
                        break;
                    case ".gif":
                        contentType = "image/gif";
                        break;
                    case ".webp":
                        contentType = "image/webp";
                        break;
                }
                
                // Return the image file
                var imageBytes = await System.IO.File.ReadAllBytesAsync(book.CoverImagePath);
                return File(imageBytes, contentType);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
