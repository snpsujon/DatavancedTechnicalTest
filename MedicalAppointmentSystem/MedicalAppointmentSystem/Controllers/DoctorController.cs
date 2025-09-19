using Microsoft.AspNetCore.Mvc;
using MedicalAppointmentSystem.Application.ServiceInterface;
using MedicalAppointmentSystem.Domain.Models;

namespace MedicalAppointmentSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorController : ControllerBase
    {
        private readonly IDoctorService _doctorService;

        public DoctorController(IDoctorService doctorService)
        {
            _doctorService = doctorService;
        }

        /// <summary>
        /// Get all doctors
        /// </summary>
        /// <returns>List of all doctors</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Doctor>>> GetAllDoctors()
        {
            try
            {
                var doctors = await _doctorService.GetAllDoctorsAsync();
                return Ok(doctors);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving doctors", error = ex.Message });
            }
        }

        /// <summary>
        /// Get doctor by ID
        /// </summary>
        /// <param name="id">Doctor ID</param>
        /// <returns>Doctor details</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<Doctor>> GetDoctor(int id)
        {
            try
            {
                var doctor = await _doctorService.GetDoctorByIdAsync(id);
                if (doctor == null)
                {
                    return NotFound(new { message = $"Doctor with ID {id} not found" });
                }
                return Ok(doctor);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the doctor", error = ex.Message });
            }
        }

        /// <summary>
        /// Create a new doctor
        /// </summary>
        /// <param name="doctor">Doctor data</param>
        /// <returns>Created doctor</returns>
        [HttpPost]
        public async Task<ActionResult<Doctor>> CreateDoctor([FromBody] Doctor doctor)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                doctor.CreatedDate = DateTime.UtcNow;
                var createdDoctor = await _doctorService.CreateDoctorAsync(doctor);
                return CreatedAtAction(nameof(GetDoctor), new { id = createdDoctor.Id }, createdDoctor);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the doctor", error = ex.Message });
            }
        }

        /// <summary>
        /// Update an existing doctor
        /// </summary>
        /// <param name="id">Doctor ID</param>
        /// <param name="doctor">Updated doctor data</param>
        /// <returns>Updated doctor</returns>
        [HttpPut("{id}")]
        public async Task<ActionResult<Doctor>> UpdateDoctor(int id, [FromBody] Doctor doctor)
        {
            try
            {
                if (id != doctor.Id)
                {
                    return BadRequest(new { message = "ID mismatch" });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var existingDoctor = await _doctorService.GetDoctorByIdAsync(id);
                if (existingDoctor == null)
                {
                    return NotFound(new { message = $"Doctor with ID {id} not found" });
                }

                doctor.UpdatedDate = DateTime.UtcNow;
                var updatedDoctor = await _doctorService.UpdateDoctorAsync(doctor);
                if (updatedDoctor == null)
                {
                    return StatusCode(500, new { message = "Failed to update doctor" });
                }

                return Ok(updatedDoctor);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the doctor", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete a doctor
        /// </summary>
        /// <param name="id">Doctor ID</param>
        /// <returns>Success status</returns>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteDoctor(int id)
        {
            try
            {
                var exists = await _doctorService.DoctorExistsAsync(id);
                if (!exists)
                {
                    return NotFound(new { message = $"Doctor with ID {id} not found" });
                }

                var deleted = await _doctorService.DeleteDoctorAsync(id);
                if (!deleted)
                {
                    return StatusCode(500, new { message = "Failed to delete doctor" });
                }

                return Ok(new { message = "Doctor deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the doctor", error = ex.Message });
            }
        }

        /// <summary>
        /// Search doctors by name, specialization, or department
        /// </summary>
        /// <param name="searchTerm">Search term</param>
        /// <returns>Matching doctors</returns>
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Doctor>>> SearchDoctors([FromQuery] string searchTerm)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(searchTerm))
                {
                    return BadRequest(new { message = "Search term cannot be empty" });
                }

                var doctors = await _doctorService.SearchDoctorsAsync(searchTerm);
                return Ok(doctors);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while searching doctors", error = ex.Message });
            }
        }

        /// <summary>
        /// Get doctors by specialization
        /// </summary>
        /// <param name="specialization">Specialization name</param>
        /// <returns>Doctors with the specified specialization</returns>
        [HttpGet("specialization/{specialization}")]
        public async Task<ActionResult<IEnumerable<Doctor>>> GetDoctorsBySpecialization(string specialization)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(specialization))
                {
                    return BadRequest(new { message = "Specialization cannot be empty" });
                }

                var doctors = await _doctorService.GetDoctorsBySpecializationAsync(specialization);
                return Ok(doctors);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving doctors by specialization", error = ex.Message });
            }
        }

        /// <summary>
        /// Get available doctors
        /// </summary>
        /// <returns>List of available doctors</returns>
        [HttpGet("available")]
        public async Task<ActionResult<IEnumerable<Doctor>>> GetAvailableDoctors()
        {
            try
            {
                var doctors = await _doctorService.GetAvailableDoctorsAsync();
                return Ok(doctors);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving available doctors", error = ex.Message });
            }
        }

        /// <summary>
        /// Update doctor availability
        /// </summary>
        /// <param name="id">Doctor ID</param>
        /// <param name="isAvailable">Availability status</param>
        /// <returns>Success status</returns>
        [HttpPut("{id}/availability")]
        public async Task<ActionResult> UpdateDoctorAvailability(int id, [FromBody] bool isAvailable)
        {
            try
            {
                var exists = await _doctorService.DoctorExistsAsync(id);
                if (!exists)
                {
                    return NotFound(new { message = $"Doctor with ID {id} not found" });
                }

                var updated = await _doctorService.UpdateDoctorAvailabilityAsync(id, isAvailable);
                if (!updated)
                {
                    return StatusCode(500, new { message = "Failed to update doctor availability" });
                }

                return Ok(new { message = "Doctor availability updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating doctor availability", error = ex.Message });
            }
        }
    }
}

