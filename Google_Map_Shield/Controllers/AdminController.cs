using Google_Map_Shield.Models;
using Google_Map_Shield.Repository.Admin;
using Microsoft.AspNetCore.Mvc;

namespace Google_Map_Shield.Controllers
{
    public class AdminController : Controller
    {
        private readonly IAdmin _AdminServices;


        public AdminController(IAdmin admin)
        {
            _AdminServices = admin;
        }
        public IActionResult AdminLogin()
        {
            return View();
        }
        [HttpPost]
        public async Task<JsonResult> AdminLogin(Admin_Login log)
        {
            Models.Admin_Login LoginDetail = await _AdminServices.AdminLogin(log);

            if (LoginDetail != null)
            {
                HttpContext.Session.SetString("UserEmail", LoginDetail.Email ?? "");
                HttpContext.Session.SetString("ProfilePic", LoginDetail.Profilepic ?? "");
                HttpContext.Session.SetString("Role", "Admin");
                return Json(new { message = "LoginSuccess" });
            }

            return Json(new { message = "LoginFail" });
        }
        [HttpGet]
        public IActionResult ShowReport()
        {
            return PartialView("Show_Report");
        }

        public async Task<JsonResult> GetShowReport()
        {
            List<Models.Report> reports = await _AdminServices.Show_Report();
            return Json(reports);
        }
        [HttpPost]
        public async Task<string> DeleteReport(int id)
        {
           await _AdminServices.Delete_Report(id);
            return "Success";
        }
        [HttpPost]
        public async Task<string> AprovedReport(int id)
        {
            await _AdminServices.Approve_Report(id);
            return "Success";
        }

        [HttpPost]
        public async Task<JsonResult> ShowOnMap()
        {
            List<Models.Report> reportList = await _AdminServices.ShowonMap();
            return Json(reportList); // Return the entire list of reports
        }




    }
}
