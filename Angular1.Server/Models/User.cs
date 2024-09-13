namespace Angular1.Server.Models
{
    public class User
    {
        public int Id { get; set; }
        public string? Username { get; set; }
        public bool? IsEnabled { get; set; }
        public bool? IsDeleted { get; set; }

    }
}
