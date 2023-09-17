using System.Text.Json.Serialization;

namespace ProjectDemo.Core.Domain.Entities
{
    public class Actor
    {
        public int Id { get; set; }
        public string FirstName { get; set; }

        [JsonIgnore]
        public ICollection<Movie>? Movies { get; set; }
    }
}
