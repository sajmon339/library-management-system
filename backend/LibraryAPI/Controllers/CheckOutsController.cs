using LibraryAPI.DTOs;
using LibraryAPI.Interfaces;
using LibraryAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CheckOutsController : ControllerBase
    {
        private readonly ICheckOutService _checkOutService;
        private readonly IBookService _bookService;
        private readonly IUserService _userService;

        public CheckOutsController(
            ICheckOutService checkOutService,
            IBookService bookService,
            IUserService userService)
        {
            _checkOutService = checkOutService;
            _bookService = bookService;
            _userService = userService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllCheckOuts()
        {
            try
            {
                var checkOuts = await _checkOutService.GetAllCheckOutsAsync();
                var checkOutDtos = checkOuts.Select(MapToDto);
                return Ok(checkOutDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("active")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetActiveCheckOuts()
        {
            try
            {
                var checkOuts = await _checkOutService.GetActiveCheckOutsAsync();
                var checkOutDtos = checkOuts.Select(MapToDto);
                return Ok(checkOutDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("overdue")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetOverdueCheckOuts()
        {
            try
            {
                var checkOuts = await _checkOutService.GetOverdueCheckOutsAsync();
                var checkOutDtos = checkOuts.Select(MapToDto);
                return Ok(checkOutDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("user/{userId:int}")]
        public async Task<IActionResult> GetUserCheckOuts(int userId)
        {
            try
            {
                // If userId is 0, use the current user's ID
                if (userId == 0)
                {
                    var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                    if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int currentUserId))
                    {
                        return Unauthorized();
                    }
                    
                    userId = currentUserId;
                }
                // Check if the user is trying to access another user's check-outs without admin rights
                else
                {
                    var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                    if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int currentUserId))
                    {
                        return Unauthorized();
                    }

                    if (userId != currentUserId && !User.IsInRole("Admin"))
                    {
                        return Forbid();
                    }
                }

                var checkOuts = await _checkOutService.GetUserCheckOutsAsync(userId);
                var checkOutDtos = checkOuts.Select(MapToDto);
                return Ok(checkOutDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCheckOutById(int id)
        {
            try
            {
                var checkOut = await _checkOutService.GetCheckOutByIdAsync(id);
                if (checkOut == null)
                {
                    return NotFound();
                }

                // Check if the user is trying to access another user's check-out without admin rights
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int currentUserId))
                {
                    return Unauthorized();
                }

                if (checkOut.UserId != currentUserId && !User.IsInRole("Admin"))
                {
                    return Forbid();
                }

                return Ok(MapToDto(checkOut));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CheckOutBook([FromBody] CreateCheckOutDto createCheckOutDto)
        {
            try
            {
                // Check if the user is trying to check out a book for another user without admin rights
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int currentUserId))
                {
                    return Unauthorized();
                }

                // If userId is 0, use the current user's ID extracted from the token
                if (createCheckOutDto.UserId == 0)
                {
                    createCheckOutDto.UserId = currentUserId;
                }
                // Otherwise, check if the user is trying to check out a book for another user without admin rights
                else if (createCheckOutDto.UserId != currentUserId && !User.IsInRole("Admin"))
                {
                    return Forbid();
                }

                // Verify book exists
                var book = await _bookService.GetBookByIdAsync(createCheckOutDto.BookId);
                if (book == null)
                {
                    return NotFound("Book not found");
                }

                // Verify user exists
                var user = await _userService.GetUserByIdAsync(createCheckOutDto.UserId);
                if (user == null)
                {
                    return NotFound("User not found");
                }

                // Check out the book
                var checkOut = await _checkOutService.CheckOutBookAsync(
                    createCheckOutDto.UserId,
                    createCheckOutDto.BookId,
                    createCheckOutDto.DaysToReturn);

                return CreatedAtAction(nameof(GetCheckOutById), new { id = checkOut.Id }, MapToDto(checkOut));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("{id}/return")]
        public async Task<IActionResult> ReturnBook(int id)
        {
            try
            {
                var checkOut = await _checkOutService.GetCheckOutByIdAsync(id);
                if (checkOut == null)
                {
                    return NotFound();
                }

                // Only admin can return books
                if (!User.IsInRole("Admin"))
                {
                    return Forbid();
                }

                var returnedCheckOut = await _checkOutService.ReturnBookAsync(id);
                if (returnedCheckOut == null)
                {
                    return BadRequest("Unable to return the book. It may already be returned or in another state.");
                }

                return Ok(MapToDto(returnedCheckOut));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("{id}/renew")]
        public async Task<IActionResult> RenewCheckOut(int id)
        {
            try
            {
                var checkOut = await _checkOutService.GetCheckOutByIdAsync(id);
                if (checkOut == null)
                {
                    return NotFound();
                }

                // Only admin can renew books for now
                if (!User.IsInRole("Admin"))
                {
                    return Forbid();
                }

                var renewedCheckOut = await _checkOutService.RenewCheckOutAsync(id);
                if (renewedCheckOut == null)
                {
                    return BadRequest("Unable to renew the checkout. It may already be returned or in another state.");
                }

                return Ok(MapToDto(renewedCheckOut));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateCheckOutStatus(int id, [FromBody] UpdateCheckOutStatusDto updateStatusDto)
        {
            try
            {
                var updatedCheckOut = await _checkOutService.UpdateCheckOutStatusAsync(id, updateStatusDto.Status);
                if (updatedCheckOut == null)
                {
                    return NotFound();
                }

                if (updateStatusDto.Notes != null)
                {
                    // We'd need to add a method to update notes in our service
                    // For now, we'll just note this as a TODO
                }

                return Ok(MapToDto(updatedCheckOut));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Helper method to convert CheckOut to CheckOutDto
        private CheckOutDto MapToDto(CheckOut checkOut)
        {
            return new CheckOutDto
            {
                Id = checkOut.Id,
                BookId = checkOut.BookId,
                BookTitle = checkOut.Book?.Title ?? "Unknown",
                CatalogNumber = checkOut.Book?.CatalogNumber ?? "Unknown",
                UserId = checkOut.UserId,
                UserName = checkOut.User?.UserName ?? "Unknown",
                CheckOutDate = checkOut.CheckOutDate,
                DueDate = checkOut.DueDate,
                ReturnDate = checkOut.ReturnDate,
                Status = checkOut.Status,
                Notes = checkOut.Notes
            };
        }
    }
}
