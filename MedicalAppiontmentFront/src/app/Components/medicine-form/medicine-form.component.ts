import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MedicineService, MedicineCreate, MedicineUpdate, Medicine } from 'src/app/Services/medicine.service';
import { CommonService } from 'src/app/Services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicine-form',
  standalone: false,
  templateUrl: './medicine-form.component.html',
  styleUrl: './medicine-form.component.scss'
})
export class MedicineFormComponent implements OnInit {
  medicineForm: FormGroup;
  isEditMode: boolean = false;
  medicineId: number | null = null;
  isSubmitting: boolean = false;
  isLoading: boolean = false;
  
  dosageFormOptions = [
    { value: 'Tablet', label: 'Tablet' },
    { value: 'Capsule', label: 'Capsule' },
    { value: 'Syrup', label: 'Syrup' },
    { value: 'Injection', label: 'Injection' },
    { value: 'Cream', label: 'Cream' },
    { value: 'Ointment', label: 'Ointment' },
    { value: 'Drops', label: 'Drops' },
    { value: 'Inhaler', label: 'Inhaler' },
    { value: 'Patch', label: 'Patch' },
    { value: 'Gel', label: 'Gel' },
    { value: 'Powder', label: 'Powder' },
    { value: 'Lotion', label: 'Lotion' },
    { value: 'Spray', label: 'Spray' },
    { value: 'Suspension', label: 'Suspension' },
    { value: 'Emulsion', label: 'Emulsion' }
  ];

  constructor(
    private fb: FormBuilder,
    private medicineService: MedicineService,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) {
    this.medicineForm = this.createForm();
  }

  ngOnInit(): void {
    this.commonService.formHeaderName = this.isEditMode ? 'Edit Medicine' : 'Add Medicine';
    
    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.medicineId = +params['id'];
        this.loadMedicineData();
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      genericName: ['', [Validators.maxLength(100)]],
      dosageForm: ['', [Validators.maxLength(50)]],
      strength: ['', [Validators.maxLength(20)]],
      manufacturer: ['', [Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      indications: ['', [Validators.maxLength(1000)]],
      contraindications: ['', [Validators.maxLength(1000)]],
      sideEffects: ['', [Validators.maxLength(1000)]],
      instructions: ['', [Validators.maxLength(1000)]],
      isActive: [true]
    });
  }

  loadMedicineData(): void {
    if (this.medicineId) {
      this.isLoading = true;
      this.medicineService.getMedicineById(this.medicineId).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response) {
            this.populateForm(response);
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error loading medicine data:', error);
          Swal.fire('Error', 'Failed to load medicine data', 'error');
        }
      });
    }
  }

  populateForm(medicine: any): void {
    this.medicineForm.patchValue({
      name: medicine.name,
      genericName: medicine.genericName,
      dosageForm: medicine.dosageForm,
      strength: medicine.strength,
      manufacturer: medicine.manufacturer,
      description: medicine.description,
      indications: medicine.indications,
      contraindications: medicine.contraindications,
      sideEffects: medicine.sideEffects,
      instructions: medicine.instructions,
      isActive: medicine.isActive
    });
  }

  onSubmit(): void {
    if (this.medicineForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const formData = this.medicineForm.value;
      
      if (this.isEditMode && this.medicineId) {
        const updateData: MedicineUpdate = {
          id: this.medicineId,
          name: formData.name,
          genericName: formData.genericName,
          dosageForm: formData.dosageForm,
          strength: formData.strength,
          manufacturer: formData.manufacturer,
          description: formData.description,
          indications: formData.indications,
          contraindications: formData.contraindications,
          sideEffects: formData.sideEffects,
          instructions: formData.instructions,
          isActive: formData.isActive
        };
        this.updateMedicine(updateData);
      } else {
        const createData: MedicineCreate = {
          name: formData.name,
          genericName: formData.genericName,
          dosageForm: formData.dosageForm,
          strength: formData.strength,
          manufacturer: formData.manufacturer,
          description: formData.description,
          indications: formData.indications,
          contraindications: formData.contraindications,
          sideEffects: formData.sideEffects,
          instructions: formData.instructions,
          isActive: formData.isActive
        };
        this.createMedicine(createData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  createMedicine(medicineData: MedicineCreate): void {
    this.medicineService.createMedicine(medicineData).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        Swal.fire({
          title: 'Success!',
          text: 'Medicine created successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/medicines']);
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error creating medicine:', error);
        const errorMessage = error.error?.message || 'Failed to create medicine';
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  updateMedicine(medicineData: MedicineUpdate): void {
    this.medicineService.updateMedicine(this.medicineId!, medicineData).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        Swal.fire({
          title: 'Success!',
          text: 'Medicine updated successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/medicines']);
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error updating medicine:', error);
        const errorMessage = error.error?.message || 'Failed to update medicine';
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/medicines']);
  }

  markFormGroupTouched(): void {
    Object.keys(this.medicineForm.controls).forEach(key => {
      const control = this.medicineForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.medicineForm.get(fieldName);
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
      name: 'Medicine Name',
      genericName: 'Generic Name',
      dosageForm: 'Dosage Form',
      strength: 'Strength',
      manufacturer: 'Manufacturer',
      description: 'Description',
      indications: 'Indications',
      contraindications: 'Contraindications',
      sideEffects: 'Side Effects',
      instructions: 'Instructions',
      isActive: 'Active Status'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.medicineForm.get(fieldName);
    return !!(control?.invalid && control.touched);
  }
}
