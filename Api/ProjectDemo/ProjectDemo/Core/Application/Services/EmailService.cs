using MailKit.Net.Smtp;
using MimeKit;
using ProjectDemo.Core.Domain.Abstraction;
using ProjectDemo.Core.Domain.ViewModels;

namespace ProjectDemo.Core.Application.Services
{
    public class EmailService: IEmailService
    {
        private readonly IConfiguration _configuration;
        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void sendEmail(EmailModel emailModel)
        {
            var emailMessage = new MimeMessage();
            var from = _configuration["EmailConfiguration:From"];
            emailMessage.From.Add(new MailboxAddress("The Movies", from));
            emailMessage.To.Add(new MailboxAddress(emailModel.To, emailModel.To));
            emailMessage.Subject = emailModel.Subject;
            emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Html)
            {
                Text = String.Format(emailModel.Content)
            };
            using (var client = new SmtpClient())
            {
                try
                {
                    client.Connect(_configuration["EmailConfiguration:SmtpServer"], 465, true);
                    client.Authenticate(_configuration["EmailConfiguration:From"],
                        _configuration["EmailConfiguration:Password"]);
                    client.Send(emailMessage);
                }
                catch(Exception ex) 
                {
                    throw;
                }
                finally
                {
                    client.Disconnect(true);
                    client.Dispose();
                }
            }
        }
    }
}
