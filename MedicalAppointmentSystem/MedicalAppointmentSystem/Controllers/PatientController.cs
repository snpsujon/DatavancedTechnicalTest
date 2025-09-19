using MedicalAppointmentSystem.Application.ServiceInterface;
using MedicalAppointmentSystem.Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace MedicalAppointmentSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly IPatientService _patientService;

        public PatientController(IPatientService patientService)
        {
            _patientService = patientService;
        }

        /// <summary>
        /// Get all patients
        /// </summary>
        /// <returns>List of all patients</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Patient>>> GetAllPatients()
        {
            try
            {
                var patients = await _patientService.GetAllPatientsAsync();
                //return Ok(patients);
                return Ok(new
                {
                    Status = 200,
                    Message = "Reviews retrieved successfully",
                    Data = patients
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving patients", error = ex.Message });
            }
        }

        /// <summary>
        /// Get patient by ID
        /// </summary>
        /// <param name="id">Patient ID</param>
        /// <returns>Patient details</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<Patient>> GetPatient(int id)
        {
            try
            {
                var patient = await _patientService.GetPatientByIdAsync(id);
                if (patient == null)
                {
                    return NotFound(new { message = $"Patient with ID {id} not found" });
                }
                return Ok(patient);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the patient", error = ex.Message });
            }
        }

        /// <summary>
        /// Create a new patient
        /// </summary>
        /// <param name="patient">Patient data</param>
        /// <returns>Created patient</returns>
        [HttpPost]
        public async Task<ActionResult<Patient>> CreatePatient([FromBody] Patient patient)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                patient.CreatedDate = DateTime.UtcNow;
                var createdPatient = await _patientService.CreatePatientAsync(patient);
                return CreatedAtAction(nameof(GetPatient), new { id = createdPatient.Id }, createdPatient);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the patient", error = ex.Message });
            }
        }

        /// <summary>
        /// Update an existing patient
        /// </summary>
        /// <param name="id">Patient ID</param>
        /// <param name="patient">Updated patient data</param>
        /// <returns>Updated patient</returns>
        [HttpPut("{id}")]
        public async Task<ActionResult<Patient>> UpdatePatient(int id, [FromBody] Patient patient)
        {
            try
            {
                if (id != patient.Id)
                {
                    return BadRequest(new { message = "ID mismatch" });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var existingPatient = await _patientService.GetPatientByIdAsync(id);
                if (existingPatient == null)
                {
                    return NotFound(new { message = $"Patient with ID {id} not found" });
                }

                patient.UpdatedDate = DateTime.UtcNow;
                var updatedPatient = await _patientService.UpdatePatientAsync(patient);
                if (updatedPatient == null)
                {
                    return StatusCode(500, new { message = "Failed to update patient" });
                }

                return Ok(updatedPatient);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the patient", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete a patient
        /// </summary>
        /// <param name="id">Patient ID</param>
        /// <returns>Success status</returns>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePatient(int id)
        {
            try
            {
                var exists = await _patientService.PatientExistsAsync(id);
                if (!exists)
                {
                    return NotFound(new { message = $"Patient with ID {id} not found" });
                }

                var deleted = await _patientService.DeletePatientAsync(id);
                if (!deleted)
                {
                    return StatusCode(500, new { message = "Failed to delete patient" });
                }

                return Ok(new { message = "Patient deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the patient", error = ex.Message });
            }
        }

        /// <summary>
        /// Search patients by name, email, or phone
        /// </summary>
        /// <param name="searchTerm">Search term</param>
        /// <returns>Matching patients</returns>
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Patient>>> SearchPatients([FromQuery] string searchTerm)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(searchTerm))
                {
                    return BadRequest(new { message = "Search term cannot be empty" });
                }

                var patients = await _patientService.SearchPatientsAsync(searchTerm);
                return Ok(patients);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while searching patients", error = ex.Message });
            }
        }
    }
}
