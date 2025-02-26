namespace Google_Map_Shield.Models
{
    public class Login
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public IFormFile? ProfilePic { get; set; }
        public string? RandomCode { get; set;}
        public string? ProfilePicPath {  get; set; }
        public string? Verification { get; set; }


        public string? oldPassword { get; set; }
        public string? newPassword { get; set; }

        public string? updatedpassword { get; set; }
    }
}
