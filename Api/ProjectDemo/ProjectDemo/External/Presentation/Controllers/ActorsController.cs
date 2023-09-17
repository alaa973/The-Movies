using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectDemo.Core.Domain.Abstraction.Repositories;
using ProjectDemo.Core.Domain.Entities;
using ProjectDemo.External.Infrastructure;

namespace ProjectDemo.External.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActorsController : ControllerBase
    {
        private DBContext _context;

        public ActorsController(DBContext context)
        {
            _context = context;
        }
        [HttpGet("{id}")]
        public ActionResult<Actor> GetActorById(int id)
        {
            var existingActor = _context.Actors.Find(id);
            if (existingActor != null)
            {
                return existingActor;
            }
            else
            {
                return null;
            }
        }
        [HttpGet]
        public ActionResult<List<Actor>> GetActors() {
            return _context.Actors.ToList();
        }
        [Route("/actors/search")]
        [HttpGet]
        public ActionResult<List<Actor>> ActorsSearch(String name)
        {
            return _context.Actors.Where(a => a.FirstName.ToLower().Contains(name.ToLower())).ToList();
        }
        [HttpPost]
        public ActionResult<Actor> AddActor(Actor actor)
        {
             _context.Actors.Add(actor);
            _context.SaveChanges();
            return actor;
        }
       
    }
}
