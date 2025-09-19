import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { CommonService } from 'src/app/Services/common.service';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import { AppointmentService } from 'src/app/Services/appointment.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-appointment-list',
  standalone: false,
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.scss'
})

export class AppointmentListComponent implements OnInit {
  fromHeader: string = 'Appointment List';
  formRoute: string = '/appointment-form';
  listAPI: string = 'Appointment';
  deleteAPI: string = 'Appointment/DeleteAppointment';
  haveQueryPram: boolean = false;
  reloadCount: number = 0;
  AppointmentData: any[] = [];
  
  userColumns = [
    { caption: 'ID', key: 'id', width: 50, isShow: false },
    { caption: 'Patient', key: 'patientName', width: 150 },
    { caption: 'Doctor', key: 'doctorName', width: 180 },
    { caption: 'Date', key: 'appointmentDate', width: 120 },
    { caption: 'Visit Type', key: 'visitType', width: 120 },
    { caption: 'Status', key: 'status', width: 100 },
    { caption: 'Notes', key: 'notes', width: 200 }
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
    complete: {
      isShow: true,
      emit: (selectedRecord: any) => this.complete(selectedRecord)
    },
    cancel: {
      isShow: true,
      emit: (selectedRecord: any) => this.cancel(selectedRecord)
    }
  };

  constructor(
    private dataService: HttpClientConnectionService,
    private appointmentService: AppointmentService,
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

  addAppointment(): void {
    this.router.navigate(['/appointment-form']);
  }

  edit(selectedRecord: any) {
    this.router.navigate(['/appointment-form', selectedRecord.id]);
  }

  details(selectedRecord: any) {
    this.GridHandlerService.selectedTab = 'Details';
    this.router.navigate([this.formRoute], { queryParams: { do: selectedRecord.id } });
  }

  delete(selectedRecord: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure you want to delete this appointment?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result: any) => {
      if (result.value) {
        this.appointmentService.deleteAppointment(selectedRecord.id).subscribe(
          (response: any) => {
            this.reloadCount++;
            Swal.fire('Success', 'Appointment deleted successfully', 'success');
          },
          (error: any) => {
            console.error('Failed to delete appointment:', error);
            Swal.fire('Error', 'Failed to delete appointment', 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Appointment is safe', 'info');
      }
    });
  }

  complete(selectedRecord: any) {
    Swal.fire({
      title: 'Complete Appointment?',
      text: `Mark this appointment as completed?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, complete it!',
      cancelButtonText: 'Cancel'
    }).then((result: any) => {
      if (result.value) {
        this.appointmentService.completeAppointment(selectedRecord.id).subscribe(
          (response: any) => {
            this.reloadCount++;
            Swal.fire('Success', 'Appointment marked as completed', 'success');
          },
          (error: any) => {
            console.error('Failed to complete appointment:', error);
            Swal.fire('Error', 'Failed to complete appointment', 'error');
          }
        );
      }
    });
  }

  cancel(selectedRecord: any) {
    Swal.fire({
      title: 'Cancel Appointment?',
      text: `Are you sure you want to cancel this appointment?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it'
    }).then((result: any) => {
      if (result.value) {
        this.appointmentService.cancelAppointment(selectedRecord.id).subscribe(
          (response: any) => {
            this.reloadCount++;
            Swal.fire('Success', 'Appointment cancelled successfully', 'success');
          },
          (error: any) => {
            console.error('Failed to cancel appointment:', error);
            Swal.fire('Error', 'Failed to cancel appointment', 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Appointment remains scheduled', 'info');
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return 'badge bg-primary';
      case 'completed':
        return 'badge bg-success';
      case 'cancelled':
        return 'badge bg-danger';
      case 'no-show':
        return 'badge bg-warning';
      case 'in progress':
        return 'badge bg-info';
      default:
        return 'badge bg-secondary';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }
}
