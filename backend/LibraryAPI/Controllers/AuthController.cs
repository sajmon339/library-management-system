using LibraryAPI.DTOs;
using LibraryAPI.Interfaces;
using LibraryAPI.Models;
using LibraryAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly JwtService _jwtService;

        public AuthController(IUserService userService, JwtService jwtService)
        {
            _userService = userService;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto registerDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (registerDto.Password != registerDto.ConfirmPassword)
                {
                    return BadRequest("Passwords do not match");
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
                    Role = UserRole.Customer // Default role for new registrations
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

                return CreatedAtAction(nameof(Register), userDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                Console.WriteLine($"Login attempt for email: {loginDto.Email}");
                
                if (!ModelState.IsValid)
                {
                    Console.WriteLine("Model state invalid");
                    return BadRequest(ModelState);
                }
                
                var isValidCredentials = await _userService.ValidateUserCredentialsAsync(loginDto.Email, loginDto.Password);
                if (!isValidCredentials)
                {
                    Console.WriteLine("Invalid credentials");
                    return Unauthorized("Invalid email or password");
                }

                var user = await _userService.GetUserByEmailAsync(loginDto.Email);
                if (user == null)
                {
                    Console.WriteLine("User not found after validation");
                    return Unauthorized("Invalid email or password");
                }

                var token = _jwtService.GenerateJwtToken(user);
                Console.WriteLine($"Token generated for user {user.UserName}");
                
                return Ok(new
                {
                    Token = token,
                    User = new UserDto
                    {
                        Id = user.Id,
                        UserName = user.UserName,
                        Email = user.Email,
                        Role = user.Role,
                        CreatedAt = user.CreatedAt
                    }
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Login error: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
        {
            try
            {
                var user = await _userService.GetUserByEmailAsync(forgotPasswordDto.Email);
                if (user == null)
                {
                    // Don't reveal that the user doesn't exist
                    return Ok(new { message = "If your email is registered, you will receive a password reset link." });
                }

                await _userService.GeneratePasswordResetTokenAsync(forgotPasswordDto.Email);
                
                return Ok(new { message = "If your email is registered, you will receive a password reset link." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
        {
            try
            {
                if (resetPasswordDto.NewPassword != resetPasswordDto.ConfirmNewPassword)
                {
                    return BadRequest("Passwords do not match");
                }

                var success = await _userService.ResetPasswordAsync(
                    resetPasswordDto.Email,
                    resetPasswordDto.Token,
                    resetPasswordDto.NewPassword);

                if (!success)
                {
                    return BadRequest("Invalid or expired token");
                }

                return Ok(new { message = "Password has been reset successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                {
                    return Unauthorized();
                }

                if (changePasswordDto.NewPassword != changePasswordDto.ConfirmNewPassword)
                {
                    return BadRequest("New passwords do not match");
                }

                var success = await _userService.ChangePasswordAsync(
                    userId,
                    changePasswordDto.CurrentPassword,
                    changePasswordDto.NewPassword);

                if (!success)
                {
                    return BadRequest("Current password is incorrect");
                }

                return Ok(new { message = "Password has been changed successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        
        [HttpPut("profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto updateProfileDto)
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                {
                    return Unauthorized();
                }
                
                // Get the current user
                var currentUser = await _userService.GetUserByIdAsync(userId);
                if (currentUser == null)
                {
                    return NotFound("User not found");
                }
                
                // Check if the email is being changed and if it's already in use
                if (currentUser.Email != updateProfileDto.Email)
                {
                    var existingUser = await _userService.GetUserByEmailAsync(updateProfileDto.Email);
                    if (existingUser != null && existingUser.Id != userId)
                    {
                        return Conflict("Email already in use by another account");
                    }
                }
                
                // Check if the username is being changed and if it's already in use
                if (currentUser.UserName != updateProfileDto.UserName)
                {
                    var existingUser = await _userService.GetUserByUsernameAsync(updateProfileDto.UserName);
                    if (existingUser != null && existingUser.Id != userId)
                    {
                        return Conflict("Username already in use by another account");
                    }
                }
                
                // Update user profile
                currentUser.UserName = updateProfileDto.UserName;
                currentUser.Email = updateProfileDto.Email;
                
                var updatedUser = await _userService.UpdateUserAsync(userId, currentUser);
                if (updatedUser == null)
                {
                    return StatusCode(500, "Failed to update user profile");
                }
                
                // Create a new token with updated information
                var token = _jwtService.GenerateJwtToken(updatedUser);
                
                return Ok(new
                {
                    Token = token,
                    User = new UserDto
                    {
                        Id = updatedUser.Id,
                        UserName = updatedUser.UserName,
                        Email = updatedUser.Email,
                        Role = updatedUser.Role,
                        CreatedAt = updatedUser.CreatedAt
                    },
                    Message = "Profile updated successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
