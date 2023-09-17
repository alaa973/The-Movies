using Microsoft.EntityFrameworkCore;
using ProjectDemo.Core.Domain.Entities;
using ProjectDemo.External.Infrastructure;
using SQLitePCL;

namespace ProjectDemo.Core.Domain.Abstraction
{
    public interface IMoviesQueryService
    {
        public List<Movie> getMovies();

        public Movie getMovieById(int id);
    }
}
