using Microsoft.EntityFrameworkCore;

namespace ProjectDemo.Core.Domain.Entities
{
    [PrimaryKey(nameof(ActorId), nameof(MovieId))]
    public class MovieActors
    {

        public int ActorId { get; set; }
        
        public int MovieId { get; set; }

    }
}
