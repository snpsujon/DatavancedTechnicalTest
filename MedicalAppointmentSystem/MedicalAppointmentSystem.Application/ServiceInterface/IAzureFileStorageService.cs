using Microsoft.AspNetCore.Http;

namespace MedicalAppointmentSystem.Application.ServiceInterface
{
    public interface ICloudStorageService
    {
        Task<dynamic> UploadSingleFileAsync(IFormFile file);
        Task<List<dynamic>> UploadMultipleFilesAsync(List<IFormFile>? files);
        Task<string> GetFileDownloadUrl(string fileName);
        Task<string> GetFileDownloadPermanentUrl(string fileName);
        Task<dynamic> DeleteFileAsync(string fileName);
        Task<dynamic> UploadFileFromUrlAsync(string imageUrl);
    }
}
