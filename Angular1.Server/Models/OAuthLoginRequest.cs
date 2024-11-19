namespace Angular1.Server.Models
{
    public class OAuthLoginRequest
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string ProviderUserId { get; set; }
        public string Provider { get; set; }
    }
}
