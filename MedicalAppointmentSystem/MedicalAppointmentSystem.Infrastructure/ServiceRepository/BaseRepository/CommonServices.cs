using Dapper;
using MedicalAppointmentSystem.Application.ServiceInterface;
using MedicalAppointmentSystem.Domain.Models;
using MedicalAppointmentSystem.Domain.ViewModels;
using MedicalAppointmentSystem.Infrastructure.DBContext;
using MedicalAppointmentSystem.Infrastructure.ServiceRepository.BaseRepository;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Text.Json;

namespace MedicalAppointmentSystem.Infrastructure.ServiceRepository.BaseRepository
{
    public class CommonServices : BaseRepository<SettingsVM>, ICommon
    {
        public CommonServices(EFContext context, IdentityContext applicationDb, DapperContext contextDapper, UserManager<ApplicationDbUser> userManager, IConfiguration configuration, ICloudStorageService fileUpload, RoleManager<IdentityRole> roleManager) : base(context, applicationDb, contextDapper, userManager, configuration, fileUpload, roleManager)
        {
        }

        public async Task<dynamic> ExecuteStoreProcedureWithData(string spName, int flag, dynamic data)
        {
            try
            {
                // Ensure data is an ExpandoObject (IDictionary for property access)
                if (data is not IDictionary<string, object> dataDict)
                {
                    throw new ArgumentException("Invalid data format. Expected an ExpandoObject.");
                }

                var parameters = new DynamicParameters();
                parameters.Add("@Flag", flag);

                // Fetch stored procedure parameter names
                var spParameters = await GetStoredProcedureParameters(spName);

                foreach (var param in spParameters)
                {
                    string paramNameWithoutAt = param.TrimStart('@'); // Remove '@' from SP param

                    // Skip '@Flag' and ensure the input data has the parameter
                    if (param.Equals("@Flag", StringComparison.OrdinalIgnoreCase) || !dataDict.ContainsKey(paramNameWithoutAt))
                    {
                        continue;
                    }

                    // Assign value if exists, otherwise set null
                    parameters.Add(param, dataDict[paramNameWithoutAt] ?? DBNull.Value);
                }

                using (var _dp = _contextDapper.CreateConnection())
                {
                    var query = await _dp.QueryAsync<dynamic>(
                        spName,
                        parameters,
                        commandType: CommandType.StoredProcedure
                    );
                    return query;
                }
            }
            catch (Exception ex)
            {
                return new RetrurnResponse
                {
                    status = 500,
                    message = "An error occurred while processing the request",
                    errorDetails = ex.Message
                };
            }
        }





        private async Task<List<string>> GetStoredProcedureParameters(string spName)
        {
            using (var _dp = _contextDapper.CreateConnection())
            {
                string query = @"
            SELECT '@' + p.name AS ParameterName
            FROM sys.parameters p
            INNER JOIN sys.procedures sp ON p.object_id = sp.object_id
            WHERE sp.name = @SpName";

                var parameters = new DynamicParameters();
                parameters.Add("@SpName", spName);

                var result = await _dp.QueryAsync<string>(query, parameters);
                return result.ToList();
            }
        }
        private object GetJsonElementValue(JsonElement element)
        {
            return element.ValueKind switch
            {
                JsonValueKind.String => element.GetString(),
                JsonValueKind.Number => element.TryGetInt32(out int intValue) ? intValue : (object)element.GetDouble(),
                JsonValueKind.True => true,
                JsonValueKind.False => false,
                _ => null
            };
        }

    }
}
