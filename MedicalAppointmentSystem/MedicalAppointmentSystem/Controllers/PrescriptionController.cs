using Microsoft.AspNetCore.Mvc;
using MedicalAppointmentSystem.Application.ServiceInterface;
using MedicalAppointmentSystem.Domain.ViewModels;

namespace MedicalAppointmentSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrescriptionController : ControllerBase
    {
        private readonly IPrescriptionService _prescriptionService;

        public PrescriptionController(IPrescriptionService prescriptionService)
        {
            _prescriptionService = prescriptionService;
        }

        /// <summary>
        /// Get all prescriptions with pagination
        /// </summary>
        /// <param name="skip">Number of records to skip</param>
        /// <param name="take">Number of records to take</param>
        /// <returns>Paginated list of prescriptions</returns>
        [HttpGet]
        public async Task<ActionResult<object>> GetAllPrescriptions([FromQuery] int skip = 0, [FromQuery] int take = 50)
        {
            try
            {
                var prescriptions = await _prescriptionService.GetAllPrescriptionsAsync(skip, take);
                var totalCount = await _prescriptionService.GetPrescriptionsCountAsync();
                
                return Ok(new 
                { 
                    data = prescriptions, 
                    totalCount = totalCount,
                    skip = skip,
                    take = take,
                    hasMore = (skip + take) < totalCount,
                    totalPages = (int)Math.Ceiling((double)totalCount / take)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving prescriptions", error = ex.Message });
            }
        }

        /// <summary>
        /// Get prescription by ID
        /// </summary>
        /// <param name="id">Prescription ID</param>
        /// <returns>Prescription details with grid data</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<PrescriptionVM>> GetPrescription(int id)
        {
            try
            {
                var prescription = await _prescriptionService.GetPrescriptionByIdAsync(id);
                if (prescription == null)
                {
                    return NotFound(new { message = $"Prescription with ID {id} not found" });
                }
                return Ok(prescription);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the prescription", error = ex.Message });
            }
        }

        /// <summary>
        /// Get prescription by appointment ID
        /// </summary>
        /// <param name="appointmentId">Appointment ID</param>
        /// <returns>Prescription for the appointment</returns>
        [HttpGet("appointment/{appointmentId}")]
        public async Task<ActionResult<PrescriptionVM>> GetPrescriptionByAppointment(int appointmentId)
        {
            try
            {
                var prescription = await _prescriptionService.GetPrescriptionByAppointmentIdAsync(appointmentId);
                if (prescription == null)
                {
                    return NotFound(new { message = $"No prescription found for appointment ID {appointmentId}" });
                }
                return Ok(prescription);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the prescription", error = ex.Message });
            }
        }

        /// <summary>
        /// Create a new prescription
        /// </summary>
        /// <param name="prescription">Prescription data with grid details</param>
        /// <returns>Created prescription</returns>
        [HttpPost]
        public async Task<ActionResult<PrescriptionVM>> CreatePrescription([FromBody] PrescriptionCreateVM prescription)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Validate prescription details
                foreach (var detail in prescription.PrescriptionDetails)
                {
                    if (detail.StartDate > detail.EndDate)
                    {
                        return BadRequest(new { message = "Start date cannot be after end date" });
                    }

                    var medicineExists = await _prescriptionService.ValidateMedicineExistsAsync(detail.MedicineId);
                    if (!medicineExists)
                    {
                        return BadRequest(new { message = $"Medicine with ID {detail.MedicineId} not found" });
                    }
                }

                var createdPrescription = await _prescriptionService.CreatePrescriptionAsync(prescription);
                return CreatedAtAction(nameof(GetPrescription), new { id = createdPrescription.Id }, createdPrescription);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the prescription", error = ex.Message });
            }
        }

        /// <summary>
        /// Create or update prescription for appointment
        /// </summary>
        /// <param name="prescription">Prescription data</param>
        /// <returns>Created or updated prescription</returns>
        [HttpPost("appointment")]
        public async Task<ActionResult<PrescriptionVM>> CreateOrUpdatePrescriptionForAppointment([FromBody] PrescriptionCreateVM prescription)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _prescriptionService.CreateOrUpdatePrescriptionForAppointmentAsync(prescription);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating/updating the prescription", error = ex.Message });
            }
        }

        /// <summary>
        /// Update an existing prescription
        /// </summary>
        /// <param name="id">Prescription ID</param>
        /// <param name="prescription">Updated prescription data</param>
        /// <returns>Updated prescription</returns>
        [HttpPut("{id}")]
        public async Task<ActionResult<PrescriptionVM>> UpdatePrescription(int id, [FromBody] PrescriptionUpdateVM prescription)
        {
            try
            {
                if (id != prescription.Id)
                {
                    return BadRequest(new { message = "ID mismatch" });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var existingPrescription = await _prescriptionService.GetPrescriptionByIdAsync(id);
                if (existingPrescription == null)
                {
                    return NotFound(new { message = $"Prescription with ID {id} not found" });
                }

                var updatedPrescription = await _prescriptionService.UpdatePrescriptionAsync(prescription);
                if (updatedPrescription == null)
                {
                    return StatusCode(500, new { message = "Failed to update prescription" });
                }

                return Ok(updatedPrescription);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the prescription", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete a prescription
        /// </summary>
        /// <param name="id">Prescription ID</param>
        /// <returns>Success status</returns>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePrescription(int id)
        {
            try
            {
                var exists = await _prescriptionService.PrescriptionExistsAsync(id);
                if (!exists)
                {
                    return NotFound(new { message = $"Prescription with ID {id} not found" });
                }

                var deleted = await _prescriptionService.DeletePrescriptionAsync(id);
                if (!deleted)
                {
                    return StatusCode(500, new { message = "Failed to delete prescription" });
                }

                return Ok(new { message = "Prescription deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the prescription", error = ex.Message });
            }
        }

        // Grid Operations

        /// <summary>
        /// Add a new row to prescription grid
        /// </summary>
        /// <param name="prescriptionId">Prescription ID</param>
        /// <param name="prescriptionDetail">New prescription detail</param>
        /// <returns>Added prescription detail</returns>
        [HttpPost("{prescriptionId}/details")]
        public async Task<ActionResult<PrescriptionDetailVM>> AddPrescriptionDetail(int prescriptionId, [FromBody] PrescriptionDetailAddVM prescriptionDetail)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                prescriptionDetail.PrescriptionId = prescriptionId;

                // Validate dates
                if (prescriptionDetail.StartDate > prescriptionDetail.EndDate)
                {
                    return BadRequest(new { message = "Start date cannot be after end date" });
                }

                // Validate medicine exists
                var medicineExists = await _prescriptionService.ValidateMedicineExistsAsync(prescriptionDetail.MedicineId);
                if (!medicineExists)
                {
                    return BadRequest(new { message = $"Medicine with ID {prescriptionDetail.MedicineId} not found" });
                }

                var addedDetail = await _prescriptionService.AddPrescriptionDetailAsync(prescriptionDetail);
                return Ok(addedDetail);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while adding prescription detail", error = ex.Message });
            }
        }

        /// <summary>
        /// Update a row in prescription grid
        /// </summary>
        /// <param name="prescriptionDetailId">Prescription detail ID</param>
        /// <param name="prescriptionDetail">Updated prescription detail</param>
        /// <returns>Updated prescription detail</returns>
        [HttpPut("details/{prescriptionDetailId}")]
        public async Task<ActionResult<PrescriptionDetailVM>> UpdatePrescriptionDetail(int prescriptionDetailId, [FromBody] PrescriptionDetailUpdateVM prescriptionDetail)
        {
            try
            {
                if (prescriptionDetailId != prescriptionDetail.Id)
                {
                    return BadRequest(new { message = "ID mismatch" });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Validate dates
                if (prescriptionDetail.StartDate > prescriptionDetail.EndDate)
                {
                    return BadRequest(new { message = "Start date cannot be after end date" });
                }

                // Validate medicine exists
                var medicineExists = await _prescriptionService.ValidateMedicineExistsAsync(prescriptionDetail.MedicineId);
                if (!medicineExists)
                {
                    return BadRequest(new { message = $"Medicine with ID {prescriptionDetail.MedicineId} not found" });
                }

                var updatedDetail = await _prescriptionService.UpdatePrescriptionDetailAsync(prescriptionDetail);
                if (updatedDetail == null)
                {
                    return StatusCode(500, new { message = "Failed to update prescription detail" });
                }

                return Ok(updatedDetail);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating prescription detail", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete a row from prescription grid
        /// </summary>
        /// <param name="prescriptionDetailId">Prescription detail ID</param>
        /// <returns>Success status</returns>
        [HttpDelete("details/{prescriptionDetailId}")]
        public async Task<ActionResult> DeletePrescriptionDetail(int prescriptionDetailId)
        {
            try
            {
                var deleted = await _prescriptionService.DeletePrescriptionDetailAsync(prescriptionDetailId);
                if (!deleted)
                {
                    return StatusCode(500, new { message = "Failed to delete prescription detail" });
                }

                return Ok(new { message = "Prescription detail deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting prescription detail", error = ex.Message });
            }
        }

        /// <summary>
        /// Update prescription grid (bulk operation)
        /// </summary>
        /// <param name="gridOperation">Grid operation data</param>
        /// <returns>Updated prescription with grid data</returns>
        [HttpPut("grid")]
        public async Task<ActionResult<PrescriptionVM>> UpdatePrescriptionGrid([FromBody] PrescriptionGridOperationVM gridOperation)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var updatedPrescription = await _prescriptionService.UpdatePrescriptionGridAsync(gridOperation);
                return Ok(updatedPrescription);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating prescription grid", error = ex.Message });
            }
        }

        /// <summary>
        /// Get prescription details by prescription ID
        /// </summary>
        /// <param name="prescriptionId">Prescription ID</param>
        /// <returns>List of prescription details</returns>
        [HttpGet("{prescriptionId}/details")]
        public async Task<ActionResult<IEnumerable<PrescriptionDetailVM>>> GetPrescriptionDetails(int prescriptionId)
        {
            try
            {
                var details = await _prescriptionService.GetPrescriptionDetailsByPrescriptionIdAsync(prescriptionId);
                return Ok(details);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving prescription details", error = ex.Message });
            }
        }

        // Additional operations

        /// <summary>
        /// Get prescriptions by patient ID with pagination
        /// </summary>
        /// <param name="patientId">Patient ID</param>
        /// <param name="skip">Number of records to skip</param>
        /// <param name="take">Number of records to take</param>
        /// <returns>Paginated patient's prescriptions</returns>
        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<object>> GetPrescriptionsByPatient(int patientId, [FromQuery] int skip = 0, [FromQuery] int take = 50)
        {
            try
            {
                var prescriptions = await _prescriptionService.GetPrescriptionsByPatientIdAsync(patientId, skip, take);
                var totalCount = await _prescriptionService.GetPrescriptionsByPatientIdCountAsync(patientId);
                
                return Ok(new 
                { 
                    data = prescriptions, 
                    totalCount = totalCount,
                    skip = skip,
                    take = take,
                    hasMore = (skip + take) < totalCount,
                    totalPages = (int)Math.Ceiling((double)totalCount / take)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving patient prescriptions", error = ex.Message });
            }
        }

        /// <summary>
        /// Get prescriptions by doctor ID
        /// </summary>
        /// <param name="doctorId">Doctor ID</param>
        /// <returns>Doctor's prescriptions</returns>
        [HttpGet("doctor/{doctorId}")]
        public async Task<ActionResult<IEnumerable<PrescriptionVM>>> GetPrescriptionsByDoctor(int doctorId)
        {
            try
            {
                var prescriptions = await _prescriptionService.GetPrescriptionsByDoctorIdAsync(doctorId);
                return Ok(prescriptions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving doctor prescriptions", error = ex.Message });
            }
        }

        /// <summary>
        /// Get prescriptions by date range
        /// </summary>
        /// <param name="startDate">Start date</param>
        /// <param name="endDate">End date</param>
        /// <returns>Prescriptions within the date range</returns>
        [HttpGet("daterange")]
        public async Task<ActionResult<IEnumerable<PrescriptionVM>>> GetPrescriptionsByDateRange([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            try
            {
                var prescriptions = await _prescriptionService.GetPrescriptionsByDateRangeAsync(startDate, endDate);
                return Ok(prescriptions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving prescriptions by date range", error = ex.Message });
            }
        }

        /// <summary>
        /// Search prescriptions with pagination
        /// </summary>
        /// <param name="searchTerm">Search term</param>
        /// <param name="skip">Number of records to skip</param>
        /// <param name="take">Number of records to take</param>
        /// <returns>Paginated matching prescriptions</returns>
        [HttpGet("search")]
        public async Task<ActionResult<object>> SearchPrescriptions([FromQuery] string searchTerm, [FromQuery] int skip = 0, [FromQuery] int take = 50)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(searchTerm))
                {
                    return BadRequest(new { message = "Search term cannot be empty" });
                }

                var prescriptions = await _prescriptionService.SearchPrescriptionsAsync(searchTerm, skip, take);
                var totalCount = await _prescriptionService.SearchPrescriptionsCountAsync(searchTerm);
                
                return Ok(new 
                { 
                    data = prescriptions, 
                    totalCount = totalCount,
                    skip = skip,
                    take = take,
                    hasMore = (skip + take) < totalCount,
                    totalPages = (int)Math.Ceiling((double)totalCount / take)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while searching prescriptions", error = ex.Message });
            }
        }
    }
}
