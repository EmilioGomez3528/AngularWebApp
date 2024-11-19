namespace Angular1.Server.Models
{
    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public bool IsLocal { get; set; }
    }
}
