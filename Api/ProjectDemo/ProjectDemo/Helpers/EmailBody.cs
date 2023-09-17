namespace ProjectDemo.Helpers
{
    public static class EmailBody
    {
        public static string EmailStringBody(string Email, string emailToken)
        {
            return $@"<html>
  <head>
  </head>
  <body style=""margin: 0; font-family: Arial, Helvetica, sans-serif;"">
    <div style=""height: auto; background: linear-gradient(to top, #007BFF 50%, #0056b3 90%) no-repeat; padding: 20px; text-align: center;"">
        <div style=""background: #fff; max-width: 400px; margin: 0 auto; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);"">
            <div style=""text-align: center; font-size: 24px; font-weight: bold; color: #007BFF;"">Reset your Password</div>
            <hr style=""border-top: 1px solid #ccc;"">
            <p style=""color: #333; font-size: 16px; margin-top: 20px;"">
                You're receiving this email because you requested a password reset for your The Movies account.
            </p>
            <p style=""color: #333; font-size: 16px;"">
                Please click the button below to choose a new password.
            </p>
            <div style=""text-align: center; margin-top: 20px;"">
                <a href=""http://localhost:4200/reset?email={Email}&code={emailToken}"" style=""display: inline-block; padding: 10px 20px; background: #007BFF; color: #fff; border: none; border-radius: 4px; text-decoration: none;"" target=""_blank"">Reset Password</a>
            </div>
            <p style=""margin-top: 20px; color: #333; font-size: 14px;"">
                Kind Regards,<br>
                The Movies.
            </p>
        </div>
    </div>
</body>
</html>";
        }
    }
}
