using Google_Map_Shield.Models;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
namespace Google_Map_Shield.Repository
{
    public class Login : ILogin
    {
        private readonly string _ConfigurationString;
        public Login(IConfiguration configuration)
        {
            _ConfigurationString = configuration.GetConnectionString("DefaultConnection") ?? "";
        }

        public async Task<string> UpdateForgotPassword(Models.Login logs)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_ConfigurationString))
                {
                    using (SqlCommand cmd = new SqlCommand("proc_UserInfo", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@name", logs.Name ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@email", logs.Email);
                    cmd.Parameters.AddWithValue("@password", logs.newPassword);
                    cmd.Parameters.AddWithValue("@profilepic", logs.ProfilePicPath ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@action", 6);

                    await con.OpenAsync();
                    int rowsAffected = await cmd.ExecuteNonQueryAsync();

                    if (rowsAffected > 0)
                    {
                        return "Account Successfully Updated";
                    }
                    else
                    {
                        return "No account found with the specified email";
                    }
                }
            }
            }
            catch (Exception ex)
            {
                return $"Error: {ex.Message}";
            }
        }

        public async Task<string> ProfileRecord(Models.Login log)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_ConfigurationString))
                {
                    using (SqlCommand cmd = new SqlCommand("proc_UserInfo", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@name", log.Name ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@email", log.Email);
                        cmd.Parameters.AddWithValue("@password", (object)(log.updatedpassword ?? log.oldPassword) ?? DBNull.Value);
                        cmd.Parameters.AddWithValue("@profilepic", log.ProfilePicPath ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@action", 5);

                        await con.OpenAsync();
                        await cmd.ExecuteNonQueryAsync();
                        return "Account Successfully Updated";
                    }
                }
            }
            catch (Exception ex)
            {
                return $"Error: {ex.Message}";
            }
        }


        public async Task<Models.Login> ProfileRecord(string email)
        {
            try
            {
                await using (SqlConnection con = new SqlConnection(_ConfigurationString))
                {
                    await using (SqlCommand cmd = new SqlCommand("proc_UserInfo", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@name", DBNull.Value);
                        cmd.Parameters.AddWithValue("@email", email ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@password", DBNull.Value);
                        cmd.Parameters.AddWithValue("@profilepic",DBNull.Value);
                        cmd.Parameters.AddWithValue("@action", 4);

                        await con.OpenAsync();
                        await using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                Models.Login profilerecord = new Models.Login();
                                
                                profilerecord.Name = reader["name"] != DBNull.Value ? reader["name"]?.ToString() : null;
                                profilerecord.Email = reader["email"] != DBNull.Value ? reader["email"]?.ToString() : null;
                                profilerecord.Password = reader["password"] != DBNull.Value ? reader["password"]?.ToString() : null;
                                profilerecord.ProfilePicPath = reader["profilepic"] != DBNull.Value ? reader["ProfilePic"]?.ToString() : null;
                                return profilerecord;
                            }
                            else
                            {
                                return new Models.Login();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return new Models.Login();
            }
        }

        public async Task<(string Message, string? ProfilePicPath)> Logins(Models.Login login)
        {
            try
            {
                await using (SqlConnection con = new SqlConnection(_ConfigurationString))
                {
                    await using (SqlCommand cmd = new SqlCommand("proc_UserInfo", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@name", login.Name ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@email", login.Email ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@password", login.Password ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@profilepic", login.ProfilePicPath ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@action", 3);

                        await con.OpenAsync();
                        await using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                string message = reader["Message"]?.ToString() ?? "Unknown response from server.";
                                string? profilePic = reader["ProfilePic"] != DBNull.Value ? reader["ProfilePic"]?.ToString() : null;

                                return (message, profilePic);
                            }
                            else
                            {
                                return ("No response from server.", null);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Log exception if necessary
                return ($"Error: {ex.Message}", null);
            }
        }

        public async Task<string> AcountExist(Models.Login login)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_ConfigurationString))
                {
                    using (SqlCommand cmd = new SqlCommand("proc_UserInfo", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        // Add parameters with handling for null values
                        cmd.Parameters.AddWithValue("@name", string.IsNullOrEmpty(login.Name) ? (object)DBNull.Value : login.Name);
                        cmd.Parameters.AddWithValue("@email", login.Email ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@password", login.Password ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@profilepic", string.IsNullOrEmpty(login.ProfilePicPath) ? (object)DBNull.Value : login.ProfilePicPath);
                        cmd.Parameters.AddWithValue("@action", 2);

                        await con.OpenAsync();

                        var result = await cmd.ExecuteScalarAsync();

                        if (result != null && Convert.ToInt32(result) > 0)
                        {
                            return "Account Already Exist";
                        }
                        else
                        {
                            return "Account Does Not Exist";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Log exception if necessary
                return $"Error: {ex.Message}";
            }
        }

        public async Task<string> SignUp(Models.Login login)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_ConfigurationString))
                {
                    using (SqlCommand cmd = new SqlCommand("proc_UserInfo", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@name", login.Name);
                        cmd.Parameters.AddWithValue("@email", login.Email);
                        cmd.Parameters.AddWithValue("@password", login.Password);
                        cmd.Parameters.AddWithValue("@profilepic", login.ProfilePicPath ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@action", 1);
                        await con.OpenAsync();
                        await cmd.ExecuteNonQueryAsync();
                        return "Account Successfully Created";
                    }
                }
                        

            }
            catch (Exception ex)
            {
                // Log exception if necessary
                return $"Error: {ex.Message}";
            }
        }

        
    }
}
