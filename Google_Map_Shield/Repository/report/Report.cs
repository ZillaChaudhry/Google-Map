using System.Data.SqlClient;
using System.Data;

namespace Google_Map_Shield.Repository.report
{
    public class Report:IReport
    {
        private readonly string _ConfigurationString;
        public Report(IConfiguration configuration)
        {
            _ConfigurationString = configuration.GetConnectionString("DefaultConnection") ?? "";
        }
        public async Task<string> GetReport(Models.Report report)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_ConfigurationString))
                {
                    using (SqlCommand cmd = new SqlCommand("proc_InsertReport", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        // Adding input parameters
                        cmd.Parameters.AddWithValue("@action", 1); // Assuming 1 is the action for insertion
                        cmd.Parameters.AddWithValue("@email", report.email);
                        cmd.Parameters.AddWithValue("@title", (object)report.title ?? DBNull.Value);
                        cmd.Parameters.AddWithValue("@description", (object)report.description ?? DBNull.Value);
                        cmd.Parameters.AddWithValue("@vidpicproof", (object)report.vidpicproofath ?? DBNull.Value); // Assuming property name is correct
                        cmd.Parameters.AddWithValue("@review_type", (object)report.review_type ?? DBNull.Value);
                        cmd.Parameters.AddWithValue("@points", report.review_type == "good" ? 1 : 0);
                        cmd.Parameters.AddWithValue("@UserType", (object)report.UserType ?? DBNull.Value);
                        cmd.Parameters.AddWithValue("@fromlatitude", report.fromlatitude);
                        cmd.Parameters.AddWithValue("@fromlongitude", report.fromlongitude);
                        cmd.Parameters.AddWithValue("@tolatitude", report.tolatitude);
                        cmd.Parameters.AddWithValue("@tolongitude", report.tolongitude);

                        await con.OpenAsync();
                        await cmd.ExecuteNonQueryAsync();

                        return "Report inserted successfully"; // Custom success message
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the exception (consider using a logging framework)
                return $"Error: {ex.Message}";
            }
        }





    }
}
