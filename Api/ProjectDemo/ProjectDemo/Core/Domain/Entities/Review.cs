namespace ProjectDemo.Core.Domain.Entities
{
    public class Review
    {
        public int Id { get; set; } 
        public string Description { get; set; }
        public int MovieId { get; set; }
    }
}
