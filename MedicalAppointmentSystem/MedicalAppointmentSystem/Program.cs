
using Amazon;
using Amazon.S3;
using MedicalAppointmentSystem.Application.ServiceInterface;
using MedicalAppointmentSystem.Domain.Models;
using MedicalAppointmentSystem.Infrastructure.DBContext;
using MedicalAppointmentSystem.Infrastructure.RegisterServices;
using MedicalAppointmentSystem.Infrastructure.ServiceRepository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Text;
using System.Text.Json;

// Set up the web application builder
var builder = WebApplication.CreateBuilder(args);
// Load the appsettings.api.json configuration file
//builder.Configuration
//    .SetBasePath(Directory.GetCurrentDirectory())
//    .AddJsonFile("appsettings.api.json", optional: false, reloadOnChange: true)
//    .AddEnvironmentVariables();
builder.Configuration
    .SetBasePath(builder.Environment.ContentRootPath)
    .AddJsonFile("appsettings.api.json", optional: false, reloadOnChange: true)
    .AddEnvironmentVariables();

// Ensure the log directory exists (based on the configured path)
{
    var cfgPath = builder.Configuration["Serilog:WriteTo:0:Args:path"];
    if (!string.IsNullOrWhiteSpace(cfgPath))
    {
        var fullPath = Path.GetFullPath(cfgPath, builder.Environment.ContentRootPath);
        var dir = Path.GetDirectoryName(fullPath);
        if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir))
            Directory.CreateDirectory(dir);
    }
}

// Hook Serilog into the generic host, reading from configuration
builder.Host.UseSerilog((context, services, loggerConfiguration) =>
{
    loggerConfiguration
        .ReadFrom.Configuration(context.Configuration)   // Serilog section
        .ReadFrom.Services(services)                     // DI-enriched
        .Enrich.FromLogContext();
});

var IsDevelopment = builder.Configuration.GetValue<bool>("IsDevelopment");

var dbCon = IsDevelopment ? "DevConnection" : "DevConnectionProduction";

// Read the UseAzure setting
var useAzure = builder.Configuration.GetValue<bool>("UseAzure");

builder.Services.AddInfrastructure();
// Add services to the container
builder.Services.AddControllers();


builder.Services.AddDbContext<EFContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString(dbCon)));

builder.Services.AddDbContext<IdentityContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString(dbCon), sqlServerOptionsAction: sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5, // Adjust this as needed
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorNumbersToAdd: null);
    }));

builder.Services.AddTransient<DapperContext>();


builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(20);
    options.Cookie.HttpOnly = true;
});
builder.Services.AddHttpClient();
builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen(options =>
//{
//    // API Version 1.0
//    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
//    {
//        Title = "MedicalAppointmentSystem API",
//        Version = "1.0",
//        Description = "MedicalAppointmentSystem API Documentation for Version 1.0"
//    });

//    // API Version 2.0
//    //options.SwaggerDoc("v2", new Microsoft.OpenApi.Models.OpenApiInfo
//    //{
//    //    Title = "MedicalAppointmentSystem API",
//    //    Version = "2.0",
//    //    Description = "MedicalAppointmentSystem API Documentation for Version 2.0"
//    //});

//    // Include XML comments if available
//    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
//    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
//    if (File.Exists(xmlPath))
//    {
//        options.IncludeXmlComments(xmlPath);
//    }

//    // Optional: Use versioning tags to organize actions
//    // Include only APIs for the specified version
//    options.DocInclusionPredicate((version, apiDescription) =>
//    {
//        return apiDescription.GroupName != null &&
//               apiDescription.GroupName.Equals(version, StringComparison.OrdinalIgnoreCase);
//    });

//    // Group actions by their API version
//    options.TagActionsBy(api => new[] { api.GroupName ?? "Unspecified" });

//    //options.SwaggerDoc("v1", new OpenApiInfo
//    //{
//    //    Title = "CTF",
//    //    Version = "V1"
//    //});
//    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
//    {
//        Name = "Authorization",
//        Type = SecuritySchemeType.ApiKey,
//        Scheme = "Bearer",
//        BearerFormat = "JWT",
//        In = ParameterLocation.Header,
//        Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 1safsfsdfdfd\""
//    });
//    options.AddSecurityRequirement(new OpenApiSecurityRequirement
//    {
//        {
//            new OpenApiSecurityScheme
//            {
//                Reference = new OpenApiReference
//                {
//                    Type = ReferenceType.SecurityScheme,
//                    Id = "Bearer"
//                }
//            },
//            new string[] { }
//        }
//    });

//    options.TagActionsBy(api =>
//    {
//        var controllerName = api.ActionDescriptor.RouteValues["controller"];
//        return new[] { $"{controllerName}" };
//    });

//});

builder.Services.AddIdentity<ApplicationDbUser, IdentityRole>()
    .AddRoleManager<RoleManager<IdentityRole>>()
    .AddEntityFrameworkStores<IdentityContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<IdentityOptions>(opt =>
{
    // Password settings
    opt.Password.RequireDigit = false;
    opt.Password.RequireLowercase = false;
    opt.Password.RequireUppercase = false;
    opt.Password.RequireNonAlphanumeric = false;
    opt.Password.RequiredLength = 4;

    // Lockout settings
    opt.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(60);
    opt.Lockout.MaxFailedAccessAttempts = 5;

    //Signin option
    opt.SignIn.RequireConfirmedEmail = false;

    // User settings
    opt.User.RequireUniqueEmail = false;

    //Token Option
    opt.Tokens.AuthenticatorTokenProvider = "Name of AuthenticatorTokenProvider";
});

builder.Services.Configure<CookiePolicyOptions>(options =>
{
    options.CheckConsentNeeded = context => true;
    options.MinimumSameSitePolicy = SameSiteMode.None;  // Add this line
});

// this service call for Real time chat and notification send to user
//builder.Services.AddSignalR();

builder.Services.AddSignalR();



builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(opts =>
{
    opts.Cookie.IsEssential = true; // make the session cookie Essential
});
builder.Services.AddSignalR();


string[] allowedOrigins = new string[]
{
    "http://localhost:4200",
    "https://dermo.techstdio.com",
    "https://quickmed.techstdio.com",
    "https://isp.techstdio.com",
    "http://localhost:8695",
    "http://localhost:4300",
    "https://admin.wearethenexts.com",
    "http://localhost:4400",
    "http://localhost:4500",
    "https://localhost:4400",
    "https://sales.dermolive.com.bd"
};

builder.Services.AddCors(p => p.AddPolicy("corsapp", builder =>
{
    builder.WithOrigins(allowedOrigins.ToArray())
           .AllowAnyMethod()
           .AllowAnyHeader()
           .AllowCredentials();
}));



builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Issuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };

    options.Events = new JwtBearerEvents
    {
        OnChallenge = async context =>
        {
            // Skip the default logic
            context.HandleResponse();

            // Set the custom response status code
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;

            // Optionally, set custom headers
            context.Response.Headers.Append("MedicalAppointmentSystem-Sec", "Unauthorized");

            // Write a custom message
            var responseMessage = new
            {
                statusCode = StatusCodes.Status401Unauthorized,
                success = false,
                message = "You are not authorized! Please log in to access this resource."
            };
            var jsonResponse = JsonSerializer.Serialize(responseMessage);

            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(jsonResponse);
        }
    };


});




builder.Services.AddScoped<ICloudStorageService>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    string accessKey = configuration["AWS:AccessKey"];
    string secretKey = configuration["AWS:SecretKey"];
    string bucketName = configuration["AWS:BucketName"];
    string region = configuration["AWS:Region"];
    string folderName = configuration["AWS:FolderName"];
    var awsClient = new AmazonS3Client(accessKey, secretKey, new AmazonS3Config
    {
        RegionEndpoint = RegionEndpoint.GetBySystemName(region)
    });
    return new AWSFileStorageService(awsClient, bucketName, region, folderName);
});

builder.Services.AddApiVersioning(options =>
{
    options.AssumeDefaultVersionWhenUnspecified = true; // Use default version if not specified
    options.DefaultApiVersion = new ApiVersion(1, 0);    // Default to version 1.0
    options.ReportApiVersions = true;
});


builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

builder.Services.AddLogging();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();


// Configure the HTTP request pipeline.
app.UseStaticFiles();
app.UseCookiePolicy();
app.UseRouting();
app.UseCors("corsapp");
app.UseAuthentication();
app.UseAuthorization();
app.UseSession();  // Make sure this is after UseAuthorization
//app.UseForwardedHeaders();
app.UseHttpsRedirection();

app.UseSerilogRequestLogging();



app.UseSwagger();

app.UseSwaggerUI(c =>
{
    // Add Swagger endpoints for each API version
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "MedicalAppointmentSystem API Version 1.0");
    //c.RoutePrefix = string.Empty;

    if (app.Environment.IsProduction())
    {
        c.RoutePrefix = string.Empty; // Set root path for production
    }
});

//if (IsDevelopment)
//{

//}

app.MapControllers();
app.Run();
