using Microsoft.AspNetCore.Mvc;

namespace Google_Map_Shield.Controllers
{
    public class DetailsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Procedure()
        {
            return PartialView("Procedure");
        }
        public IActionResult About()
        {
            return PartialView("About");
        }

        public IActionResult FAQs()
        {
            return PartialView("FAQs");
        }
    }
}
