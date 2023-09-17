using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectDemo.Core.Application.QueryServices;
using ProjectDemo.Core.Domain.Abstraction;
using ProjectDemo.Core.Domain.Entities;
using ProjectDemo.External.Infrastructure;
using ProjectDemo.External.Presentation.Controllers;
using System.Text.Json;

namespace ProjectDemo.Core.Application.Services
{
    public class MoviesService : IMoviesService
    {
        private DBContext _context;
        public MoviesService(DBContext dBContext)
        {
            this._context = dBContext;
        }
        public Movie AddMovie(Movie movie)
        {
            var existingMovie = _context.Movies.Where(m => m.Title.ToLower().Equals(movie.Title.ToLower())).FirstOrDefault();
            if (existingMovie != null)
            {
                return null;
            }
            List<Review> reviewList = new List<Review>();
            List<Actor> actorList = new List<Actor>();
            //movie.Actors = JsonSerializer.Deserialize<List<Actor>>((System.Text.Json.Nodes.JsonNode?)movie.Actors);
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true // If needed for case-insensitive property matching
            };
            if (!string.IsNullOrEmpty(movie.ActorsStr))
            {
                actorList = JsonSerializer.Deserialize<List<Actor>>(movie.ActorsStr, options);
            }

            if (!string.IsNullOrEmpty(movie.ReviewsStr))
            {
                reviewList = JsonSerializer.Deserialize<List<Review>>(movie.ReviewsStr, options);
                movie.Reviews = reviewList;
            }
            ICollection<Actor> Actors = new List<Actor>();
            if (actorList != null)
            {
                foreach (Actor actor in actorList)
                {
                    Actor existingActor = this._context.Actors.FirstOrDefault(a => a.FirstName == actor.FirstName);
                    if (existingActor != null)
                    {
                        Actors.Add(existingActor);
                    }
                    else
                    {
                        _context.Actors.Add(actor);
                        Actors.Add(actor);

                    }

                }
            }
            movie.Actors = Actors;

            var uniqueFileName = Guid.NewGuid().ToString() + "_" + movie.Poster?.FileName;
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);
            // Create the 'uploads' directory if it doesn't exist
            //if (!Directory.Exists(uploadsFolder))
            //{
            //    Directory.CreateDirectory(uploadsFolder);
            //}
            // Copy the uploaded image to the specified path
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                movie.Poster?.CopyTo(stream);
            }
            movie.PosterPath = Path.Combine("uploads", uniqueFileName);
            //movie.PosterPath = uniqueFileName;
            this._context.Movies.Add(movie);
            _context.SaveChanges();
            return movie;
        }

        public bool DeleteMovie(int movieId)
        {
            var movie = this._context.Movies.Find(movieId);
            _context.Movies.Remove(movie);
            _context.SaveChanges();
            return true;
        }

        public Movie UpdateMovie(int id, Movie movie)
        {
            var existingMovie = _context.Movies.Where(m => m.Title.ToLower().Equals(movie.Title.ToLower())).FirstOrDefault();
            if (existingMovie != null && existingMovie.Id != id)
            {
                return null;
            }
            var actorUtility = new ActorsController(_context);
            var reviewUtility = new ReviewsController(_context);
            var queryServiceUtility = new MoviesQueryService(_context);
            existingMovie = queryServiceUtility.getMovieById(id);
            List<Review> reviewList = new List<Review>();
            List<Actor> actorList = new List<Actor>();
            ICollection<Actor> Actors = new List<Actor>();
            //movie.Actors = JsonSerializer.Deserialize<List<Actor>>((System.Text.Json.Nodes.JsonNode?)movie.Actors);
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true // If needed for case-insensitive property matching
            };
            if (!string.IsNullOrEmpty(movie.ActorsStr))
            {
                actorList = JsonSerializer.Deserialize<List<Actor>>(movie.ActorsStr, options);
            }

            if (!string.IsNullOrEmpty(movie.ReviewsStr))
            {
                reviewList = JsonSerializer.Deserialize<List<Review>>(movie.ReviewsStr, options);
            }
            if (existingMovie != null)
            {
                if (movie.Title != null)
                {
                    existingMovie.Title = movie.Title;
                }
                if (movie.Description != null)
                {
                    existingMovie.Description = movie.Description;
                }
                if (movie.ReleaseDate != null)
                {
                    existingMovie.ReleaseDate = movie.ReleaseDate;
                }
                if (movie.Poster != null)
                {
                    var uniqueFileName = Guid.NewGuid().ToString() + "_" + movie.Poster?.FileName;
                    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        movie.Poster?.CopyTo(stream);
                    }
                    movie.PosterPath = Path.Combine("uploads", uniqueFileName);
                    existingMovie.PosterPath = movie.PosterPath;
                }
                if (actorList != null)
                {
                    actorList = actorList.GroupBy(a => a.FirstName)
                    .Select(a => a.First())
                    .ToList();
                    foreach (Actor actor in actorList)
                    {

                        // Check if the actor already exists
                        var existingActor = actorUtility.GetActorById(actor.Id);

                        if (existingActor != null)
                        {
                            // Update existing actor properties if needed
                            existingActor.Value.FirstName = actor.FirstName;
                            Actors.Add(existingActor.Value);
                        }
                        else
                        {
                            Actor existingActorName = this._context.Actors.FirstOrDefault(a => a.FirstName.ToLower() == actor.FirstName.ToLower());
                            if (existingActorName != null)
                            {
                                Actors.Add(existingActorName);
                            }
                            else
                            {

                                var newActor = new Actor { FirstName = actor.FirstName };
                                actorUtility.AddActor(newActor);
                                Actors.Add(newActor);

                            }
                            existingMovie.Actors = Actors;
                            // Create a new actor and add it to the movie's Actors collection
                        }
                    }
                }

                // Handle Reviews
                if (reviewList != null)
                {
                    foreach (Review review in reviewList)
                    {
                        // Check if the review already exists
                        var existingReview = reviewUtility.GetReviewById(review.Id);

                        if (existingReview != null)
                        {
                            // Update existing review properties if needed
                            existingReview.Value.Description = review.Description;
                        }
                        else
                        {
                            // Create a new review and add it to the movie's Reviews collection
                            var newReview = new Review { Description = review.Description,
                                MovieId = id };
                            reviewUtility.AddReview(newReview);
                            existingMovie.Reviews.Add(newReview);
                        }
                    }

                }

                // Save changes to the database
                _context.SaveChanges();
            }
            return existingMovie;
        }

        public bool deleteMovieActor(int movieId, int actorId)
        {
            var movie = this._context.Movies.Include(m => m.Actors)
               .Where(m => m.Id == movieId).FirstOrDefault(); ;
            Actor actor = movie.Actors.Where(a => a.Id == actorId).FirstOrDefault();
            movie.Actors.Remove(actor);
            _context.SaveChanges();
            return true;
        }

        public bool deleteMovieReview(int movieId, int reviewId)
        {
            var movie = this._context.Movies.Include(m => m.Reviews)
               .Where(m => m.Id == movieId).FirstOrDefault(); ;
            Review review = movie.Reviews.Where(a => a.Id == reviewId).FirstOrDefault();
            movie.Reviews.Remove(review);
            _context.SaveChanges();
            return true;
        }
        public List<Movie> filterMovies(string value)
        {
            return this._context.Movies.Where(m => m.Title.ToLower().Contains(value.ToLower())
            //|| m.Description.ToLower().Contains(value.ToLower())
            || m.ReleaseDate.ToString().Contains(value.ToLower())
            ).ToList();
        }
    }
}
