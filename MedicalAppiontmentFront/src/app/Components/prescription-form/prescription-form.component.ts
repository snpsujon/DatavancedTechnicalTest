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
    
    console.log('Form initialized:', this.prescriptionForm);
    console.log('Initial prescription details array:', this.prescriptionDetailsArray);
    
    // Ensure form array is properly initialized
    if (!this.prescriptionDetailsArray) {
      console.error('Form array is not properly initialized!');
      return;
    }
    
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
      appointmentId: [''],
      generalNotes: [''],
      followUpInstructions: [''],
      prescriptionDetails: this.fb.array([])
    });
  }

  get prescriptionDetailsArray(): FormArray {
    return this.prescriptionForm.get('prescriptionDetails') as FormArray;
  }

  createPrescriptionDetailForm(): FormGroup {
    return this.fb.group({
      medicineId: [''],
      dosage: [''],
      startDate: [''],
      endDate: [''],
      notes: ['']
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
      console.log('Loading prescription data for ID:', this.prescriptionId);
      this.isLoading = true;
      
      // Add timeout to prevent infinite loading
      const timeout = setTimeout(() => {
        if (this.isLoading) {
          console.warn('Prescription data loading timeout, forcing completion');
          this.isLoading = false;
          this.populateForm({ prescriptionDetails: [] });
        }
      }, 10000); // 10 second timeout
      
      // Load prescription and prescription details in parallel
      this.prescriptionService.getPrescriptionById(this.prescriptionId).subscribe({
        next: (response: any) => {
          clearTimeout(timeout);
          console.log('Prescription API response:', response);
          
          // Handle different response structures
          let prescriptionData = response;
          if (response && response.data) {
            prescriptionData = response.data;
          }
          
          if (prescriptionData) {
            console.log('Prescription data to populate:', prescriptionData);
            
            // Load prescription details separately if not included
            if (!prescriptionData.prescriptionDetails || prescriptionData.prescriptionDetails.length === 0) {
              console.log('No prescription details in main response, loading separately...');
              this.loadPrescriptionDetails(this.prescriptionId!, prescriptionData);
            } else {
              console.log('Prescription details found:', prescriptionData.prescriptionDetails);
              this.isLoading = false;
              this.populateForm(prescriptionData);
            }
          } else {
            console.error('No prescription data found in response');
            this.isLoading = false;
            Swal.fire('Error', 'No prescription data found', 'error');
          }
        },
        error: (error) => {
          clearTimeout(timeout);
          this.isLoading = false;
          console.error('Error loading prescription data:', error);
          Swal.fire('Error', 'Failed to load prescription data', 'error');
        }
      });
    }
  }

  loadPrescriptionDetails(prescriptionId: number, prescriptionData: any): void {
    console.log('Loading prescription details for prescription ID:', prescriptionId);
    this.prescriptionService.getPrescriptionDetailsByPrescriptionId(prescriptionId).subscribe({
      next: (detailsResponse: any) => {
        console.log('Prescription details API response:', detailsResponse);
        this.isLoading = false;
        
        // Handle different response structures
        let details = detailsResponse;
        if (detailsResponse && detailsResponse.data) {
          details = detailsResponse.data;
        }
        
        if (details && Array.isArray(details)) {
          prescriptionData.prescriptionDetails = details;
          console.log('Prescription details loaded:', details.length, 'items');
          this.populateForm(prescriptionData);
        } else {
          console.log('No prescription details found, using empty array');
          prescriptionData.prescriptionDetails = [];
          this.populateForm(prescriptionData);
        }
      },
      error: (error) => {
        console.error('Error loading prescription details:', error);
        console.log('Prescription details API might not exist, proceeding without details');
        this.isLoading = false;
        // Still populate the form without details
        prescriptionData.prescriptionDetails = [];
        this.populateForm(prescriptionData);
      }
    });
  }

  populateForm(prescription: any): void {
    console.log('Populating form with prescription:', prescription);
    
    // Populate main form fields
    this.prescriptionForm.patchValue({
      appointmentId: prescription.appointmentId,
      generalNotes: prescription.generalNotes,
      followUpInstructions: prescription.followUpInstructions
    });

    console.log('Main form populated. Appointment ID:', prescription.appointmentId);

    // Clear existing prescription details
    while (this.prescriptionDetailsArray.length !== 0) {
      this.prescriptionDetailsArray.removeAt(0);
    }

    // Add prescription details
    if (prescription.prescriptionDetails && prescription.prescriptionDetails.length > 0) {
      console.log('Adding prescription details:', prescription.prescriptionDetails.length, 'items');
      prescription.prescriptionDetails.forEach((detail: any, index: number) => {
        console.log(`Adding detail ${index}:`, detail);
        this.addPrescriptionDetail(detail);
      });
    } else {
      console.log('No prescription details found, adding empty detail');
      // Add at least one empty detail for editing
      this.addPrescriptionDetail();
    }
    
    console.log('Form populated. Form array length:', this.prescriptionDetailsArray.length);
    
    // Force change detection to ensure form controls are properly bound
    setTimeout(() => {
      console.log('Triggering change detection after form population');
      this.prescriptionForm.updateValueAndValidity();
    }, 0);
  }

  addPrescriptionDetail(existingDetail?: any): void {
    console.log('Adding prescription detail:', existingDetail);
    
    // Ensure form array exists
    if (!this.prescriptionDetailsArray) {
      console.error('Form array is not initialized!');
      return;
    }
    
    const detailForm = this.createPrescriptionDetailForm();
    
    if (existingDetail) {
      console.log('Patching existing detail values:', {
        medicineId: existingDetail.medicineId,
        dosage: existingDetail.dosage,
        startDate: existingDetail.startDate,
        endDate: existingDetail.endDate,
        notes: existingDetail.notes
      });
      
      detailForm.patchValue({
        medicineId: existingDetail.medicineId,
        dosage: existingDetail.dosage,
        startDate: existingDetail.startDate ? new Date(existingDetail.startDate).toISOString().split('T')[0] : '',
        endDate: existingDetail.endDate ? new Date(existingDetail.endDate).toISOString().split('T')[0] : '',
        notes: existingDetail.notes
      });
      
      console.log('Detail form patched with values:', detailForm.value);
    }

    this.prescriptionDetailsArray.push(detailForm);
    console.log('Detail added to form array. New length:', this.prescriptionDetailsArray.length);
    
    // Force form array update
    this.prescriptionDetailsArray.updateValueAndValidity();
  }

  removePrescriptionDetail(index: number): void {
    this.prescriptionDetailsArray.removeAt(index);
  }


  trackByIndex(index: number, item: any): number {
    return index;
  }

  isFormArrayReady(): boolean {
    return this.prescriptionDetailsArray && this.prescriptionDetailsArray.length > 0;
  }


  onSubmit(): void {
    console.log('Form submitted!');
    console.log('Is submitting:', this.isSubmitting);
    console.log('Is edit mode:', this.isEditMode);
    console.log('Prescription ID:', this.prescriptionId);
    
    if (!this.isSubmitting) {
      this.isSubmitting = true;
      
      // Force update all form controls before getting values
      this.syncFormValues();
      
      const formData = this.prescriptionForm.value;
      console.log('Form data:', formData);
      
      // Check if any medicine details have been filled
      const hasValidMedicineDetails = formData.prescriptionDetails.some((detail: any) => 
        detail.medicineId && detail.medicineId !== '' && 
        detail.dosage && detail.dosage !== '' &&
        detail.startDate && detail.startDate !== '' &&
        detail.endDate && detail.endDate !== ''
      );
      
      if (!hasValidMedicineDetails) {
        this.isSubmitting = false;
        Swal.fire('Error', 'Please fill in at least one complete medicine detail (medicine, dosage, start date, and end date)', 'error');
        return;
      }
      
      // Filter out empty medicine details
      const validPrescriptionDetails = formData.prescriptionDetails.filter((detail: any) => 
        detail.medicineId && detail.medicineId !== '' && 
        detail.dosage && detail.dosage !== '' &&
        detail.startDate && detail.startDate !== '' &&
        detail.endDate && detail.endDate !== ''
      );
      
      // Convert prescription details
      const prescriptionDetails = validPrescriptionDetails.map((detail: any) => ({
        id: 0, // New prescription detail ID
        medicineId: detail.medicineId,
        dosage: detail.dosage,
        startDate: new Date(detail.startDate).toISOString(),
        endDate: new Date(detail.endDate).toISOString(),
        notes: detail.notes || ''
      }));
      
      console.log('Valid prescription details:', prescriptionDetails);

      if (this.isEditMode && this.prescriptionId) {
        console.log('Updating prescription...');
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
        console.log('Update data:', updateData);
        this.updatePrescription(updateData);
      } else {
        console.log('Creating prescription...');
        const createData: PrescriptionCreate = {
          appointmentId: formData.appointmentId,
          generalNotes: formData.generalNotes,
          followUpInstructions: formData.followUpInstructions,
          prescriptionDetails: prescriptionDetails
        };
        console.log('Create data:', createData);
        this.createPrescription(createData);
      }
    } else {
      console.log('Already submitting, ignoring...');
    }
  }

  createPrescription(prescriptionData: PrescriptionCreate): void {
    console.log('Calling createPrescription API with data:', prescriptionData);
    console.log('Prescription details being sent:', prescriptionData.prescriptionDetails);
    
    // Log each prescription detail individually
    prescriptionData.prescriptionDetails.forEach((detail, index) => {
      console.log(`Prescription detail ${index}:`, detail);
    });
    
    this.prescriptionService.createPrescription(prescriptionData).subscribe({
      next: (response: any) => {
        console.log('Create prescription API response:', response);
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
        console.error('Error creating prescription:', error);
        console.error('Error details:', error.error);
        this.isSubmitting = false;
        const errorMessage = error.error?.message || 'Failed to create prescription';
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  updatePrescription(prescriptionData: PrescriptionUpdate): void {
    console.log('Calling updatePrescription API with data:', prescriptionData);
    this.prescriptionService.updatePrescription(this.prescriptionId!, prescriptionData).subscribe({
      next: (response: any) => {
        console.log('Update prescription API response:', response);
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
        console.error('Error updating prescription:', error);
        this.isSubmitting = false;
        const errorMessage = error.error?.message || 'Failed to update prescription';
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/prescriptions']);
  }

  testFormSubmission(): void {
    console.log('Test form submission clicked!');
    console.log('Form valid:', this.prescriptionForm.valid);
    console.log('Form value:', this.prescriptionForm.value);
    console.log('Prescription details array length:', this.prescriptionDetailsArray.length);
    console.log('Is submitting:', this.isSubmitting);
    
    // Test the form submission
    this.onSubmit();
  }

  onMedicineSelectionChange(event: any, index: number): void {
    debugger;
    const selectedMedicineId = event.target.value;
    console.log(`Medicine selection changed for index ${index}:`, selectedMedicineId);
    console.log('Available medicines:', this.medicines);
    console.log('Selected medicine:', this.medicines.find(m => m.id == selectedMedicineId));
    
    // Update the form control value
    const control = this.prescriptionDetailsArray.at(index)?.get('medicineId');
    if (control) {
      control.setValue(selectedMedicineId);
      console.log('Updated control value:', control.value);
    }
  }

  onFieldChange(fieldName: string, index: number, event: any): void {
    const value = event.target.value;
    console.log(`Field ${fieldName} changed for index ${index}:`, value);
    
    // Update the form control value
    const control = this.prescriptionDetailsArray.at(index)?.get(fieldName);
    if (control) {
      control.setValue(value);
      console.log(`Updated ${fieldName} control value:`, control.value);
      
      // Also update the form array to trigger change detection
      this.prescriptionDetailsArray.updateValueAndValidity();
    }
  }

  syncFormValues(): void {
    console.log('Syncing form values...');
    
    // Force update all prescription detail controls
    this.prescriptionDetailsArray.controls.forEach((control, index) => {
      console.log(`Syncing control at index ${index}:`, control.value);
      
      // Mark all controls as touched to ensure they're updated
      Object.keys(control.value).forEach(key => {
        const fieldControl = control.get(key);
        if (fieldControl) {
          fieldControl.markAsTouched();
          fieldControl.updateValueAndValidity();
        }
      });
    });
    
    // Update the entire form
    this.prescriptionForm.updateValueAndValidity();
    console.log('Form values synced. Current form value:', this.prescriptionForm.value);
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

