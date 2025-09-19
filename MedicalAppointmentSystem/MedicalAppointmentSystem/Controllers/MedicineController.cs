using Microsoft.AspNetCore.Mvc;
using MedicalAppointmentSystem.Application.ServiceInterface;
using MedicalAppointmentSystem.Domain.ViewModels;
using MedicalAppointmentSystem.Domain.Models;

namespace MedicalAppointmentSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicineController : ControllerBase
    {
        private readonly IMedicineService _medicineService;

        public MedicineController(IMedicineService medicineService)
        {
            _medicineService = medicineService;
        }

        /// <summary>
        /// Get all medicines with pagination
        /// </summary>
        /// <param name="skip">Number of records to skip</param>
        /// <param name="take">Number of records to take</param>
        /// <returns>Paginated list of medicines</returns>
        [HttpGet]
        public async Task<ActionResult<object>> GetAllMedicines([FromQuery] int skip = 0, [FromQuery] int take = 50)
        {
            try
            {
                var medicines = await _medicineService.GetAllMedicinesAsync(skip, take);
                var totalCount = await _medicineService.GetMedicinesCountAsync();
                
                return Ok(new 
                { 
                    data = medicines, 
                    totalCount = totalCount,
                    skip = skip,
                    take = take,
                    hasMore = (skip + take) < totalCount,
                    totalPages = (int)Math.Ceiling((double)totalCount / take)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving medicines", error = ex.Message });
            }
        }

        /// <summary>
        /// Get active medicines (for dropdown) with pagination
        /// </summary>
        /// <param name="skip">Number of records to skip</param>
        /// <param name="take">Number of records to take</param>
        /// <returns>Paginated list of active medicines</returns>
        [HttpGet("active")]
        public async Task<ActionResult<object>> GetActiveMedicines([FromQuery] int skip = 0, [FromQuery] int take = 50)
        {
            try
            {
                var medicines = await _medicineService.GetActiveMedicinesAsync(skip, take);
                var totalCount = await _medicineService.GetActiveMedicinesCountAsync();
                
                return Ok(new 
                { 
                    data = medicines, 
                    totalCount = totalCount,
                    skip = skip,
                    take = take,
                    hasMore = (skip + take) < totalCount,
                    totalPages = (int)Math.Ceiling((double)totalCount / take)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving active medicines", error = ex.Message });
            }
        }

        /// <summary>
        /// Get medicine by ID
        /// </summary>
        /// <param name="id">Medicine ID</param>
        /// <returns>Medicine details</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<MedicineVM>> GetMedicine(int id)
        {
            try
            {
                var medicine = await _medicineService.GetMedicineByIdAsync(id);
                if (medicine == null)
                {
                    return NotFound(new { message = $"Medicine with ID {id} not found" });
                }
                return Ok(medicine);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the medicine", error = ex.Message });
            }
        }

        /// <summary>
        /// Search medicines with pagination
        /// </summary>
        /// <param name="searchTerm">Search term</param>
        /// <param name="skip">Number of records to skip</param>
        /// <param name="take">Number of records to take</param>
        /// <returns>Paginated matching medicines</returns>
        [HttpGet("search")]
        public async Task<ActionResult<object>> SearchMedicines([FromQuery] string searchTerm, [FromQuery] int skip = 0, [FromQuery] int take = 50)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(searchTerm))
                {
                    return BadRequest(new { message = "Search term cannot be empty" });
                }

                var medicines = await _medicineService.SearchMedicinesAsync(searchTerm, skip, take);
                var totalCount = await _medicineService.SearchMedicinesCountAsync(searchTerm);
                
                return Ok(new 
                { 
                    data = medicines, 
                    totalCount = totalCount,
                    skip = skip,
                    take = take,
                    hasMore = (skip + take) < totalCount,
                    totalPages = (int)Math.Ceiling((double)totalCount / take)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while searching medicines", error = ex.Message });
            }
        }

        /// <summary>
        /// Get medicines by manufacturer with pagination
        /// </summary>
        /// <param name="manufacturer">Manufacturer name</param>
        /// <param name="skip">Number of records to skip</param>
        /// <param name="take">Number of records to take</param>
        /// <returns>Paginated medicines from the specified manufacturer</returns>
        [HttpGet("manufacturer/{manufacturer}")]
        public async Task<ActionResult<object>> GetMedicinesByManufacturer(string manufacturer, [FromQuery] int skip = 0, [FromQuery] int take = 50)
        {
            try
            {
                var medicines = await _medicineService.GetMedicinesByManufacturerAsync(manufacturer, skip, take);
                var totalCount = await _medicineService.GetMedicinesByManufacturerCountAsync(manufacturer);
                
                return Ok(new 
                { 
                    data = medicines, 
                    totalCount = totalCount,
                    skip = skip,
                    take = take,
                    hasMore = (skip + take) < totalCount,
                    totalPages = (int)Math.Ceiling((double)totalCount / take)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving medicines by manufacturer", error = ex.Message });
            }
        }

        /// <summary>
        /// Get medicines by dosage form with pagination
        /// </summary>
        /// <param name="dosageForm">Dosage form</param>
        /// <param name="skip">Number of records to skip</param>
        /// <param name="take">Number of records to take</param>
        /// <returns>Paginated medicines with the specified dosage form</returns>
        [HttpGet("dosageform/{dosageForm}")]
        public async Task<ActionResult<object>> GetMedicinesByDosageForm(string dosageForm, [FromQuery] int skip = 0, [FromQuery] int take = 50)
        {
            try
            {
                var medicines = await _medicineService.GetMedicinesByDosageFormAsync(dosageForm, skip, take);
                var totalCount = await _medicineService.GetMedicinesByDosageFormCountAsync(dosageForm);
                
                return Ok(new 
                { 
                    data = medicines, 
                    totalCount = totalCount,
                    skip = skip,
                    take = take,
                    hasMore = (skip + take) < totalCount,
                    totalPages = (int)Math.Ceiling((double)totalCount / take)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving medicines by dosage form", error = ex.Message });
            }
        }

        /// <summary>
        /// Create a new medicine
        /// </summary>
        /// <param name="medicine">Medicine data</param>
        /// <returns>Created medicine</returns>
        [HttpPost]
        public async Task<ActionResult<MedicineVM>> CreateMedicine([FromBody] Medicine medicine)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Set default values
                medicine.CreatedDate = DateTime.UtcNow;
                medicine.CreatedBy = "System"; // You can get this from the authenticated user

                var createdMedicine = await _medicineService.CreateMedicineAsync(medicine);
                return CreatedAtAction(nameof(GetMedicine), new { id = createdMedicine.Id }, createdMedicine);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the medicine", error = ex.Message });
            }
        }

        /// <summary>
        /// Update an existing medicine
        /// </summary>
        /// <param name="id">Medicine ID</param>
        /// <param name="medicine">Updated medicine data</param>
        /// <returns>Updated medicine</returns>
        [HttpPut("{id}")]
        public async Task<ActionResult<MedicineVM>> UpdateMedicine(int id, [FromBody] Medicine medicine)
        {
            try
            {
                if (id != medicine.Id)
                {
                    return BadRequest(new { message = "ID mismatch" });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var existingMedicine = await _medicineService.GetMedicineByIdAsync(id);
                if (existingMedicine == null)
                {
                    return NotFound(new { message = $"Medicine with ID {id} not found" });
                }

                // Set update values
                medicine.UpdatedDate = DateTime.UtcNow;
                medicine.UpdatedBy = "System"; // You can get this from the authenticated user

                var updatedMedicine = await _medicineService.UpdateMedicineAsync(medicine);
                if (updatedMedicine == null)
                {
                    return StatusCode(500, new { message = "Failed to update medicine" });
                }

                return Ok(updatedMedicine);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the medicine", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete a medicine
        /// </summary>
        /// <param name="id">Medicine ID</param>
        /// <returns>Success status</returns>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMedicine(int id)
        {
            try
            {
                var exists = await _medicineService.MedicineExistsAsync(id);
                if (!exists)
                {
                    return NotFound(new { message = $"Medicine with ID {id} not found" });
                }

                var deleted = await _medicineService.DeleteMedicineAsync(id);
                if (!deleted)
                {
                    return StatusCode(500, new { message = "Failed to delete medicine" });
                }

                return Ok(new { message = "Medicine deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the medicine", error = ex.Message });
            }
        }
    }
}
