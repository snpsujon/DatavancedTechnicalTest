import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DoctorService, Doctor } from 'src/app/Services/doctor.service';
import { CommonService } from 'src/app/Services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctor-form',
  standalone: false,
  templateUrl: './doctor-form.component.html',
  styleUrl: './doctor-form.component.scss'
})
export class DoctorFormComponent implements OnInit {
  doctorForm: FormGroup;
  isEditMode: boolean = false;
  doctorId: number | null = null;
  isSubmitting: boolean = false;
  
  genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' }
  ];

  specializationOptions = [
    { value: 'Cardiology', label: 'Cardiology' },
    { value: 'Dermatology', label: 'Dermatology' },
    { value: 'Endocrinology', label: 'Endocrinology' },
    { value: 'Gastroenterology', label: 'Gastroenterology' },
    { value: 'General Medicine', label: 'General Medicine' },
    { value: 'Gynecology', label: 'Gynecology' },
    { value: 'Neurology', label: 'Neurology' },
    { value: 'Oncology', label: 'Oncology' },
    { value: 'Orthopedics', label: 'Orthopedics' },
    { value: 'Pediatrics', label: 'Pediatrics' },
    { value: 'Psychiatry', label: 'Psychiatry' },
    { value: 'Radiology', label: 'Radiology' },
    { value: 'Surgery', label: 'Surgery' },
    { value: 'Urology', label: 'Urology' }
  ];

  departmentOptions = [
    { value: 'Internal Medicine', label: 'Internal Medicine' },
    { value: 'Surgery', label: 'Surgery' },
    { value: 'Pediatrics', label: 'Pediatrics' },
    { value: 'Emergency Medicine', label: 'Emergency Medicine' },
    { value: 'Radiology', label: 'Radiology' },
    { value: 'Pathology', label: 'Pathology' },
    { value: 'Anesthesiology', label: 'Anesthesiology' },
    { value: 'Psychiatry', label: 'Psychiatry' },
    { value: 'Dermatology', label: 'Dermatology' },
    { value: 'Orthopedics', label: 'Orthopedics' }
  ];

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) {
    this.doctorForm = this.createForm();
  }

  ngOnInit(): void {
    this.commonService.formHeaderName = this.isEditMode ? 'Edit Doctor' : 'Add Doctor';
    
    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.doctorId = +params['id'];
        this.loadDoctorData();
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
      specialization: ['', [Validators.required, Validators.maxLength(100)]],
      licenseNumber: ['', [Validators.maxLength(50)]],
      qualification: ['', [Validators.maxLength(100)]],
      yearsOfExperience: [0, [Validators.min(0), Validators.max(50)]],
      bio: ['', [Validators.maxLength(500)]],
      profileImageUrl: ['', [Validators.maxLength(200)]],
      department: ['', [Validators.maxLength(100)]],
      availableFrom: [''],
      availableTo: [''],
      consultationFee: ['', [Validators.maxLength(500)]],
      isActive: [true],
      isAvailable: [true]
    });
  }

  loadDoctorData(): void {
    if (this.doctorId) {
      this.doctorService.getDoctorById(this.doctorId).subscribe({
        next: (response: any) => {
          if (response) {
            this.populateForm(response);
          }
        },
        error: (error) => {
          console.error('Error loading doctor data:', error);
          Swal.fire('Error', 'Failed to load doctor data', 'error');
        }
      });
    }
  }

  populateForm(doctor: any): void {
    this.doctorForm.patchValue({
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      email: doctor.email,
      phoneNumber: doctor.phoneNumber,
      address: doctor.address,
      dateOfBirth: doctor.dateOfBirth ? new Date(doctor.dateOfBirth).toISOString().split('T')[0] : '',
      gender: doctor.gender,
      specialization: doctor.specialization,
      licenseNumber: doctor.licenseNumber,
      qualification: doctor.qualification,
      yearsOfExperience: doctor.yearsOfExperience,
      bio: doctor.bio,
      profileImageUrl: doctor.profileImageUrl,
      department: doctor.department,
      availableFrom: doctor.availableFrom ? doctor.availableFrom.substring(0, 5) : '',
      availableTo: doctor.availableTo ? doctor.availableTo.substring(0, 5) : '',
      consultationFee: doctor.consultationFee,
      isActive: doctor.isActive,
      isAvailable: doctor.isAvailable
    });
  }

  onSubmit(): void {
    if (this.doctorForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const formData = this.doctorForm.value;
      
      // Convert time strings to proper format
      if (formData.availableFrom) {
        formData.availableFrom = formData.availableFrom + ':00';
      }
      if (formData.availableTo) {
        formData.availableTo = formData.availableTo + ':00';
      }
      
      if (this.isEditMode && this.doctorId) {
        formData.id = this.doctorId;
        this.updateDoctor(formData);
      } else {
        this.createDoctor(formData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  createDoctor(doctorData: Doctor): void {
    this.doctorService.createDoctor(doctorData).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        Swal.fire({
          title: 'Success!',
          text: 'Doctor created successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/doctorList']);
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error creating doctor:', error);
        Swal.fire('Error', 'Failed to create doctor', 'error');
      }
    });
  }

  updateDoctor(doctorData: Doctor): void {
    this.doctorService.updateDoctor(this.doctorId!, doctorData).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        Swal.fire({
          title: 'Success!',
          text: 'Doctor updated successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/doctorList']);
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error updating doctor:', error);
        Swal.fire('Error', 'Failed to update doctor', 'error');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/doctorList']);
  }

  markFormGroupTouched(): void {
    Object.keys(this.doctorForm.controls).forEach(key => {
      const control = this.doctorForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.doctorForm.get(fieldName);
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
      if (control.errors['min']) {
        return `${this.getFieldLabel(fieldName)} must be at least ${control.errors['min'].min}`;
      }
      if (control.errors['max']) {
        return `${this.getFieldLabel(fieldName)} must not exceed ${control.errors['max'].max}`;
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
      specialization: 'Specialization',
      licenseNumber: 'License Number',
      qualification: 'Qualification',
      yearsOfExperience: 'Years of Experience',
      bio: 'Bio',
      profileImageUrl: 'Profile Image URL',
      department: 'Department',
      availableFrom: 'Available From',
      availableTo: 'Available To',
      consultationFee: 'Consultation Fee'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.doctorForm.get(fieldName);
    return !!(control?.invalid && control.touched);
  }
}
