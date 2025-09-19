namespace MedicalAppointmentSystem.Application.ServiceInterface
{
    public interface ICommon
    {
        Task<dynamic> ExecuteStoreProcedureWithData(string spName, int flag, dynamic data);
    }
}
