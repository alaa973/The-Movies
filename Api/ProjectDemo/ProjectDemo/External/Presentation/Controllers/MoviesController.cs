using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectDemo.Core.Domain.Abstraction.Repositories;
using ProjectDemo.Core.Domain.Entities;
using ProjectDemo.External.Infrastructure;
using ProjectDemo.External.Infrastructure.Repositories;
using SQLitePCL;

namespace ProjectDemo.External.Presentation.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private IMoviesRepository _moviesRepository;

        public MoviesController(IMoviesRepository moviesRepository)
        {
            _moviesRepository = moviesRepository;
        }

        // GET: api/Movies

        [HttpGet]
        public ActionResult<List<Movie>> GetMovies()
        {
            return _moviesRepository.getMovies();
        }
        //[HttpPost("{id}")]
        //public ActionResult<MovieDetails> AddMovieReview(int id)
        //{

        //}
        [HttpGet("{id}")]
        public ActionResult<Movie> GetMovie(int id)
        {
            return _moviesRepository.getMovieById(id);
        }

        //// PUT: api/Movies/5
        [Authorize]
        [HttpPatch("{id}")]
        public  ActionResult<Movie> EditMovie(int id, [FromForm]Movie movie)
        {
            var updated =  _moviesRepository.updateMovie(id, movie);
            if (updated.Value != null)
            {
                return Ok(updated);
            }
            return BadRequest("This movie already exists.");
        }

        //// POST: api/Movies
        [Authorize(Roles = "admin")]
        [HttpPost]
        
        public IActionResult AddMovie([FromForm]Movie movie)
        {

            var added = _moviesRepository.addMovie(movie);
            if(added.Value != null)
            {
                return Ok(added);
            }
            return BadRequest("This movie already exists");
        }

        // DELETE: api/Movies/5
        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public ActionResult<bool> DeleteMovie(int id)
        {
           _moviesRepository.removeMovie(id);
            return true;
        }
        [Authorize(Roles = "admin")]

        [HttpDelete("{movieId}/actors/{actorId}")]
        public ActionResult<bool> DeleteMovieActor(int movieId, int actorId)
        {
            _moviesRepository.deleteMovieActor(movieId, actorId);
            return true;
        }
        [Authorize(Roles = "admin")]
        [HttpDelete("{movieId}/reviews/{reviewId}")]
        public ActionResult<bool> DeleteMovieReview(int movieId, int reviewId)
        {
            _moviesRepository.deleteMovieReview(movieId, reviewId);
            return true;
        }
        [HttpGet]
        [Route("search")]
        public ActionResult<List<Movie>> search(string value)
        {
            return this._moviesRepository.filterMovies(value);
        }
        //private bool MovieExists(int id)
        //{
        //    return (_context.Movies?.Any(e => e.Id == id)).GetValueOrDefault();
        //}
    }
}
