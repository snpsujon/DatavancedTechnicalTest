using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace MedicalAppointmentSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdministratorController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AdministratorController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("GetProjectInfo")]
        public async Task<ActionResult> GetProjectInfo()
        {
            try
            {
                var connString = _configuration.GetConnectionString("DevConnection");
                var builder = new SqlConnectionStringBuilder(connString);

                var data = new
                {
                    Server = builder.DataSource,   
                    Database = builder.InitialCatalog, 
                    Application = "MedicalAppointmentSystemApp" 
                };

                //var data = "";
                return Ok(data);
            }
            catch (Exception ex)
            {
                return BadRequest("Error");
            }
        }
    }
}
