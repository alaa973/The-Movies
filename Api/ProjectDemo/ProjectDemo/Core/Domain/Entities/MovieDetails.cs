namespace ProjectDemo.Core.Domain.Entities
{
    public class MovieDetails
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime ReleaseDate { get; set; }
        public ICollection<Actor> Actors{ get; set; }
        public ICollection<Review> Reviews{ get; set; }
    }
}
