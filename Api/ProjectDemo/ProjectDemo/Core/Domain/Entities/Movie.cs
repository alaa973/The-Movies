using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectDemo.Core.Domain.Entities
{
    public class Movie
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; } 
        public DateTime? ReleaseDate { get; set;}
        [FromForm]
        [NotMapped]
        public IFormFile?Poster { get; set; }
        public string? PosterPath { get;  set; }
        public ICollection<Actor>? Actors { get; set; }
        public ICollection<Review>? Reviews { get; set; }
        [NotMapped]
        public string? ActorsStr { get; set; }
        [NotMapped]
        public string? ReviewsStr { get; set; }
        
    }
}
