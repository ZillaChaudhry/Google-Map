
using Microsoft.AspNetCore.Mvc;

namespace Google_Map_Shield.Repository.Admin
{
    public interface IAdmin
    {
        public Task<Models.Admin_Login> AdminLogin(Models.Admin_Login login);
        public Task<List<Models.Report>> Show_Report();
        public Task Delete_Report(int reportId);
        public Task Approve_Report(int reportId);
        public Task<List<Models.Report>> ShowonMap();
    }
}
