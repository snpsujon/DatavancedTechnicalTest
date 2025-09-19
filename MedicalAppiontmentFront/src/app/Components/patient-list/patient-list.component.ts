import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { CommonService } from 'src/app/Services/common.service';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import { PatientService } from 'src/app/Services/patient.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-patient-list',
  standalone: false,
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.scss'
})




export class PatientListComponent implements OnInit {
  fromHeader: string = 'Patient List';
  formRoute: string = '/patient-form';
  listAPI: string = 'Patient';
  deleteAPI: string = 'Region/DeleteRegion';
  haveQueryPram: boolean = false;
  reloadCount: number = 0;
  RegionData:any[]=[];
  userColumns = [
    { caption: 'ID', key: 'id', width: 50, isShow: false },
    { caption: 'First Name', key: 'firstName', width: 150 },
    { caption: 'Last Name', key: 'lastName', width: 150 },
    { caption: 'Email', key: 'email', width: 200 },
    { caption: 'Phone', key: 'phoneNumber', width: 130 },
    { caption: 'Gender', key: 'gender', width: 100 },
    { caption: 'Date of Birth', key: 'dateOfBirth', width: 120 },
    { caption: 'Status', key: 'isActive', width: 80, type: 'bool' }
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
    private patientService: PatientService,
    private router: Router,
    private common:CommonService,
    
    private GridHandlerService: GridHandlerService,
  ) {
    debugger;
        this.common.formHeaderName = this.fromHeader;
    this.GridHandlerService.edit$.pipe(take(1)).subscribe(async (data: any) => {
      this.edit(data);
    });
    this.GridHandlerService.details$.pipe(take(1)).subscribe(async (data: any) => {
      this.details(data);
    });
  }

  ngOnInit(): void {
    this.GridHandlerService.data$.subscribe((newData:any) => {
      this.edit(newData);
    });
    // this.getRegionData();
  }

  addPatient(): void {
    this.router.navigate(['/patient-form']);
  }

  edit(selectedRecord: any) {
    this.router.navigate(['/patient-form', selectedRecord.id]);
  }
  details(selectedRecord: any) {
    this.GridHandlerService.selectedTab = 'Details';
    this.router.navigate([this.formRoute], { queryParams: { do: selectedRecord.id } });
  }
  delete(selectedRecord: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure you want to delete patient "${selectedRecord.firstName} ${selectedRecord.lastName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result :any) => {
      if (result.value) {
        this.patientService.deletePatient(selectedRecord.id).subscribe(
          (response: any) => {
            this.reloadCount++;
            Swal.fire('Success', 'Patient deleted successfully', 'success');
          },
          (error: any) => {
            console.error('Failed to delete patient:', error);
            Swal.fire('Error', 'Failed to delete patient', 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Patient record is safe', 'info');
      }
    });
  }
  
}
