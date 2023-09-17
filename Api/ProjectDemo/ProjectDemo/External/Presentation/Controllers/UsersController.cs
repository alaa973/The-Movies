using Azure.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NuGet.Common;
using ProjectDemo.Core.Application.Services;
using ProjectDemo.Core.Domain.Abstraction;
using ProjectDemo.Core.Domain.Entities;
using ProjectDemo.Core.Domain.ViewModels;
using ProjectDemo.External.Infrastructure;
using ProjectDemo.Helpers;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json.Nodes;

namespace ProjectDemo.External.Presentation.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private DBContext _context;
        private readonly ILogger<UsersController> _logger;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        public UsersController(DBContext dBContext, ILogger<UsersController> logger,
           IConfiguration configuration, IEmailService emailService)
        {
            _context = dBContext;
            _logger = logger;
            _configuration = configuration;
            _emailService = emailService;
        }
        [HttpGet]
        [Route("currentUser")]
        public User getCurrentUser()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim != null)
            {
                
                return _context.Users.FirstOrDefault(u => u.Id.ToString() == userIdClaim);

                
            }

            return null;
        }
        [Authorize]
        [HttpPatch("{id}")]
        public IActionResult editUser(int id, [FromBody] User user)
        {
            User existingUser = _context.Users.Find(id);
            if(user.UserName != null)
            {
                existingUser.UserName = user.UserName;
            }
            if (user.Email != null)
            {
                existingUser.Email = user.Email;
            }
            if(existingUser.HashPassword != null)
            {
                existingUser.HashPassword = BCrypt.Net.BCrypt.HashPassword(user.HashPassword);
            }
            _context.SaveChanges();
            return Ok(existingUser);
        }

        [HttpPost("login")]
        public IActionResult Login(User user)
        {
            var existingUser = _context.Users.FirstOrDefault(u => u.UserName == user.UserName);
            user.Id = existingUser.Id;
            if (existingUser == null || !BCrypt.Net.BCrypt.Verify(user.HashPassword, existingUser.HashPassword))
            {
                return Unauthorized("Invalid credentials");
            }
            else
            {
                object token;
                if (user.Id == 39)
                {
                    token = GenerateAuthToken(user, "admin");
                }
                else
                {
                    token = GenerateAuthToken(user, "viewer");
                }

                return Ok(token);
            }

        }
        [Authorize]
        [HttpPost("{id}/verify/password")]
        public IActionResult verifyPassword(int id,[FromBody] PasswordVerificationRequest request)
        {
            var existingUser = _context.Users.Find(id);
            return BCrypt.Net.BCrypt.Verify(request.password, existingUser.HashPassword)? Ok(true): BadRequest("Password is incorrect");
        }

        [HttpPost("register")]
        public IActionResult RegisterUser(User user)
        {
            try
            {
                if(user.HashPassword==user.confirmPassword)
                {
                    user.HashPassword = BCrypt.Net.BCrypt.HashPassword(user.HashPassword);
                    _context.Users.Add(user);
                    _context.SaveChanges();
                    object token;
                    if (user.Email == "alaamostafayamany@gmail.com")
                    {
                         token = GenerateAuthToken(user,"admin");
                    }
                    else
                    {
                         token = GenerateAuthToken(user, "viewer");
                    }
                    return Ok(token);

                }
                return BadRequest("Passwords don't match.");
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException.Message.Contains("UNIQUE KEY"))
                {
                    return BadRequest("Username or email already exists.");
                }
                else
                {
                    return StatusCode(500, "An error occurred while registering.");
                }
            }

        }
        private object GenerateAuthToken(User user, string role)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("this is my custom Secret key for authentication");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim("password", user.HashPassword),
          
                    new Claim(ClaimTypes.Role, role),
                }),
                Expires = DateTime.UtcNow.AddHours(2), // Token expiration time
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return new
            {
                Token = tokenHandler.WriteToken(token),
                Expiration = tokenDescriptor.Expires
            };
        }

        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {

            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (!string.IsNullOrEmpty(userId))
            {
                _context.TokenBlacklist.Add(new TokenBlacklist()
                {
                    Token = userId
                });
                _context.SaveChanges();
                return Ok("Logout successful");
            }

            return StatusCode(500, "An error occurred during logout.");


        }
        [Authorize]
        [HttpDelete("{id}")]
        public void DeleteAcc(int id)
        {

            _context.Users.Remove(_context.Users.Find(id));
            _context.SaveChanges();
        }
        [HttpPost]
        [Route("send-reset-email/{email}")]
        public async Task<IActionResult> SendEmail(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(a => a.Email == email);
            if (user is null)
                return NotFound(new
                {
                    StatusCode = 404,
                    Message = "Email Doesn't Exist."
                });
            var tokenBytes = RandomNumberGenerator.GetBytes(64);
            var emailToken = Convert.ToBase64String(tokenBytes);
            user.ResetPasswordToken = emailToken;
            user.ResetPasswordExpiry = DateTime.Now.AddMinutes(5);
            string from = _configuration["EmailConfiguration:From"];
            EmailModel emailModel = new EmailModel(email, "Reset Password!",
                EmailBody.EmailStringBody(email, emailToken));
            _emailService.sendEmail(emailModel);        
            //_context.Entry(user).State = EntityState.Modified;
           await _context.SaveChangesAsync();
           
            return Ok(new
            {
                StatusCode = 200,
                Message = "Email Sent!"
            });
        }
        [HttpPost]
        [Route("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto resetPasswordDto)
        {
            var newToken = resetPasswordDto.EmailToken.Replace(" ", "+");
            var user = await _context.Users.FirstOrDefaultAsync(a => resetPasswordDto.Email == a.Email);
            if (user is null)
                return NotFound(new
                {
                    StatusCode = 404,
                    Message = "No user found with this email!"
                });
            var tokenCode = user.ResetPasswordToken;
            DateTime emailTokenExpiry = (DateTime)user.ResetPasswordExpiry;
            var first = tokenCode != resetPasswordDto.EmailToken;
            var second = emailTokenExpiry < DateTime.Now;
            if (first || second)
                return NotFound(new
                {
                    StatusCode = 400,
                    Message = "Invalid reset link!"
                });
                    user.HashPassword = BCrypt.Net.BCrypt.HashPassword(resetPasswordDto.NewPassword);
            //_context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok(new
            {
                StatusCode = 200,
                Message = "Password Reset Successfully!"
            });
        }
    }
}
