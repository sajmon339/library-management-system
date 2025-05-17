using LibraryAPI.DTOs;
using LibraryAPI.Interfaces;
using LibraryAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _userService.GetAllUsersAsync();
                var userDtos = users.Select(u => new UserDto
                {
                    Id = u.Id,
                    UserName = u.UserName,
                    Email = u.Email,
                    Role = u.Role,
                    CreatedAt = u.CreatedAt
                });
                
                return Ok(userDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);
                if (user == null)
                {
                    return NotFound();
                }

                var userDto = new UserDto
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    Role = user.Role,
                    CreatedAt = user.CreatedAt
                };
                
                return Ok(userDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] RegisterUserDto registerDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var existingUserByEmail = await _userService.GetUserByEmailAsync(registerDto.Email);
                if (existingUserByEmail != null)
                {
                    return Conflict("Email already in use");
                }

                // Generate a username from the email (part before @)
                string username = registerDto.Email.Split('@')[0];
                
                // Ensure username uniqueness by appending a random number if needed
                var existingUserByUsername = await _userService.GetUserByUsernameAsync(username);
                if (existingUserByUsername != null)
                {
                    // Add a random suffix
                    username = $"{username}{new Random().Next(1000, 9999)}";
                }

                var user = new User
                {
                    UserName = username,
                    Email = registerDto.Email,
                    Role = UserRole.Customer // Default role, can be changed later
                };

                var createdUser = await _userService.RegisterUserAsync(user, registerDto.Password);
                
                var userDto = new UserDto
                {
                    Id = createdUser.Id,
                    UserName = createdUser.UserName,
                    Email = createdUser.Email,
                    Role = createdUser.Role,
                    CreatedAt = createdUser.CreatedAt
                };

                return CreatedAtAction(nameof(GetUserById), new { id = createdUser.Id }, userDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPatch("{id}/role")]
        public async Task<IActionResult> UpdateUserRole(int id, [FromBody] UpdateUserRoleDto updateRoleDto)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);
                if (user == null)
                {
                    return NotFound();
                }

                var success = await _userService.UpdateUserRoleAsync(id, updateRoleDto.Role);
                if (!success)
                {
                    return StatusCode(500, "Failed to update user role");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var success = await _userService.DeleteUserAsync(id);
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
    }
}
