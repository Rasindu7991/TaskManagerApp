using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using TaskManagerApi.Data;
using TaskManagerApi.Filters;

var builder = WebApplication.CreateBuilder(args);
const string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

// Add services to the container adn register DB context.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddScoped<ApiKeyAuthFiter>();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:4200", "https://localhost:4200")
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("ApiKey", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter API Key",
        Name = "X-API-KEY", 
        Type = SecuritySchemeType.ApiKey,
        Scheme = "ApiKey"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "ApiKey" }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

//Use the CORS Policy
app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

app.Run();
