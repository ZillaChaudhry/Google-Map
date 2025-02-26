using Google_Map_Shield.Models;
using System.Data.SqlClient;
using System.Data;

namespace Google_Map_Shield.Repository.Admin
{
    public class Admin : IAdmin
    {
        private readonly string _ConfigurationString;

        public Admin(IConfiguration configuration)
        {
            _ConfigurationString = configuration.GetConnectionString("DefaultConnection") ?? "";
        }

        public async Task<List<Models.Report>> ShowonMap()
        {
            List<Models.Report> reportList = new List<Models.Report>();
            try
            {
                using (SqlConnection con = new SqlConnection(_ConfigurationString))
                {
                    using (SqlCommand cmd = new SqlCommand("Admin", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@id", string.Empty);
                        cmd.Parameters.AddWithValue("@Email", string.Empty);
                        cmd.Parameters.AddWithValue("@Password", string.Empty);
                        cmd.Parameters.AddWithValue("@action", 5);

                        await con.OpenAsync();

                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                Models.Report report = new Models.Report
                                {
                                    tolatitude = Convert.ToDecimal(reader["tolatitude"]),
                                    tolongitude = Convert.ToDecimal(reader["tolongitude"]),
                                    fromlatitude = Convert.ToDecimal(reader["fromlatitude"]),
                                    fromlongitude = Convert.ToDecimal(reader["fromlongitude"]),
                                    review_type = reader["review_type"].ToString()
                                };
                                reportList.Add(report);
                            }
                        }
                    }
                }

                return reportList;
            }
            catch (Exception ex)
            {
                return new List<Models.Report>();
            }

        }

        public async Task Approve_Report(int reportId)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_ConfigurationString))
                {
                    using (SqlCommand cmd = new SqlCommand("Admin", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@id", reportId);
                        cmd.Parameters.AddWithValue("@Email", string.Empty);
                        cmd.Parameters.AddWithValue("@Password", string.Empty);
                        cmd.Parameters.AddWithValue("@action", 4);

                        await con.OpenAsync();
                        await cmd.ExecuteNonQueryAsync(); // Execute the stored procedure
                    }
                }
            }
            catch (Exception ex)
            {
                // Log or handle exception
            }
        }

        public async Task Delete_Report(int reportId)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_ConfigurationString))
                {
                    using (SqlCommand cmd = new SqlCommand("Admin", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@id", reportId);
                        cmd.Parameters.AddWithValue("@Email", string.Empty);
                        cmd.Parameters.AddWithValue("@Password", string.Empty);
                        cmd.Parameters.AddWithValue("@action", 3);

                        await con.OpenAsync();
                        await cmd.ExecuteNonQueryAsync(); // Execute the stored procedure
                    }
                }
            }
            catch (Exception ex)
            {
                // Log or handle exception
            }
        }


        public async Task<List<Models.Report>> Show_Report()
        {
            List<Models.Report> reportList = new List<Models.Report>();
            try
            {
                using (SqlConnection con = new SqlConnection(_ConfigurationString))
                {
                    using (SqlCommand cmd = new SqlCommand("Admin", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@id", string.Empty);
                        cmd.Parameters.AddWithValue("@Email", string.Empty);
                        cmd.Parameters.AddWithValue("@Password", string.Empty);
                        cmd.Parameters.AddWithValue("@action", 2);

                        await con.OpenAsync();

                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                Models.Report report = new Models.Report
                                {
                                    Id = Convert.ToInt32(reader["id"]),
                                    title = reader["title"].ToString(),
                                    description = reader["description"].ToString(),
                                    vidpicproofath = reader["vidpicproof"].ToString(),
                                    review_type = reader["review_type"].ToString(),
                                    tolatitude = Convert.ToDecimal(reader["tolatitude"]),
                                    tolongitude = Convert.ToDecimal(reader["tolongitude"]),
                                    fromlatitude = Convert.ToDecimal(reader["fromlatitude"]),
                                    fromlongitude = Convert.ToDecimal(reader["fromlongitude"])
                                };
                                reportList.Add(report);
                            }
                        }
                    }
                }

                return reportList;
            }
            catch (Exception ex)
            {
                return new List<Models.Report>();
            }
        }


        public async Task<Models.Admin_Login?> AdminLogin(Models.Admin_Login logs)
        {
            try
            {
                Models.Admin_Login? Returnlogin = null; // Initialize as null

                using (SqlConnection con = new SqlConnection(_ConfigurationString))
                {
                    using (SqlCommand cmd = new SqlCommand("Admin", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@id", string.Empty);
                        cmd.Parameters.AddWithValue("@Email", logs.Email);
                        cmd.Parameters.AddWithValue("@Password", logs.Password);
                        cmd.Parameters.AddWithValue("@action", 1);

                        await con.OpenAsync();

                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync()) // Ensure we have data
                            {
                                Returnlogin = new Models.Admin_Login
                                {
                                    Email = reader["email"].ToString(),
                                    Password = reader["password"].ToString(),
                                    Profilepic = reader["profilepic"].ToString()
                                };
                            }
                        }
                    }
                }

                return Returnlogin;
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}
