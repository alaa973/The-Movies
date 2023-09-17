namespace ProjectDemo.Core.Domain.ViewModels
{
    public class EmailModel
    {
        public string To { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
        public EmailModel(string to, string subject, string content) { 
            this.To = to;
            this.Subject = subject;
            this.Content = content;
        }
    }
}
