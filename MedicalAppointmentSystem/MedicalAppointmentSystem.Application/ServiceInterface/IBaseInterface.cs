namespace MedicalAppointmentSystem.Application.ServiceInterface
{
    public interface IBaseInterface<TEntity> where TEntity : class
    {
        Task<IEnumerable<TEntity>> GetAll();
        Task<TEntity> FindByIdAsync(int id);
        Task<TEntity> FindByNoAsync(string no);
        Task<bool> InsertAsync(TEntity entity);
        Task<bool> updateByAsync(TEntity entity);
    }
}
