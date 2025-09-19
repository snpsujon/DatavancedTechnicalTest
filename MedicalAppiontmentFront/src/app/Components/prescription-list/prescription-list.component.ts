import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { CommonService } from 'src/app/Services/common.service';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import { PrescriptionService } from 'src/app/Services/prescription.service';
import { PrescriptionReportService } from 'src/app/Services/prescription-report.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-prescription-list',
  standalone: false,
  templateUrl: './prescription-list.component.html',
  styleUrl: './prescription-list.component.scss'
})
export class PrescriptionListComponent implements OnInit {
  fromHeader: string = 'Prescription Management';
  formRoute: string = '/prescription-form';
  listAPI: string = 'Prescription';
  deleteAPI: string = 'Prescription';
  haveQueryPram: boolean = false;
  reloadCount: number = 0;
  prescriptionData: any[] = [];
  
  userColumns = [
    { caption: 'ID', key: 'id', width: 50, isShow: false },
    { caption: 'Patient', key: 'patientName', width: 150 },
    { caption: 'Doctor', key: 'doctorName', width: 150 },
    { caption: 'Appointment Date', key: 'appointmentDate', width: 120 },
    { caption: 'Prescription Date', key: 'prescriptionDate', width: 120 },
    { caption: 'Medicines', key: 'medicineCount', width: 100 },
    { caption: 'Status', key: 'status', width: 100 },
    { caption: 'Notes', key: 'generalNotes', width: 200 }
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
    },
    report: {
      isShow: true,
      emit: (selectedRecord: any) => this.print(selectedRecord)
    }
  };

  constructor(
    private dataService: HttpClientConnectionService,
    private prescriptionService: PrescriptionService,
    private prescriptionReportService: PrescriptionReportService,
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

  addPrescription(): void {
    this.router.navigate(['/prescription-form']);
  }

  edit(selectedRecord: any) {
    this.router.navigate(['/prescription-form', selectedRecord.id]);
  }

  details(selectedRecord: any) {
    this.GridHandlerService.selectedTab = 'Details';
    this.router.navigate([this.formRoute], { queryParams: { do: selectedRecord.id } });
  }

  delete(selectedRecord: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure you want to delete this prescription?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result: any) => {
      if (result.value) {
        this.prescriptionService.deletePrescription(selectedRecord.id).subscribe(
          (response: any) => {
            this.reloadCount++;
            Swal.fire('Success', 'Prescription deleted successfully', 'success');
          },
          (error: any) => {
            console.error('Failed to delete prescription:', error);
            Swal.fire('Error', 'Failed to delete prescription', 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Prescription is safe', 'info');
      }
    });
  }

  print(selectedRecord: any) {
    // Generate PDF report using the new service
    this.prescriptionReportService.generatePrescriptionReportFromPrescription(selectedRecord);
  }


  getStatusBadgeClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'badge bg-success';
      case 'completed':
        return 'badge bg-primary';
      case 'cancelled':
        return 'badge bg-danger';
      case 'expired':
        return 'badge bg-warning';
      default:
        return 'badge bg-secondary';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  getMedicineCount(prescription: any): number {
    return prescription.prescriptionDetails?.length || 0;
  }

  getStatus(prescription: any): string {
    const endDate = prescription.prescriptionDetails?.reduce((latest: string, detail: any) => {
      return new Date(detail.endDate) > new Date(latest) ? detail.endDate : latest;
    }, prescription.prescriptionDetails?.[0]?.endDate || new Date().toISOString());
    
    if (endDate && new Date(endDate) < new Date()) {
      return 'Expired';
    }
    return 'Active';
  }
}
