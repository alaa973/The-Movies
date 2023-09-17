using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using ProjectDemo.Core.Domain.Abstraction;
using ProjectDemo.Core.Domain.Entities;
using ProjectDemo.External.Infrastructure;
using SQLitePCL;
using System.Linq;

namespace ProjectDemo.Core.Application.QueryServices
{
    public class MoviesQueryService: IMoviesQueryService
    {
        private DBContext _context;
        public MoviesQueryService(DBContext dBContext ) {
        this._context = dBContext;
        }

        public Movie getMovieById(int id)
        {
            //MovieDetails movieDetails =
            return _context.Movies
               .Include(m => m.Reviews)
               .Include(m => m.Actors)
               
               //.Select(m => new MovieDetails
               //{
               //    Actors = m.Actors,
               //    Id = m.Id,
               //    Reviews = m.Reviews
               //})
               .Where(m => m.Id == id).FirstOrDefault();
                //return movieDetails;
        }

        public List<Movie> getMovies()
        {
            return this._context.Movies.ToList();

        }
    }
}
