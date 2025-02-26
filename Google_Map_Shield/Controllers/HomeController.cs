using Google_Map_Shield.Models;
using Google_Map_Shield.Repository.report;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Drawing;

namespace Google_Map_Shield.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IReport _Servicesreport;

        public HomeController(ILogger<HomeController> logger,IReport report)
        {
            _logger = logger;
            this._Servicesreport = report;
        }

       public IActionResult Home()
        {
            return View();
        }
        public IActionResult RedirectHome()
        {
            return PartialView("PartailView/_HomePartail");
        }
        public IActionResult UpdateHeadermobile()
        {
            return PartialView("_HeaderPartailViewmobile");
        }
        public IActionResult UpdateHeaderpc()
        {
            return PartialView("_HeaderPartailViewpc");
        }
        public IActionResult HomeAttributes()
        {
            return PartialView("_HomeAttributesPartailView"); 
        }

        public IActionResult ReportPage()
        {
            return PartialView("Report/_ReportPartailView");
        }

        [HttpPost]
        public async Task<IActionResult> GetReport([FromForm] Models.Report report)
        {
            if (report.vidpicproof != null && report.vidpicproof.Length > 0)
            {
                // Define the path where the image will be saved
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // Generate a unique filename for the image
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(report.vidpicproof.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);

                // Save the image to the specified path
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await report.vidpicproof.CopyToAsync(stream);
                }

                // Store the file path or URL in the report model or session
                report.vidpicproofath = $"/uploads/{fileName}";
            }

            report.UserType = "Users";
            report.email = HttpContext.Session.GetString("UserEmail");
            string status = await _Servicesreport.GetReport(report);

            if (status == "Report inserted successfully.")
            {
                return Json(new { success = true, message = status });
            }
            else
            {
                return Json(new { success = true, message = status });
            }
        }



    }
}
