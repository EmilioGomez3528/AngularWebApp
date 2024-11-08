namespace Angular1.Server.Models
{
    public class User
    {
        public int UserId { get; set; }
        public int OrganizationId { get; set; }
        public int? IsOauth { get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; } 
        public string? Email { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? OrganizationName { get; set; }
        public string? Roles { get; set; }
        public bool PasswordEncrypted { get; set; }
        public string? PasswordSalt { get; set; }
        public string? ProviderUserId { get; set; }
        public string Message { get; set; }
        public string Provider { get; set; }
        public string? Initials { get; set; }

    }
}
