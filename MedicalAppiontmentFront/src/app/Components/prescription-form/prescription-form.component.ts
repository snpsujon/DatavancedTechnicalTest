import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PrescriptionService, PrescriptionCreate, PrescriptionUpdate, Prescription, PrescriptionDetailCreate, PrescriptionDetailUpdate } from 'src/app/Services/prescription.service';
import { AppointmentService } from 'src/app/Services/appointment.service';
import { MedicineService } from 'src/app/Services/medicine.service';
import { CommonService } from 'src/app/Services/common.service';
import { PrescriptionReportService } from 'src/app/Services/prescription-report.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-prescription-form',
  standalone: false,
  templateUrl: './prescription-form.component.html',
  styleUrl: './prescription-form.component.scss'
})
export class PrescriptionFormComponent implements OnInit {
  prescriptionForm: FormGroup;
  isEditMode: boolean = false;
  prescriptionId: number | null = null;
  isSubmitting: boolean = false;
  isLoading: boolean = false;
  
  // Data for dropdowns
  appointments: any[] = [];
  medicines: any[] = [];
  
  // Loading states
  loadingAppointments: boolean = false;
  loadingMedicines: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private prescriptionService: PrescriptionService,
    private appointmentService: AppointmentService,
    private medicineService: MedicineService,
    private prescriptionReportService: PrescriptionReportService,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) {
    this.prescriptionForm = this.createForm();
  }

  ngOnInit(): void {
    this.commonService.formHeaderName = this.isEditMode ? 'Edit Prescription' : 'Add Prescription';
    
    // Load initial data
    this.loadAppointments();
    this.loadMedicines();
    
    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.prescriptionId = +params['id'];
        this.loadPrescriptionData();
      }
    });

    // Watch for appointment changes to load appointment details
    this.prescriptionForm.get('appointmentId')?.valueChanges.subscribe(appointmentId => {
      if (appointmentId) {
        this.loadAppointmentDetails(appointmentId);
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      appointmentId: ['', [Validators.required]],
      generalNotes: ['', [Validators.maxLength(1000)]],
      followUpInstructions: ['', [Validators.maxLength(1000)]],
      prescriptionDetails: this.fb.array([])
    });
  }

  get prescriptionDetailsArray(): FormArray {
    return this.prescriptionForm.get('prescriptionDetails') as FormArray;
  }

  createPrescriptionDetailForm(): FormGroup {
    return this.fb.group({
      medicineId: ['', [Validators.required]],
      dosage: ['', [Validators.required, Validators.maxLength(200)]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      notes: ['', [Validators.maxLength(1000)]]
    });
  }

  loadAppointments(): void {
    console.log('Loading appointments...');
    this.loadingAppointments = true;
    // Fixed: Use proper pagination values (skip, take) - take must be > 0
    this.appointmentService.getAllAppointments(0, 1000).subscribe({
      next: (response: any) => {
        console.log('Appointments response:', response);
        this.appointments = response.data || response || [];
        console.log('Appointments loaded:', this.appointments.length, 'items');
        this.loadingAppointments = false;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.loadingAppointments = false;
        Swal.fire({
          title: 'Error',
          text: 'Failed to load appointments. Please refresh the page.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  loadMedicines(): void {
    console.log('Loading medicines...');
    this.loadingMedicines = true;
    // Fixed: Use proper pagination values (skip, take) - take must be > 0
    this.medicineService.getActiveMedicines(0, 1000).subscribe({
      next: (response: any) => {
        console.log('Medicines response:', response);
        this.medicines = response.data || response || [];
        console.log('Medicines loaded:', this.medicines.length, 'items');
        this.loadingMedicines = false;
      },
      error: (error) => {
        console.error('Error loading active medicines, trying all medicines:', error);
        // Fallback to getAllMedicines if getActiveMedicines fails
        this.loadAllMedicines();
      }
    });
  }

  loadAllMedicines(): void {
    console.log('Loading all medicines as fallback...');
    // Fixed: Use proper pagination values (skip, take) - take must be > 0
    this.medicineService.getAllMedicines(0, 1000).subscribe({
      next: (response: any) => {
        console.log('All medicines response:', response);
        // Filter only active medicines
        const allMedicines = response.data || response || [];
        this.medicines = allMedicines.filter((medicine: any) => medicine.isActive === true);
        console.log('Medicines loaded (filtered):', this.medicines.length, 'items');
        this.loadingMedicines = false;
      },
      error: (error) => {
        console.error('Error loading all medicines:', error);
        this.loadingMedicines = false;
        Swal.fire({
          title: 'Error',
          text: 'Failed to load medicines. Please refresh the page.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  loadAppointmentDetails(appointmentId: number): void {
    this.appointmentService.getAppointmentById(appointmentId).subscribe({
      next: (response: any) => {
        if (response) {
          // You can display appointment details if needed
          console.log('Appointment details:', response);
        }
      },
      error: (error) => {
        console.error('Error loading appointment details:', error);
      }
    });
  }

  loadPrescriptionData(): void {
    if (this.prescriptionId) {
      this.isLoading = true;
      this.prescriptionService.getPrescriptionById(this.prescriptionId).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response) {
            this.populateForm(response);
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error loading prescription data:', error);
          Swal.fire('Error', 'Failed to load prescription data', 'error');
        }
      });
    }
  }

  populateForm(prescription: any): void {
    this.prescriptionForm.patchValue({
      appointmentId: prescription.appointmentId,
      generalNotes: prescription.generalNotes,
      followUpInstructions: prescription.followUpInstructions
    });

    // Clear existing prescription details
    while (this.prescriptionDetailsArray.length !== 0) {
      this.prescriptionDetailsArray.removeAt(0);
    }

    // Add prescription details
    if (prescription.prescriptionDetails && prescription.prescriptionDetails.length > 0) {
      prescription.prescriptionDetails.forEach((detail: any) => {
        this.addPrescriptionDetail(detail);
      });
    }
  }

  addPrescriptionDetail(existingDetail?: any): void {
    const detailForm = this.createPrescriptionDetailForm();
    
    if (existingDetail) {
      detailForm.patchValue({
        medicineId: existingDetail.medicineId,
        dosage: existingDetail.dosage,
        startDate: existingDetail.startDate ? new Date(existingDetail.startDate).toISOString().split('T')[0] : '',
        endDate: existingDetail.endDate ? new Date(existingDetail.endDate).toISOString().split('T')[0] : '',
        notes: existingDetail.notes
      });
    }

    this.prescriptionDetailsArray.push(detailForm);
  }

  removePrescriptionDetail(index: number): void {
    this.prescriptionDetailsArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.prescriptionForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const formData = this.prescriptionForm.value;
      
      // Convert prescription details
      const prescriptionDetails = formData.prescriptionDetails.map((detail: any) => ({
        medicineId: detail.medicineId,
        dosage: detail.dosage,
        startDate: new Date(detail.startDate).toISOString(),
        endDate: new Date(detail.endDate).toISOString(),
        notes: detail.notes
      }));

      if (this.isEditMode && this.prescriptionId) {
        const updateData: PrescriptionUpdate = {
          id: this.prescriptionId,
          appointmentId: formData.appointmentId,
          generalNotes: formData.generalNotes,
          followUpInstructions: formData.followUpInstructions,
          prescriptionDetails: prescriptionDetails.map((detail: any) => ({
            id: 0, // New items will have id 0
            prescriptionId: this.prescriptionId!,
            medicineId: detail.medicineId,
            dosage: detail.dosage,
            startDate: detail.startDate,
            endDate: detail.endDate,
            notes: detail.notes,
            isDeleted: false
          }))
        };
        this.updatePrescription(updateData);
      } else {
        const createData: PrescriptionCreate = {
          appointmentId: formData.appointmentId,
          generalNotes: formData.generalNotes,
          followUpInstructions: formData.followUpInstructions,
          prescriptionDetails: prescriptionDetails
        };
        this.createPrescription(createData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  createPrescription(prescriptionData: PrescriptionCreate): void {
    this.prescriptionService.createPrescription(prescriptionData).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        Swal.fire({
          title: 'Success!',
          text: 'Prescription created successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/prescriptions']);
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error creating prescription:', error);
        const errorMessage = error.error?.message || 'Failed to create prescription';
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  updatePrescription(prescriptionData: PrescriptionUpdate): void {
    this.prescriptionService.updatePrescription(this.prescriptionId!, prescriptionData).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        Swal.fire({
          title: 'Success!',
          text: 'Prescription updated successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/prescriptions']);
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error updating prescription:', error);
        const errorMessage = error.error?.message || 'Failed to update prescription';
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/prescriptions']);
  }

  markFormGroupTouched(): void {
    Object.keys(this.prescriptionForm.controls).forEach(key => {
      const control = this.prescriptionForm.get(key);
      control?.markAsTouched();
      
      if (key === 'prescriptionDetails') {
        const prescriptionDetailsArray = control as FormArray;
        prescriptionDetailsArray.controls.forEach(detailControl => {
          Object.keys(detailControl.value).forEach(detailKey => {
            detailControl.get(detailKey)?.markAsTouched();
          });
        });
      }
    });
  }

  getErrorMessage(fieldName: string, index?: number): string {
    let control: any;
    
    if (index !== undefined) {
      control = this.prescriptionDetailsArray.at(index)?.get(fieldName);
    } else {
      control = this.prescriptionForm.get(fieldName);
    }
    
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
      appointmentId: 'Appointment',
      generalNotes: 'General Notes',
      followUpInstructions: 'Follow-up Instructions',
      medicineId: 'Medicine',
      dosage: 'Dosage',
      startDate: 'Start Date',
      endDate: 'End Date',
      notes: 'Notes'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string, index?: number): boolean {
    let control: any;
    
    if (index !== undefined) {
      control = this.prescriptionDetailsArray.at(index)?.get(fieldName);
    } else {
      control = this.prescriptionForm.get(fieldName);
    }
    
    return !!(control?.invalid && control.touched);
  }

  getAppointmentDisplayText(appointmentId: number): string {
    const appointment = this.appointments.find(a => a.id === appointmentId);
    if (appointment) {
      return `${appointment.patientName} - ${appointment.doctorName} (${new Date(appointment.appointmentDate).toLocaleDateString()})`;
    }
    return '';
  }

  getMedicineDisplayText(medicineId: number): string {
    const medicine = this.medicines.find(m => m.id === medicineId);
    if (medicine) {
      return `${medicine.name}${medicine.strength ? ` (${medicine.strength})` : ''}`;
    }
    return '';
  }

  validateDateRange(startDate: string, endDate: string): boolean {
    if (startDate && endDate) {
      return new Date(startDate) <= new Date(endDate);
    }
    return true;
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  refreshData(): void {
    console.log('Refreshing prescription form data...');
    this.loadAppointments();
    this.loadMedicines();
  }

  generatePreviewReport(): void {
    if (this.prescriptionForm.invalid) {
      this.markFormGroupTouched();
      Swal.fire('Error', 'Please fill in all required fields before generating the report', 'error');
      return;
    }

    if (this.prescriptionDetailsArray.length === 0) {
      Swal.fire('Error', 'Please add at least one medicine before generating the report', 'error');
      return;
    }

    // Create a mock prescription object for preview
    const formData = this.prescriptionForm.value;
    const selectedAppointment = this.appointments.find(a => a.id === formData.appointmentId);
    
    const previewPrescription: Prescription = {
      id: this.prescriptionId || 0,
      appointmentId: formData.appointmentId,
      generalNotes: formData.generalNotes,
      followUpInstructions: formData.followUpInstructions,
      prescriptionDate: new Date().toISOString(),
      patientName: selectedAppointment?.patientName || 'Preview Patient',
      doctorName: selectedAppointment?.doctorName || 'Preview Doctor',
      appointmentDate: selectedAppointment?.appointmentDate || new Date().toISOString(),
      visitType: selectedAppointment?.visitType || 'Preview',
      prescriptionDetails: formData.prescriptionDetails.map((detail: any) => ({
        id: 0,
        medicineId: detail.medicineId,
        dosage: detail.dosage,
        startDate: detail.startDate,
        endDate: detail.endDate,
        notes: detail.notes,
        medicineName: this.getMedicineDisplayText(detail.medicineId)
      }))
    };

    this.prescriptionReportService.generatePrescriptionReportFromPrescription(previewPrescription);
  }
}

