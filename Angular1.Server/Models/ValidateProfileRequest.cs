namespace Angular1.Server.Models
{
    public class ValidateProfileRequest
    {
        public int UserId { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
    }
}
