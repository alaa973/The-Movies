using Microsoft.EntityFrameworkCore;
using ProjectDemo.Core.Domain.Entities;
using System.Collections.Generic;
using System.Net;

namespace ProjectDemo.External.Infrastructure
{
    public class DBContext : DbContext
    {
        public DBContext(DbContextOptions<DBContext> options)
        : base(options)
        {

        }
        public DbSet<Movie> Movies { get; set; }
        public DbSet<Actor> Actors { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<TokenBlacklist> TokenBlacklist { get; set; }
    }
}
