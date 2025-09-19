import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppointmentService, AppointmentCreate, AppointmentUpdate, Appointment } from 'src/app/Services/appointment.service';
import { PatientService } from 'src/app/Services/patient.service';
import { DoctorService } from 'src/app/Services/doctor.service';
import { CommonService } from 'src/app/Services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-appointment-form',
  standalone: false,
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.scss'
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm: FormGroup;
  isEditMode: boolean = false;
  appointmentId: number | null = null;
  isSubmitting: boolean = false;
  isLoading: boolean = false;
  
  // Data for dropdowns
  patients: any[] = [];
  doctors: any[] = [];
  availableTimeSlots: string[] = [];
  
  visitTypeOptions = [
    { value: 'First Visit', label: 'First Visit' },
    { value: 'Follow-up', label: 'Follow-up' },
    { value: 'Consultation', label: 'Consultation' },
    { value: 'Emergency', label: 'Emergency' },
    { value: 'Check-up', label: 'Check-up' },
    { value: 'Vaccination', label: 'Vaccination' }
  ];

  statusOptions = [
    { value: 'Scheduled', label: 'Scheduled' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Cancelled', label: 'Cancelled' },
    { value: 'No-Show', label: 'No-Show' },
    { value: 'In Progress', label: 'In Progress' }
  ];

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) {
    this.appointmentForm = this.createForm();
  }

  ngOnInit(): void {
    this.commonService.formHeaderName = this.isEditMode ? 'Edit Appointment' : 'Add Appointment';
    
    // Check API status first
    this.checkApiStatus();
    
    // Load initial data
    this.loadPatients();
    this.loadDoctors();
    
    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.appointmentId = +params['id'];
        this.loadAppointmentData();
      }
    });

    // Watch for doctor and date changes to load available time slots
    this.appointmentForm.get('doctorId')?.valueChanges.subscribe(() => {
      this.loadAvailableTimeSlots();
    });

    this.appointmentForm.get('appointmentDate')?.valueChanges.subscribe(() => {
      this.loadAvailableTimeSlots();
    });
  }

  checkApiStatus(): void {
    // Test if the API is accessible
    this.appointmentService.getAllAppointments(1, 1).subscribe({
      next: (response) => {
        console.log('API is accessible:', response);
      },
      error: (error) => {
        console.error('API accessibility check failed:', error);
        Swal.fire({
          title: 'API Connection Issue',
          text: 'Cannot connect to the backend API. Please ensure the server is running on https://localhost:7203',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      patientId: ['', [Validators.required]],
      doctorId: ['', [Validators.required]],
      appointmentDate: ['', [Validators.required]],
      appointmentTime: ['', [Validators.required]],
      visitType: ['', [Validators.required, Validators.maxLength(50)]],
      notes: ['', [Validators.maxLength(1000)]],
      diagnosis: ['', [Validators.maxLength(2000)]],
      status: ['Scheduled']
    });
  }

  loadPatients(): void {
    this.patientService.getAllPatients(1000, 0).subscribe({
      next: (response: any) => {
        this.patients = response.data || response || [];
      },
      error: (error) => {
        console.error('Error loading patients:', error);
      }
    });
  }

  loadDoctors(): void {
    this.doctorService.getAllDoctors(1000, 0).subscribe({
      next: (response: any) => {
        this.doctors = response.data || response || [];
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
      }
    });
  }

  loadAppointmentData(): void {
    if (this.appointmentId) {
      this.isLoading = true;
      this.appointmentService.getAppointmentById(this.appointmentId).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response) {
            this.populateForm(response);
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error loading appointment data:', error);
          Swal.fire('Error', 'Failed to load appointment data', 'error');
        }
      });
    }
  }

  populateForm(appointment: any): void {
    const appointmentDate = new Date(appointment.appointmentDate);
    const dateString = appointmentDate.toISOString().split('T')[0];
    const timeString = appointmentDate.toTimeString().substring(0, 5);

    this.appointmentForm.patchValue({
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      appointmentDate: dateString,
      appointmentTime: timeString,
      visitType: appointment.visitType,
      notes: appointment.notes,
      diagnosis: appointment.diagnosis,
      status: appointment.status
    });
  }

  loadAvailableTimeSlots(): void {
    const doctorId = this.appointmentForm.get('doctorId')?.value;
    const appointmentDate = this.appointmentForm.get('appointmentDate')?.value;

    if (doctorId && appointmentDate) {
      this.appointmentService.getAvailableTimeSlots(doctorId, appointmentDate).subscribe({
        next: (timeSlots: string[]) => {
          this.availableTimeSlots = timeSlots.map(slot => 
            new Date(slot).toTimeString().substring(0, 5)
          );
        },
        error: (error) => {
          console.error('Error loading time slots:', error);
          this.availableTimeSlots = [];
        }
      });
    } else {
      this.availableTimeSlots = [];
    }
  }

  onSubmit(): void {
    if (this.appointmentForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const formData = this.appointmentForm.value;
      
      // Combine date and time
      const appointmentDateTime = new Date(formData.appointmentDate + 'T' + formData.appointmentTime);
      
      if (this.isEditMode && this.appointmentId) {
        // Validate the data before sending
        if (!formData.patientId || !formData.doctorId || !formData.visitType || !formData.status) {
          Swal.fire('Error', 'Please fill in all required fields', 'error');
          return;
        }

        // Validate appointment date is not in the past
        if (appointmentDateTime < new Date()) {
          Swal.fire('Error', 'Appointment date cannot be in the past', 'error');
          return;
        }

        const updateData: AppointmentUpdate = {
          id: this.appointmentId,
          patientId: Number(formData.patientId),
          doctorId: Number(formData.doctorId),
          appointmentDate: appointmentDateTime.toISOString(),
          visitType: formData.visitType,
          notes: formData.notes || '',
          diagnosis: formData.diagnosis || '',
          status: formData.status
        };
        
        // Additional validation
        if (isNaN(updateData.patientId) || isNaN(updateData.doctorId)) {
          Swal.fire('Error', 'Invalid patient or doctor selection', 'error');
          return;
        }

        this.updateAppointment(updateData);
      } else {
        const createData: AppointmentCreate = {
          patientId: formData.patientId,
          doctorId: formData.doctorId,
          appointmentDate: appointmentDateTime.toISOString(),
          visitType: formData.visitType,
          notes: formData.notes,
          diagnosis: formData.diagnosis
        };
        this.createAppointment(createData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  createAppointment(appointmentData: AppointmentCreate): void {
    this.appointmentService.createAppointment(appointmentData).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        Swal.fire({
          title: 'Success!',
          text: 'Appointment created successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/appointments']);
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error creating appointment:', error);
        const errorMessage = error.error?.message || 'Failed to create appointment';
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  updateAppointment(appointmentData: AppointmentUpdate): void {
    // Log the data being sent for debugging
    console.log('Updating appointment with data:', {
      appointmentId: this.appointmentId,
      appointmentData: appointmentData,
      url: `https://localhost:7203/api/Appointment/${this.appointmentId}`
    });

    // Test API connectivity first
    this.testApiConnection().then(() => {
      this.performUpdate(appointmentData);
    }).catch((error) => {
      this.isSubmitting = false;
      console.error('API connection test failed:', error);
      Swal.fire('Error', 'Cannot connect to the server. Please check if the backend is running.', 'error');
    });
  }

  private testApiConnection(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.appointmentService.getAppointmentById(this.appointmentId!).subscribe({
        next: (response) => {
          console.log('API connection test successful');
          resolve(response);
        },
        error: (error) => {
          console.error('API connection test failed:', error);
          reject(error);
        }
      });
    });
  }

  private performUpdate(appointmentData: AppointmentUpdate): void {
    this.appointmentService.updateAppointment(this.appointmentId!, appointmentData).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        console.log('Appointment update successful:', response);
        Swal.fire({
          title: 'Success!',
          text: 'Appointment updated successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/appointments']);
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error updating appointment:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          error: error.error,
          message: error.message
        });
        
        // More detailed error message
        let errorMessage = 'Failed to update appointment';
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.error?.errors) {
          // Handle validation errors
          const validationErrors = Object.values(error.error.errors).flat();
          errorMessage = validationErrors.join(', ');
        } else if (error.status === 500) {
          errorMessage = 'Internal server error. Please check the server logs for more details.';
        } else if (error.status === 400) {
          errorMessage = 'Bad request. Please check the data being sent.';
        } else if (error.status === 404) {
          errorMessage = 'Appointment not found.';
        }
        
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/appointments']);
  }

  markFormGroupTouched(): void {
    Object.keys(this.appointmentForm.controls).forEach(key => {
      const control = this.appointmentForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.appointmentForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (control.errors['maxlength']) {
        return `${this.getFieldLabel(fieldName)} must not exceed ${control.errors['maxlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      patientId: 'Patient',
      doctorId: 'Doctor',
      appointmentDate: 'Appointment Date',
      appointmentTime: 'Appointment Time',
      visitType: 'Visit Type',
      notes: 'Notes',
      diagnosis: 'Diagnosis',
      status: 'Status'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.appointmentForm.get(fieldName);
    return !!(control?.invalid && control.touched);
  }

  getPatientName(patientId: number): string {
    const patient = this.patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : '';
  }

  getDoctorName(doctorId: number): string {
    const doctor = this.doctors.find(d => d.id === doctorId);
    return doctor ? `Dr. ${doctor.firstName} ${doctor.lastName} - ${doctor.specialization}` : '';
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}
