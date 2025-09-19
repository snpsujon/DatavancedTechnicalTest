using Microsoft.AspNetCore.Mvc;
using MedicalAppointmentSystem.Application.ServiceInterface;
using MedicalAppointmentSystem.Domain.ViewModels;

namespace MedicalAppointmentSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;

        public AppointmentController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        /// <summary>
        /// Get all appointments with pagination
        /// </summary>
        /// <param name="skip">Number of records to skip</param>
        /// <param name="take">Number of records to take</param>
        /// <returns>Paginated list of appointments</returns>
        [HttpGet]
        public async Task<ActionResult<object>> GetAllAppointments([FromQuery] int skip = 0, [FromQuery] int take = 50)
        {
            try
            {
                var appointments = await _appointmentService.GetAllAppointmentsAsync(skip, take);
                var totalCount = await _appointmentService.GetAppointmentsCountAsync();
                
                return Ok(new 
                { 
                    data = appointments, 
                    totalCount = totalCount,
                    skip = skip,
                    take = take,
                    hasMore = (skip + take) < totalCount,
                    totalPages = (int)Math.Ceiling((double)totalCount / take)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving appointments", error = ex.Message });
            }
        }

        /// <summary>
        /// Get appointment by ID
        /// </summary>
        /// <param name="id">Appointment ID</param>
        /// <returns>Appointment details</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<AppointmentVM>> GetAppointment(int id)
        {
            try
            {
                var appointment = await _appointmentService.GetAppointmentByIdAsync(id);
                if (appointment == null)
                {
                    return NotFound(new { message = $"Appointment with ID {id} not found" });
                }
                return Ok(appointment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the appointment", error = ex.Message });
            }
        }

        /// <summary>
        /// Create a new appointment
        /// </summary>
        /// <param name="appointment">Appointment data</param>
        /// <returns>Created appointment</returns>
        [HttpPost]
        public async Task<ActionResult<AppointmentVM>> CreateAppointment([FromBody] AppointmentCreateVM appointment)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Check if doctor is available
                var isDoctorAvailable = await _appointmentService.IsDoctorAvailableAsync(appointment.DoctorId, appointment.AppointmentDate);
                if (!isDoctorAvailable)
                {
                    return BadRequest(new { message = "Doctor is not available at the specified time" });
                }

                // Check if time slot is available
                var isTimeSlotAvailable = await _appointmentService.IsTimeSlotAvailableAsync(appointment.DoctorId, appointment.AppointmentDate);
                if (!isTimeSlotAvailable)
                {
                    return BadRequest(new { message = "Time slot is not available" });
                }

                var createdAppointment = await _appointmentService.CreateAppointmentAsync(appointment);
                return CreatedAtAction(nameof(GetAppointment), new { id = createdAppointment.Id }, createdAppointment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the appointment", error = ex.Message });
            }
        }

        /// <summary>
        /// Update an existing appointment
        /// </summary>
        /// <param name="id">Appointment ID</param>
        /// <param name="appointment">Updated appointment data</param>
        /// <returns>Updated appointment</returns>
        [HttpPut("{id}")]
        public async Task<ActionResult<AppointmentVM>> UpdateAppointment(int id, [FromBody] AppointmentUpdateVM appointment)
        {
            try
            {
                if (id != appointment.Id)
                {
                    return BadRequest(new { message = "ID mismatch" });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var existingAppointment = await _appointmentService.GetAppointmentByIdAsync(id);
                if (existingAppointment == null)
                {
                    return NotFound(new { message = $"Appointment with ID {id} not found" });
                }

                // Check if doctor is available for the new time
                if (existingAppointment.AppointmentDate != appointment.AppointmentDate || existingAppointment.DoctorId != appointment.DoctorId)
                {
                    var isDoctorAvailable = await _appointmentService.IsDoctorAvailableAsync(appointment.DoctorId, appointment.AppointmentDate);
                    if (!isDoctorAvailable)
                    {
                        return BadRequest(new { message = "Doctor is not available at the specified time" });
                    }

                    var isTimeSlotAvailable = await _appointmentService.IsTimeSlotAvailableAsync(appointment.DoctorId, appointment.AppointmentDate);
                    if (!isTimeSlotAvailable)
                    {
                        return BadRequest(new { message = "Time slot is not available" });
                    }
                }

                var updatedAppointment = await _appointmentService.UpdateAppointmentAsync(appointment);
                if (updatedAppointment == null)
                {
                    return StatusCode(500, new { message = "Failed to update appointment" });
                }

                return Ok(updatedAppointment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the appointment", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete an appointment
        /// </summary>
        /// <param name="id">Appointment ID</param>
        /// <returns>Success status</returns>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAppointment(int id)
        {
            try
            {
                var exists = await _appointmentService.AppointmentExistsAsync(id);
                if (!exists)
                {
                    return NotFound(new { message = $"Appointment with ID {id} not found" });
                }

                var deleted = await _appointmentService.DeleteAppointmentAsync(id);
                if (!deleted)
                {
                    return StatusCode(500, new { message = "Failed to delete appointment" });
                }

                return Ok(new { message = "Appointment deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the appointment", error = ex.Message });
            }
        }

        /// <summary>
        /// Get appointments by patient ID
        /// </summary>
        /// <param name="patientId">Patient ID</param>
        /// <returns>Patient's appointments</returns>
        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<IEnumerable<AppointmentVM>>> GetAppointmentsByPatient(int patientId)
        {
            try
            {
                var appointments = await _appointmentService.GetAppointmentsByPatientIdAsync(patientId);
                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving patient appointments", error = ex.Message });
            }
        }

        /// <summary>
        /// Get appointments by doctor ID
        /// </summary>
        /// <param name="doctorId">Doctor ID</param>
        /// <returns>Doctor's appointments</returns>
        [HttpGet("doctor/{doctorId}")]
        public async Task<ActionResult<IEnumerable<AppointmentVM>>> GetAppointmentsByDoctor(int doctorId)
        {
            try
            {
                var appointments = await _appointmentService.GetAppointmentsByDoctorIdAsync(doctorId);
                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving doctor appointments", error = ex.Message });
            }
        }

        /// <summary>
        /// Get appointments by date
        /// </summary>
        /// <param name="date">Appointment date</param>
        /// <returns>Appointments for the specified date</returns>
        [HttpGet("date/{date:datetime}")]
        public async Task<ActionResult<IEnumerable<AppointmentVM>>> GetAppointmentsByDate(DateTime date)
        {
            try
            {
                var appointments = await _appointmentService.GetAppointmentsByDateAsync(date);
                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving appointments by date", error = ex.Message });
            }
        }

        /// <summary>
        /// Get appointments by date range
        /// </summary>
        /// <param name="startDate">Start date</param>
        /// <param name="endDate">End date</param>
        /// <returns>Appointments within the date range</returns>
        [HttpGet("daterange")]
        public async Task<ActionResult<IEnumerable<AppointmentVM>>> GetAppointmentsByDateRange([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            try
            {
                var appointments = await _appointmentService.GetAppointmentsByDateRangeAsync(startDate, endDate);
                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving appointments by date range", error = ex.Message });
            }
        }

        /// <summary>
        /// Get appointments by status
        /// </summary>
        /// <param name="status">Appointment status</param>
        /// <returns>Appointments with the specified status</returns>
        [HttpGet("status/{status}")]
        public async Task<ActionResult<IEnumerable<AppointmentVM>>> GetAppointmentsByStatus(string status)
        {
            try
            {
                var appointments = await _appointmentService.GetAppointmentsByStatusAsync(status);
                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving appointments by status", error = ex.Message });
            }
        }

        /// <summary>
        /// Get upcoming appointments
        /// </summary>
        /// <returns>Upcoming appointments</returns>
        [HttpGet("upcoming")]
        public async Task<ActionResult<IEnumerable<AppointmentVM>>> GetUpcomingAppointments()
        {
            try
            {
                var appointments = await _appointmentService.GetUpcomingAppointmentsAsync();
                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving upcoming appointments", error = ex.Message });
            }
        }

        /// <summary>
        /// Get today's appointments
        /// </summary>
        /// <returns>Today's appointments</returns>
        [HttpGet("today")]
        public async Task<ActionResult<IEnumerable<AppointmentVM>>> GetTodaysAppointments()
        {
            try
            {
                var appointments = await _appointmentService.GetTodaysAppointmentsAsync();
                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving today's appointments", error = ex.Message });
            }
        }

        /// <summary>
        /// Search appointments
        /// </summary>
        /// <param name="searchTerm">Search term</param>
        /// <returns>Matching appointments</returns>
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<AppointmentVM>>> SearchAppointments([FromQuery] string searchTerm)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(searchTerm))
                {
                    return BadRequest(new { message = "Search term cannot be empty" });
                }

                var appointments = await _appointmentService.SearchAppointmentsAsync(searchTerm);
                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while searching appointments", error = ex.Message });
            }
        }

        /// <summary>
        /// Get appointments by visit type
        /// </summary>
        /// <param name="visitType">Visit type</param>
        /// <returns>Appointments with the specified visit type</returns>
        [HttpGet("visittype/{visitType}")]
        public async Task<ActionResult<IEnumerable<AppointmentVM>>> GetAppointmentsByVisitType(string visitType)
        {
            try
            {
                var appointments = await _appointmentService.GetAppointmentsByVisitTypeAsync(visitType);
                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving appointments by visit type", error = ex.Message });
            }
        }

        /// <summary>
        /// Update appointment status
        /// </summary>
        /// <param name="id">Appointment ID</param>
        /// <param name="status">New status</param>
        /// <returns>Success status</returns>
        [HttpPut("{id}/status")]
        public async Task<ActionResult> UpdateAppointmentStatus(int id, [FromBody] string status)
        {
            try
            {
                var exists = await _appointmentService.AppointmentExistsAsync(id);
                if (!exists)
                {
                    return NotFound(new { message = $"Appointment with ID {id} not found" });
                }

                var updated = await _appointmentService.UpdateAppointmentStatusAsync(id, status);
                if (!updated)
                {
                    return StatusCode(500, new { message = "Failed to update appointment status" });
                }

                return Ok(new { message = "Appointment status updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating appointment status", error = ex.Message });
            }
        }

        /// <summary>
        /// Cancel an appointment
        /// </summary>
        /// <param name="id">Appointment ID</param>
        /// <returns>Success status</returns>
        [HttpPut("{id}/cancel")]
        public async Task<ActionResult> CancelAppointment(int id)
        {
            try
            {
                var exists = await _appointmentService.AppointmentExistsAsync(id);
                if (!exists)
                {
                    return NotFound(new { message = $"Appointment with ID {id} not found" });
                }

                var cancelled = await _appointmentService.CancelAppointmentAsync(id);
                if (!cancelled)
                {
                    return StatusCode(500, new { message = "Failed to cancel appointment" });
                }

                return Ok(new { message = "Appointment cancelled successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while cancelling the appointment", error = ex.Message });
            }
        }

        /// <summary>
        /// Complete an appointment
        /// </summary>
        /// <param name="id">Appointment ID</param>
        /// <returns>Success status</returns>
        [HttpPut("{id}/complete")]
        public async Task<ActionResult> CompleteAppointment(int id)
        {
            try
            {
                var exists = await _appointmentService.AppointmentExistsAsync(id);
                if (!exists)
                {
                    return NotFound(new { message = $"Appointment with ID {id} not found" });
                }

                var completed = await _appointmentService.CompleteAppointmentAsync(id);
                if (!completed)
                {
                    return StatusCode(500, new { message = "Failed to complete appointment" });
                }

                return Ok(new { message = "Appointment completed successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while completing the appointment", error = ex.Message });
            }
        }

        /// <summary>
        /// Check if doctor is available
        /// </summary>
        /// <param name="doctorId">Doctor ID</param>
        /// <param name="appointmentDate">Appointment date</param>
        /// <returns>Availability status</returns>
        [HttpGet("availability/doctor/{doctorId}")]
        public async Task<ActionResult> CheckDoctorAvailability(int doctorId, [FromQuery] DateTime appointmentDate)
        {
            try
            {
                var isAvailable = await _appointmentService.IsDoctorAvailableAsync(doctorId, appointmentDate);
                return Ok(new { isAvailable, doctorId, appointmentDate });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while checking doctor availability", error = ex.Message });
            }
        }

        /// <summary>
        /// Get available time slots for a doctor on a specific date
        /// </summary>
        /// <param name="doctorId">Doctor ID</param>
        /// <param name="date">Date</param>
        /// <returns>Available time slots</returns>
        [HttpGet("availability/timeslots/{doctorId}")]
        public async Task<ActionResult<IEnumerable<DateTime>>> GetAvailableTimeSlots(int doctorId, [FromQuery] DateTime date)
        {
            try
            {
                var timeSlots = await _appointmentService.GetAvailableTimeSlotsAsync(doctorId, date);
                return Ok(timeSlots);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving available time slots", error = ex.Message });
            }
        }
    }
}
