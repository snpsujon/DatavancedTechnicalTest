using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace MedicalAppointmentSystem.Infrastructure.DBContext
{
    public class DapperContext
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;
        private readonly string _dbCon;
        private readonly bool _isdev;

        public DapperContext(IConfiguration configuration)
        {
            _configuration = configuration;
            _isdev = _configuration.GetValue<bool>("IsDevelopment");
            _dbCon = _isdev ? "DevConnection" : "DevConnectionProduction";
            _connectionString = _configuration.GetConnectionString(_dbCon);
        }
        public IDbConnection CreateConnection() => new SqlConnection(_connectionString);
    }
}
