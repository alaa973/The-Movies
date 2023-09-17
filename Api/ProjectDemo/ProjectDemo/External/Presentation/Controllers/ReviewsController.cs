using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectDemo.Core.Domain.Entities;
using ProjectDemo.External.Infrastructure;

namespace ProjectDemo.External.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private DBContext _context;
        public ReviewsController(DBContext context)
        {
            _context = context;

        }
        [HttpPost]
        public ActionResult<Review> AddReview(Review review)
        {
            _context.Reviews.Add(review);
            _context.SaveChanges();
            return review;
        }
        [HttpGet("{id}")]
        public ActionResult<Review> GetReviewById(int id)
        {
            Review existingReview = _context.Reviews.Find(id);
            if (existingReview != null)
            {
                return existingReview;
            }
            else
            {
                return null;
            }
        }
    }
}
