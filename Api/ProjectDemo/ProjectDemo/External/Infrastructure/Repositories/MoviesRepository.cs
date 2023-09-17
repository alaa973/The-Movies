using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectDemo.Core.Application.QueryServices;
using ProjectDemo.Core.Application.Services;
using ProjectDemo.Core.Domain.Abstraction.Repositories;
using ProjectDemo.Core.Domain.Entities;

namespace ProjectDemo.External.Infrastructure.Repositories
{
    public class MoviesRepository: IMoviesRepository
    {
        private MoviesQueryService _moviesQueryService;
        private MoviesService _moviesService;
        public MoviesRepository(MoviesQueryService moviesQueryService, MoviesService moviesService) {
            this._moviesService = moviesService;
            this._moviesQueryService = moviesQueryService;
        }

        public ActionResult<Movie> addMovie(Movie movie)
        {
            return this._moviesService.AddMovie(movie);
        }

        public ActionResult<Movie> getMovieById(int movieId)
        {
            return _moviesQueryService.getMovieById(movieId);
        }

        public ActionResult<List<Movie>> getMovies()
        {
            return this._moviesQueryService.getMovies();
        }

        public ActionResult<bool> removeMovie(int movieId)
        {
            _moviesService.DeleteMovie(movieId);
            return true;
        }

        public ActionResult<Movie> updateMovie(int id, Movie movie)
        {
            return _moviesService.UpdateMovie(id, movie);
        }
        public ActionResult<bool> deleteMovieActor(int movieId, int actorId)
        {
            return _moviesService.deleteMovieActor(movieId, actorId);
        }

        public ActionResult<bool> deleteMovieReview(int movieId, int reviewId)
        {
            return this._moviesService.deleteMovieReview(movieId, reviewId);
        }

        public ActionResult<List<Movie>> filterMovies(string value)
        {
            return this._moviesService.filterMovies(value);
        }

    }
}
