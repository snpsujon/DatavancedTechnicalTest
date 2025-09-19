import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PatientService, Patient } from 'src/app/Services/patient.service';
import { CommonService } from 'src/app/Services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-patient-form',
  standalone: false,
  templateUrl: './patient-form.component.html',
  styleUrl: './patient-form.component.scss'
})
export class PatientFormComponent implements OnInit {
  patientForm: FormGroup;
  isEditMode: boolean = false;
  patientId: number | null = null;
  isSubmitting: boolean = false;
  
  genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' }
  ];

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) {
    this.patientForm = this.createForm();
  }

  ngOnInit(): void {
    this.commonService.formHeaderName = this.isEditMode ? 'Edit Patient' : 'Add Patient';
    
    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.patientId = +params['id'];
        this.loadPatientData();
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.email, Validators.maxLength(200)]],
      phoneNumber: ['', [Validators.maxLength(20)]],
      address: ['', [Validators.maxLength(500)]],
      dateOfBirth: [''],
      gender: [''],
      medicalHistory: ['', [Validators.maxLength(500)]],
      allergies: ['', [Validators.maxLength(500)]],
      emergencyContactName: ['', [Validators.maxLength(500)]],
      emergencyContactPhone: ['', [Validators.maxLength(20)]],
      isActive: [true]
    });
  }

  loadPatientData(): void {
    if (this.patientId) {
      this.patientService.getPatientById(this.patientId).subscribe({
        next: (response: any) => {
          if (response) {
            this.populateForm(response);
          }
        },
        error: (error) => {
          console.error('Error loading patient data:', error);
          Swal.fire('Error', 'Failed to load patient data', 'error');
        }
      });
    }
  }

  populateForm(patient: any): void {
    this.patientForm.patchValue({
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      phoneNumber: patient.phoneNumber,
      address: patient.address,
      dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : '',
      gender: patient.gender,
      medicalHistory: patient.medicalHistory,
      allergies: patient.allergies,
      emergencyContactName: patient.emergencyContactName,
      emergencyContactPhone: patient.emergencyContactPhone,
      isActive: patient.isActive
    });
  }

  onSubmit(): void {
    if (this.patientForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const formData = this.patientForm.value;
      
      if (this.isEditMode && this.patientId) {
        formData.id = this.patientId;
        this.updatePatient(formData);
      } else {
        this.createPatient(formData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  createPatient(patientData: Patient): void {
    this.patientService.createPatient(patientData).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        Swal.fire({
          title: 'Success!',
          text: 'Patient created successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/patientList']);
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error creating patient:', error);
        Swal.fire('Error', 'Failed to create patient', 'error');
      }
    });
  }

  updatePatient(patientData: Patient): void {
    this.patientService.updatePatient(this.patientId!, patientData).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        Swal.fire({
          title: 'Success!',
          text: 'Patient updated successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/patientList']);
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error updating patient:', error);
        Swal.fire('Error', 'Failed to update patient', 'error');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/patientList']);
  }

  markFormGroupTouched(): void {
    Object.keys(this.patientForm.controls).forEach(key => {
      const control = this.patientForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.patientForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (control.errors['maxlength']) {
        return `${this.getFieldLabel(fieldName)} must not exceed ${control.errors['maxlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phoneNumber: 'Phone Number',
      address: 'Address',
      dateOfBirth: 'Date of Birth',
      gender: 'Gender',
      medicalHistory: 'Medical History',
      allergies: 'Allergies',
      emergencyContactName: 'Emergency Contact Name',
      emergencyContactPhone: 'Emergency Contact Phone'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.patientForm.get(fieldName);
    return !!(control?.invalid && control.touched);
  }
}
