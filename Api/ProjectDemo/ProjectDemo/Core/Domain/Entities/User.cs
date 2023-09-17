using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectDemo.Core.Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string? Email { get; set; }
        public string UserName { get; set; }    
        public string HashPassword { get; set; }
        [NotMapped]
        public string? confirmPassword { get; set; }
        //[NotMapped]
        public string? ResetPasswordToken { get; set; }
        //[NotMapped]
        public DateTime? ResetPasswordExpiry { get; set; }

    }
}
