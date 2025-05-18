using LibraryAPI.Models;

namespace LibraryAPI.Interfaces
{
    public interface ICheckOutService
    {
        Task<IEnumerable<CheckOut>> GetAllCheckOutsAsync();
        Task<IEnumerable<CheckOut>> GetActiveCheckOutsAsync();
        Task<IEnumerable<CheckOut>> GetOverdueCheckOutsAsync();
        Task<IEnumerable<CheckOut>> GetUserCheckOutsAsync(int userId);
        Task<CheckOut?> GetCheckOutByIdAsync(int id);
        Task<CheckOut> CheckOutBookAsync(int userId, int bookId, int daysToReturn = 14);
        Task<CheckOut?> ReturnBookAsync(int checkOutId);
        Task<CheckOut?> RenewCheckOutAsync(int checkOutId, int additionalDays = 14);
        Task<CheckOut?> UpdateCheckOutStatusAsync(int checkOutId, CheckOutStatus newStatus);
    }
}
