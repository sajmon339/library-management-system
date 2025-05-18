using LibraryAPI.Data;
using LibraryAPI.Interfaces;
using LibraryAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryAPI.Services
{
    public class CheckOutService : ICheckOutService
    {
        private readonly ApplicationDbContext _context;

        public CheckOutService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CheckOut>> GetAllCheckOutsAsync()
        {
            return await _context.CheckOuts
                .Include(c => c.Book)
                .Include(c => c.User)
                .ToListAsync();
        }

        public async Task<IEnumerable<CheckOut>> GetActiveCheckOutsAsync()
        {
            return await _context.CheckOuts
                .Include(c => c.Book)
                .Include(c => c.User)
                .Where(c => c.Status == CheckOutStatus.Active)
                .ToListAsync();
        }

        public async Task<IEnumerable<CheckOut>> GetOverdueCheckOutsAsync()
        {
            var now = DateTime.UtcNow;
            return await _context.CheckOuts
                .Include(c => c.Book)
                .Include(c => c.User)
                .Where(c => c.Status == CheckOutStatus.Active && c.DueDate < now)
                .ToListAsync();
        }

        public async Task<IEnumerable<CheckOut>> GetUserCheckOutsAsync(int userId)
        {
            return await _context.CheckOuts
                .Include(c => c.Book)
                .Include(c => c.User)
                .Where(c => c.UserId == userId)
                .ToListAsync();
        }

        public async Task<CheckOut?> GetCheckOutByIdAsync(int id)
        {
            return await _context.CheckOuts
                .Include(c => c.Book)
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<CheckOut> CheckOutBookAsync(int userId, int bookId, int daysToReturn = 14)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Check if book exists and is available
                var book = await _context.Books.FindAsync(bookId);
                if (book == null)
                {
                    throw new InvalidOperationException("Book not found");
                }

                if (book.AvailableCopies <= 0)
                {
                    throw new InvalidOperationException("No copies available for checkout");
                }

                // Check if user exists
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    throw new InvalidOperationException("User not found");
                }

                // Create checkout record
                var checkOut = new CheckOut
                {
                    BookId = bookId,
                    UserId = userId,
                    CheckOutDate = DateTime.UtcNow,
                    DueDate = DateTime.UtcNow.AddDays(daysToReturn),
                    Status = CheckOutStatus.Active
                };

                _context.CheckOuts.Add(checkOut);

                // Update book availability
                book.AvailableCopies--;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return checkOut;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<CheckOut?> ReturnBookAsync(int checkOutId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var checkOut = await _context.CheckOuts
                    .Include(c => c.Book)
                    .FirstOrDefaultAsync(c => c.Id == checkOutId);

                if (checkOut == null || checkOut.Status != CheckOutStatus.Active)
                {
                    return null;
                }

                // Update checkout record
                checkOut.ReturnDate = DateTime.UtcNow;
                checkOut.Status = CheckOutStatus.Returned;

                // Update book availability
                var book = checkOut.Book;
                book.AvailableCopies++;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return checkOut;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<CheckOut?> RenewCheckOutAsync(int checkOutId, int additionalDays = 14)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var checkOut = await _context.CheckOuts
                    .Include(c => c.Book)
                    .FirstOrDefaultAsync(c => c.Id == checkOutId);

                if (checkOut == null || checkOut.Status != CheckOutStatus.Active)
                {
                    return null;
                }

                // Update checkout due date
                checkOut.DueDate = DateTime.UtcNow.AddDays(additionalDays);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return checkOut;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<CheckOut?> UpdateCheckOutStatusAsync(int checkOutId, CheckOutStatus newStatus)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var checkOut = await _context.CheckOuts
                    .Include(c => c.Book)
                    .FirstOrDefaultAsync(c => c.Id == checkOutId);

                if (checkOut == null)
                {
                    return null;
                }

                // If we're changing from active to anything else, or to active from anything else,
                // we need to update the book availability
                bool wasActive = checkOut.Status == CheckOutStatus.Active;
                bool willBeActive = newStatus == CheckOutStatus.Active;

                if (wasActive && !willBeActive)
                {
                    // Book is being returned or considered lost
                    checkOut.Book.AvailableCopies++;
                    
                    if (newStatus == CheckOutStatus.Returned)
                    {
                        checkOut.ReturnDate = DateTime.UtcNow;
                    }
                }
                else if (!wasActive && willBeActive)
                {
                    // Book is being checked out again
                    if (checkOut.Book.AvailableCopies <= 0)
                    {
                        throw new InvalidOperationException("No copies available for checkout");
                    }
                    
                    checkOut.Book.AvailableCopies--;
                    checkOut.ReturnDate = null;
                }

                checkOut.Status = newStatus;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return checkOut;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
    }
}
