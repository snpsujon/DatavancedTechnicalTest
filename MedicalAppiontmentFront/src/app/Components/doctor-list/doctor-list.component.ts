import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { CommonService } from 'src/app/Services/common.service';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import { DoctorService } from 'src/app/Services/doctor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctor-list',
  standalone: false,
  templateUrl: './doctor-list.component.html',
  styleUrl: './doctor-list.component.scss'
})

export class DoctorListComponent implements OnInit {
  fromHeader: string = 'Doctor List';
  formRoute: string = '/doctor-form';
  listAPI: string = 'Doctor';
  deleteAPI: string = 'Doctor/DeleteDoctor';
  haveQueryPram: boolean = false;
  reloadCount: number = 0;
  DoctorData: any[] = [];
  
  userColumns = [
    { caption: 'ID', key: 'id', width: 50, isShow: false },
    { caption: 'First Name', key: 'firstName', width: 120 },
    { caption: 'Last Name', key: 'lastName', width: 120 },
    { caption: 'Specialization', key: 'specialization', width: 150 },
    { caption: 'Department', key: 'department', width: 130 },
    { caption: 'Email', key: 'email', width: 180 },
    { caption: 'Phone', key: 'phoneNumber', width: 130 },
    { caption: 'Experience', key: 'yearsOfExperience', width: 100 },
    { caption: 'Available', key: 'isAvailable', width: 90, type: 'bool' },
    { caption: 'Active', key: 'isActive', width: 80, type: 'bool' }
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
  };

  constructor(
    private dataService: HttpClientConnectionService,
    private doctorService: DoctorService,
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

  addDoctor(): void {
    this.router.navigate(['/doctor-form']);
  }

  edit(selectedRecord: any) {
    this.router.navigate(['/doctor-form', selectedRecord.id]);
  }

  details(selectedRecord: any) {
    this.GridHandlerService.selectedTab = 'Details';
    this.router.navigate([this.formRoute], { queryParams: { do: selectedRecord.id } });
  }

  delete(selectedRecord: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure you want to delete doctor "${selectedRecord.firstName} ${selectedRecord.lastName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result: any) => {
      if (result.value) {
        this.doctorService.deleteDoctor(selectedRecord.id).subscribe(
          (response: any) => {
            this.reloadCount++;
            Swal.fire('Success', 'Doctor deleted successfully', 'success');
          },
          (error: any) => {
            console.error('Failed to delete doctor:', error);
            Swal.fire('Error', 'Failed to delete doctor', 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Doctor record is safe', 'info');
      }
    });
  }
}
