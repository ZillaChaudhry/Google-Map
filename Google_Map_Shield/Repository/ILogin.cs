namespace Google_Map_Shield.Repository
{
    public interface ILogin
    {
        public Task<string> AcountExist(Models.Login login);
        public Task<string> SignUp(Models.Login login);
        public Task<(string Message, string? ProfilePicPath)> Logins(Models.Login login);
        public Task<Models.Login> ProfileRecord(string email);
        public Task<string> ProfileRecord(Models.Login log);
        public Task<string> UpdateForgotPassword(Models.Login logs);
    }
}
