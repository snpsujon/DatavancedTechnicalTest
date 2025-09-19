using Amazon.S3;
using Amazon.S3.Model;
using MedicalAppointmentSystem.Application.ServiceInterface;
using Microsoft.AspNetCore.Http;

namespace MedicalAppointmentSystem.Infrastructure.ServiceRepository
{
    public class AWSFileStorageService : ICloudStorageService
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;
        private readonly string _region;
        private readonly string _folderName;
        public AWSFileStorageService(IAmazonS3 s3Client, string bucketName, string region, string folderName)
        {
            _s3Client = s3Client;
            _bucketName = bucketName;
            _region = region;
            _folderName = folderName;

        }
        public async Task<dynamic> UploadSingleFileAsync(IFormFile file)
        {
            try
            {
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                using (var stream = file.OpenReadStream())
                {
                    var uploadRequest = new PutObjectRequest
                    {
                        InputStream = stream,
                        BucketName = _bucketName,
                        Key = _folderName + fileName
                    };
                    var response = await _s3Client.PutObjectAsync(uploadRequest);
                    return fileName;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"File upload failed: {ex.Message}", ex);
            }
        }

        public async Task<List<dynamic>> UploadMultipleFilesAsync(List<IFormFile>? files)
        {
            var uploadedFileNames = new List<dynamic>();

            foreach (var file in files)
            {
                string uploadedFileName = await UploadSingleFileAsync(file);
                uploadedFileNames.Add(uploadedFileName);
            }

            return uploadedFileNames;
        }

        public async Task<string> GetFileDownloadUrl(string fileName)
        {
            try
            {
                var request = new GetPreSignedUrlRequest
                {
                    BucketName = _bucketName,
                    Key = _folderName + fileName,
                    Expires = DateTime.UtcNow.AddHours(1)
                };
                string url = _s3Client.GetPreSignedURL(request);
                return url;
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to generate download URL: {ex.Message}", ex);
            }
        }
        public async Task<string> GetFileDownloadPermanentUrl(string fileName)
        {
            try
            {
                // Set the file's ACL to public
                //var putAclRequest = new PutACLRequest
                //{
                //    BucketName = _bucketName,
                //    Key = fileName,
                //    CannedACL = S3CannedACL.PublicRead
                //};
                //await _s3Client.PutACLAsync(putAclRequest);

                //https://ctf-bucket-s3.s3.me-central-1.amazonaws.com/0020f034-37b5-4b2d-9a3b-17172edab619.png

                // Construct the permanent URL
                string url = $"https://{_bucketName}.s3.{_region}.amazonaws.com/{fileName}";
                return url;
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to generate permanent download URL: {ex.Message}", ex);
            }
        }



        public async Task<dynamic> DeleteFileAsync(string fileName)
        {
            try
            {
                var deleteObjectRequest = new DeleteObjectRequest
                {
                    BucketName = _bucketName,
                    Key = _folderName + fileName
                };
                await _s3Client.DeleteObjectAsync(deleteObjectRequest);
                return "Deleted";
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to delete file: {ex.Message}", ex);
            }
        }
        public async Task<dynamic> UploadFileFromUrlAsync(string imageUrl)
        {
            try
            {
                using (var httpClient = new HttpClient())
                {
                    // Download the image from the URL
                    var response = await httpClient.GetAsync(imageUrl);
                    if (!response.IsSuccessStatusCode)
                    {
                        throw new Exception($"Failed to download image from URL: {imageUrl}");
                    }

                    var imageStream = await response.Content.ReadAsStreamAsync();
                    var fileName = $"{Guid.NewGuid()}{Path.GetExtension(imageUrl)}";

                    // Upload to S3 using the existing method
                    var uploadRequest = new PutObjectRequest
                    {
                        InputStream = imageStream,
                        BucketName = _bucketName,
                        Key = _folderName + fileName
                    };

                    var s3Response = await _s3Client.PutObjectAsync(uploadRequest);
                    return fileName; // Return the S3 file name
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"File upload from URL failed: {ex.Message}", ex);
            }
        }

    }
}
