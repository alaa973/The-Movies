using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using ProjectDemo.Core.Application.QueryServices;
using ProjectDemo.Core.Application.Services;
using Microsoft.IdentityModel.Tokens;
//using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.IdentityModel.Tokens.Jwt;
using ProjectDemo.Core.Domain.Abstraction;
using ProjectDemo.Core.Domain.Abstraction.Repositories;
using ProjectDemo.External.Infrastructure;
using ProjectDemo.External.Infrastructure.Repositories;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<DBContext>(options =>
              options.UseSqlServer("Server=.;TrustServerCertificate=True;Database=MoviesDb;Trusted_Connection=True;"));
builder.Services.AddScoped<MoviesService>();
builder.Services.AddScoped<IMoviesService, MoviesService>();
builder.Services.AddScoped<MoviesQueryService>();
builder.Services.AddScoped<IMoviesQueryService, MoviesQueryService>();
builder.Services.AddScoped<MoviesRepository>();
builder.Services.AddScoped<IMoviesRepository, MoviesRepository>();
builder.Services.AddScoped<IEmailService, EmailService>();
var key = Encoding.ASCII.GetBytes("this is my custom Secret key for authentication");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.RequireHttpsMetadata = false; // In production, set this to true
            options.SaveToken = true;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false, // You can set these to true in production
                ValidateAudience = false,
                ValidateLifetime = true
            };
        });
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
            builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.UseStaticFiles();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "uploads")),
    RequestPath = "/uploads"
});
app.MapControllers();
app.UseCors("AllowAll");

app.Run();
