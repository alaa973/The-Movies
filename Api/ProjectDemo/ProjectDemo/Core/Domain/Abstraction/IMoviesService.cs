using ProjectDemo.Core.Domain.Entities;

namespace ProjectDemo.Core.Domain.Abstraction
{
    public interface IMoviesService
    {
        public Movie AddMovie(Movie movie);
        public Movie UpdateMovie(int id,Movie movie);
        public bool DeleteMovie(int movieId);
        public bool deleteMovieActor(int movieId, int actorId);
        public bool deleteMovieReview(int movieId, int reviewId);
        public List<Movie> filterMovies(string value);

    }
}
