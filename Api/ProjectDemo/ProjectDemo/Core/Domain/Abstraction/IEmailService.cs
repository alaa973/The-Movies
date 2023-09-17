using ProjectDemo.Core.Domain.ViewModels;

namespace ProjectDemo.Core.Domain.Abstraction
{
    public interface IEmailService
    {
        void sendEmail(EmailModel emailModel);
    }
}
