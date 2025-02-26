using System.Net.Mail;
using System.Net;
using System.Security.Cryptography;

namespace Google_Map_Shield.EmailSender
{
    public class EmailSender
    {

        public static string SendEmail(string senderEmail, string username, string subject)
        {
            // Generate a random code
            string randomCode = new string(Enumerable.Range(0, 6).Select(_ => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[RandomNumberGenerator.GetInt32(62)]).ToArray());

            try
            {
                // Set sender and receiver email addresses
                var sendEmail = new MailAddress("duakhanwazir@gmail.com", "Google Map Shield");
                var receiverEmail = new MailAddress(senderEmail, "Receiver");

                // You may want to secure your password (use environment variables or a secrets manager for production)
                var password = "sgnpitwowvittrlq";

                // Define the email body with improved styling and message
                string body = $@"
<html>
<head>
    <style>
        .container {{
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
            background-color: #f7f7f7;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }}
        .header {{
            text-align: center;
            font-size: 28px;
            font-weight: bold;
            color: #333;
            margin-bottom: 20px;
        }}
        .message {{
            font-size: 16px;
            line-height: 1.6;
            color: #555;
        }}
        .code {{
            display: inline-block;
            padding: 15px 25px;
            font-size: 22px;
            background-color: #4CAF50;
            color: #ffffff;
            border-radius: 8px;
            margin: 20px 0;
            cursor: pointer;
            text-align: center;
        }}
        .footer {{
            text-align: center;
            font-size: 14px;
            color: #888;
            margin-top: 30px;
        }}
    </style>
    <script>
        function copyCode() {{
            var code = document.getElementById('verificationCode').innerText;
            navigator.clipboard.writeText(code).then(function() {{
                alert('Verification code copied to clipboard');
            }}, function(err) {{
                console.error('Error copying text: ', err);
            }});
        }}
    </script>
</head>
<body>
    <div class='container'>
        <div class='header'>Email Verification</div>
        <p class='message'>
            Dear {username},<br><br>
            Thank you for registering with the Google Map Shield.<br>
            Please use the verification code below to verify your email address:
        </p>
        <div class='code' id='verificationCode' onclick='copyCode()'>{randomCode}</div>
        <p class='message'>
            If you did not request this verification, please ignore this email.<br><br>
            Stay safe and thank you for your support!
        </p>
        <div class='footer'>
            Kind Regards,<br>
            Google Map Shield Team
        </div>
    </div>
</body>
</html>";

                // Set up SMTP client configuration
                using (var smtp = new SmtpClient
                {
                    Host = "smtp.gmail.com",
                    Port = 587,
                    EnableSsl = true,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(sendEmail.Address, password)
                })
                {
                    // Compose and send the email
                    using (var message = new MailMessage(sendEmail, receiverEmail)
                    {
                        Subject = subject,
                        Body = body,
                        IsBodyHtml = true // Important: This ensures the HTML is rendered properly
                    })
                    {
                        // Synchronous sending of the email
                        smtp.Send(message);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending email: {ex.Message}");
            }

            // Return the generated code
            return randomCode;
        }

    }
}
