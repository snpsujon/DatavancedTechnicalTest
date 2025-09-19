import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { CommonService } from 'src/app/Services/common.service';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import { MedicineService } from 'src/app/Services/medicine.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicine-list',
  standalone: false,
  templateUrl: './medicine-list.component.html',
  styleUrl: './medicine-list.component.scss'
})

export class MedicineListComponent implements OnInit {
  fromHeader: string = 'Medicine List';
  formRoute: string = '/medicine-form';
  listAPI: string = 'Medicine';
  deleteAPI: string = 'Medicine/DeleteMedicine';
  haveQueryPram: boolean = false;
  reloadCount: number = 0;
  MedicineData: any[] = [];
  
  userColumns = [
    { caption: 'ID', key: 'id', width: 50, isShow: false },
    { caption: 'Medicine Name', key: 'name', width: 200 },
    { caption: 'Generic Name', key: 'genericName', width: 180 },
    { caption: 'Dosage Form', key: 'dosageForm', width: 120 },
    { caption: 'Strength', key: 'strength', width: 100 },
    { caption: 'Manufacturer', key: 'manufacturer', width: 150 },
    { caption: 'Status', key: 'isActive', width: 80 }
  ]

  buttonShow = {
    edit: {
      isShow: true,
      emit: (selectedRecord: any) => this.edit(selectedRecord)
    },
    viewDetails: {
      isShow: true,
      emit: (selectedRecord: any) => this.details(selectedRecord)
    },
    delete: {
      isShow: true,
      emit: (selectedRecord: any) => this.delete(selectedRecord)
    }
  };

  constructor(
    private dataService: HttpClientConnectionService,
    private medicineService: MedicineService,
    private router: Router,
    private common: CommonService,
    private GridHandlerService: GridHandlerService,
  ) {
    this.common.formHeaderName = this.fromHeader;
    this.GridHandlerService.edit$.pipe(take(1)).subscribe(async (data: any) => {
      this.edit(data);
    });
    this.GridHandlerService.details$.pipe(take(1)).subscribe(async (data: any) => {
      this.details(data);
    });
  }

  ngOnInit(): void {
    this.GridHandlerService.data$.subscribe((newData: any) => {
      this.edit(newData);
    });
  }

  addMedicine(): void {
    this.router.navigate(['/medicine-form']);
  }

  edit(selectedRecord: any) {
    this.router.navigate(['/medicine-form', selectedRecord.id]);
  }

  details(selectedRecord: any) {
    this.GridHandlerService.selectedTab = 'Details';
    this.router.navigate([this.formRoute], { queryParams: { do: selectedRecord.id } });
  }

  delete(selectedRecord: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure you want to delete medicine "${selectedRecord.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result: any) => {
      if (result.value) {
        this.medicineService.deleteMedicine(selectedRecord.id).subscribe(
          (response: any) => {
            this.reloadCount++;
            Swal.fire('Success', 'Medicine deleted successfully', 'success');
          },
          (error: any) => {
            console.error('Failed to delete medicine:', error);
            Swal.fire('Error', 'Failed to delete medicine', 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Medicine record is safe', 'info');
      }
    });
  }

  getStatusBadgeClass(isActive: boolean): string {
    return isActive ? 'badge bg-success' : 'badge bg-danger';
  }

  getStatusText(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }

  formatDosageForm(dosageForm: string): string {
    if (!dosageForm) return 'N/A';
    return dosageForm;
  }

  formatStrength(strength: string): string {
    if (!strength) return 'N/A';
    return strength;
  }

  formatManufacturer(manufacturer: string): string {
    if (!manufacturer) return 'N/A';
    return manufacturer;
  }

  formatGenericName(genericName: string): string {
    if (!genericName) return 'N/A';
    return genericName;
  }
}
