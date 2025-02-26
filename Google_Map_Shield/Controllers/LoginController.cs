using Google_Map_Shield.Models;
using Google_Map_Shield.Repository;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.IO;
using System;
using System.Threading.Tasks;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using System.Drawing;
using Microsoft.AspNetCore.Http;
using static NuGet.Packaging.PackagingConstants;

namespace Google_Map_Shield.Controllers
{
    public class LoginController : Controller
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly ILogin _serviceslogin;


        public LoginController(IWebHostEnvironment webHostEnvironment, ILogin serviceslogin)
        {
            _webHostEnvironment = webHostEnvironment;
            _serviceslogin = serviceslogin;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Login()
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString("UserEmail")))
            {
                return PartialView("PartailView/PartailLogin");
            }
            return PartialView("/Home/RedirectHome");
        }



        [HttpPost]
        public async Task<JsonResult> Signup(Models.Login log)
        {
            string CheckEmailExistance = await _serviceslogin.AcountExist(log);

            if (CheckEmailExistance == "Account Already Exist")
            {
                return Json(new { success = false, message = CheckEmailExistance });
            }
            else
            {
                if (log.ProfilePic != null && log.ProfilePic.Length > 0)
                {
                    using (var memoryStream = new MemoryStream())
                    {
                        using (var image = System.Drawing.Image.FromStream(log.ProfilePic.OpenReadStream()))
                        {
                            // Define the maximum width and height
                            int maxWidth = 200;  // Adjust the width to your needs
                            int maxHeight = 200; // Adjust the height to your needs

                            // Calculate the new dimensions while preserving the aspect ratio
                            var ratioX = (double)maxWidth / image.Width;
                            var ratioY = (double)maxHeight / image.Height;
                            var ratio = Math.Min(ratioX, ratioY);

                            var newWidth = (int)(image.Width * ratio);
                            var newHeight = (int)(image.Height * ratio);

                            using (var resizedImage = new Bitmap(image, new Size(newWidth, newHeight)))
                            {
                                resizedImage.Save(memoryStream, System.Drawing.Imaging.ImageFormat.Jpeg);
                            }
                        }

                        byte[] imageBytes = memoryStream.ToArray();
                        string base64String = Convert.ToBase64String(imageBytes);

                        // Store the Base64 string in the session
                        HttpContext.Session.SetString("ProfilePicBase64", base64String);
                        HttpContext.Session.SetString("ProfilePicName", log.ProfilePic.FileName); // Store original file name
                    }

                    log.ProfilePicPath = "data:image/jpeg;base64," + HttpContext.Session.GetString("ProfilePicBase64");
                }

                log.RandomCode = EmailSender.EmailSender.SendEmail(log.Email ?? "", log.Name ?? "", "Your Verification Code");

                log.ProfilePic = null;
                HttpContext.Session.SetString("LoginData", JsonConvert.SerializeObject(log));
                HttpContext.Session.SetString("UserEmail", log.Email ?? "");

                return Json(new { success = true, message = CheckEmailExistance });
            }
        }


        public IActionResult Verification()
        {
            
                return PartialView("PartailView/_VerificationPartial");
            
        }


        [HttpPost]
        public async Task<string> Verification(string EnterCode)
        {
            string code = EnterCode ?? "";

            // Retrieve the Login object from the session
            var log = JsonConvert.DeserializeObject<Models.Login>(HttpContext.Session.GetString("LoginData") ?? "");

            if (log != null && log.RandomCode == EnterCode)
            {
                string result = await FinalizeSignup(log);
                return result; // Return success result
            }
            else
            {
                
                return "Sorry, the code does not match. Please try again.";
            }
        }

        private async Task<string> FinalizeSignup(Models.Login log)
        {
            try
            {
                // Retrieve the Base64 string from session storage
                string base64String = HttpContext.Session.GetString("ProfilePicBase64")??"";
                string profilePicName = HttpContext.Session.GetString("ProfilePicName")??"";

                if (!string.IsNullOrEmpty(base64String) && !string.IsNullOrEmpty(profilePicName))
                {
                    // Define the folder and unique file name
                    string folder = "Login/ProfileImage/";
                    string uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(profilePicName).ToLower();
                    string serverPath = Path.Combine(_webHostEnvironment.WebRootPath, folder, uniqueFileName);
                    Directory.CreateDirectory(Path.GetDirectoryName(serverPath) ?? "");
                    byte[] imageBytes = Convert.FromBase64String(base64String);
                    await System.IO.File.WriteAllBytesAsync(serverPath, imageBytes);
                    log.ProfilePicPath = Path.Combine(folder, uniqueFileName).Replace("\\", "/");
                    ClearSessionData();
                    return await _serviceslogin.SignUp(log);
                }
                else
                {
                    return "Error: Base64 string or file name is missing from session.";
                }
            }
            catch (Exception ex)
            {
                return $"Error: {ex.Message}";
            }
        }


        [HttpPost]
        public async Task<string> ResendCode(string email)
        {
            var log = JsonConvert.DeserializeObject<Models.Login>(HttpContext.Session.GetString("LoginData") ?? "");

            if (log != null && log.Email == email)
            {
                log.RandomCode = EmailSender.EmailSender.SendEmail(log.Email ?? "", log.Name ?? "", "Your new verification code");
                HttpContext.Session.SetString("LoginData", JsonConvert.SerializeObject(log));

                return "Verification Code is Sent Successfully.";
            }
            return "Verification Code is Not Sent.";
        }

        private void ClearSessionData()
        {
            HttpContext.Session.Remove("TempFilePath");
            HttpContext.Session.Remove("ProfilePicName");
            HttpContext.Session.Remove("LoginData");
            HttpContext.Session.Remove("UserEmail");
        }
        [HttpPost]
        public async Task<string> LoginUser(Models.Login login)
        {
            if (!ModelState.IsValid)
            {
                return "Invalid login details.";
            }

            var (message, profilePicPath) = await _serviceslogin.Logins(login);

            if (message == "Account Successfully Open")
            {
                HttpContext.Session.SetString("UserEmail", login.Email ?? "");
                HttpContext.Session.SetString("ProfilePic", profilePicPath ?? "");
            }

            return message;
        }
        public async Task<string> Logout()
        {
            HttpContext.Session.Clear();
            if (HttpContext.Request.Cookies[".AspNetCore.Identity.Application"] != null)
            {
                Response.Cookies.Delete(".AspNetCore.Identity.Application");
            }
            foreach (var cookie in Request.Cookies.Keys)
            {
                Response.Cookies.Delete(cookie);
            }
            await Task.CompletedTask;
            return "Logout";
        }
        
        public IActionResult updateprofilesync()
        {
            return PartialView("PartailView/_UpdateProfilePartail");
        }

        public async Task<JsonResult> updateprofile()
        {
            string email = HttpContext.Session.GetString("UserEmail") ?? "";
            Models.Login login = await _serviceslogin.ProfileRecord(email);
            return Json(new { name=login.Name,profilepic=login.ProfilePicPath,password=login.Password });
        }

        [HttpPost]
        public async Task<string> UpdateProfile(Models.Login log)
        {
            if (!string.IsNullOrEmpty(log.oldPassword) && log.Password != log.oldPassword)
            {
                return "Old password does not match.";
            }

            if (log.ProfilePic != null && log.ProfilePic.Length > 0)
            {
                string profilePicPath = HttpContext.Session.GetString("ProfilePic") ?? "";

                // Delete the old picture from the server if it exists
                if (!string.IsNullOrEmpty(profilePicPath))
                {
                    // Construct the absolute file path
                    string oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", profilePicPath);

                    // Check if the file exists and delete it
                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath);
                    }
                }

                // Define the maximum width and height
                int maxWidth = 200;  // Adjust the width to your needs
                int maxHeight = 200; // Adjust the height to your needs

                using (var image = System.Drawing.Image.FromStream(log.ProfilePic.OpenReadStream()))
                {
                    // Calculate the new dimensions while preserving the aspect ratio
                    var ratioX = (double)maxWidth / image.Width;
                    var ratioY = (double)maxHeight / image.Height;
                    var ratio = Math.Min(ratioX, ratioY);

                    var newWidth = (int)(image.Width * ratio);
                    var newHeight = (int)(image.Height * ratio);

                    using (var resizedImage = new Bitmap(image, new Size(newWidth, newHeight)))
                    {
                        string folder = "Login/ProfileImage/";
                        string uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(log.ProfilePic.FileName).ToLower();
                        string serverDirectoryPath = Path.Combine(_webHostEnvironment.WebRootPath, folder);

                        // Ensure the directory exists
                        if (!Directory.Exists(serverDirectoryPath))
                        {
                            Directory.CreateDirectory(serverDirectoryPath);
                        }

                        string newFilePath = Path.Combine(serverDirectoryPath, uniqueFileName);
                        resizedImage.Save(newFilePath, System.Drawing.Imaging.ImageFormat.Jpeg);
                        log.ProfilePicPath = Path.Combine(folder, uniqueFileName).Replace("\\", "/");
                        HttpContext.Session.SetString("ProfilePic", log.ProfilePicPath); // Store in session
                    }
                }

            }

            log.Email = HttpContext.Session.GetString("UserEmail");
            log.updatedpassword = log.newPassword;

            await _serviceslogin.ProfileRecord(log);

            return "Profile updated successfully.";
        }

        public IActionResult Forgotpasswordenteremail ()
        {
            return PartialView("PartailView/Fotgetpasswordenteremail");
        }

        [HttpPost]
        public async Task<IActionResult> Forgotpasswordentersendcode(Models.Login log)
        {
            try
            {
                string CheckEmailExistance = await _serviceslogin.AcountExist(log);

                if (CheckEmailExistance == "Account Already Exist")
                {
                    string RandomCode = EmailSender.EmailSender.SendEmail(log.Email ?? "", "User", "Your Forgot Password verification code");
                    HttpContext.Session.SetString("RandomCode", RandomCode);
                    HttpContext.Session.SetString("ForgotEmail", log.Email ?? "");

                    return Ok("Verification code sent");
                }
                else
                {
                    return Ok("Email not registered");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }



        public IActionResult Forgotpasswordenteremailverification()
        {
            return PartialView("PartailView/Forgotemailverification");
        }

        [HttpPost]
        public IActionResult ForgotPasswordverificationmatching(Models.Login log)
        {
            if (HttpContext.Session.GetString("RandomCode") == log.RandomCode)
            {
                HttpContext.Session.Remove("RandomCode");
                return Ok("Email verified");
            }
            return BadRequest("Email is not verified");
        }

        public IActionResult ForgotEmailcodeVerification()
        {
            return PartialView("PartailView/ForgotEmailcodeVerification");
        }

        [HttpPost]
        public async Task<IActionResult> ForgotResendCode()
        {
            try
            {
                Models.Login log= new Models.Login();
                log.Email = HttpContext.Session.GetString("ForgotEmail") ?? ""; ;
                string checkEmailExistance = await _serviceslogin.AcountExist(log);

                if (checkEmailExistance == "Account Already Exist")
                {
                    string randomCode = EmailSender.EmailSender.SendEmail(log.Email ?? "", "User", "Your Forgot Password verification code");
                    HttpContext.Session.SetString("RandomCode", randomCode);
                    HttpContext.Session.SetString("ForgotEmail", log.Email ?? "");

                    return Ok("Verification code sent");
                }
                else
                {
                    return BadRequest("Email not registered");
                }
            }
            catch
            {
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpPost]
        public async Task<IActionResult> UpdateForgotPasswords(Models.Login log)
        {
            if (log.newPassword == log.oldPassword)
            {
                log.Email = HttpContext.Session.GetString("ForgotEmail");
                await _serviceslogin.UpdateForgotPassword(log);
                return Ok("Password Updated");
            }
            else
            {
                return BadRequest("Passwords do not match.");
            }
        }




    }
}
