using Microsoft.AspNetCore.Mvc;
using ProjectDemo.Core.Application.QueryServices;
using ProjectDemo.Core.Application.Services;
using ProjectDemo.Core.Domain.Entities;

namespace ProjectDemo.Core.Domain.Abstraction.Repositories
{
    public interface IMoviesRepository
    {
        public ActionResult<List<Movie>> getMovies();
        public ActionResult<Movie> addMovie(Movie movie);
        public ActionResult<bool> removeMovie(int  movieId);
        public ActionResult<Movie> getMovieById(int movieId);
        public ActionResult<Movie> updateMovie(int id, Movie movie);

        public ActionResult<bool> deleteMovieActor(int movieId, int actorId);
        public ActionResult<bool> deleteMovieReview(int movieId, int reviewId);
        public ActionResult<List<Movie>> filterMovies(string value);

    }
}
