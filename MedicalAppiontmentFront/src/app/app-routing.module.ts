// Angular Import
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// project import
import { AdminComponent } from './theme/layout/admin/admin.component';
import { PatientListComponent } from './Components/patient-list/patient-list.component';
import { PatientFormComponent } from './Components/patient-form/patient-form.component';
import { DoctorListComponent } from './Components/doctor-list/doctor-list.component';
import { DoctorFormComponent } from './Components/doctor-form/doctor-form.component';
import { AppointmentListComponent } from './Components/appointment-list/appointment-list.component';
import { AppointmentFormComponent } from './Components/appointment-form/appointment-form.component';
import { MedicineListComponent } from './Components/medicine-list/medicine-list.component';
import { MedicineFormComponent } from './Components/medicine-form/medicine-form.component';
import { PrescriptionListComponent } from './Components/prescription-list/prescription-list.component';
import { PrescriptionFormComponent } from './Components/prescription-form/prescription-form.component';


const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/patientList',
        pathMatch: 'full'
      },

       {
        path: 'patientList',
        component:PatientListComponent
      },
      {
        path: 'patient-form/:id',
        component: PatientFormComponent
      },
      {
        path: 'patient-form',
        component: PatientFormComponent
      },
      {
        path: 'doctorList',
        component: DoctorListComponent
      },
      {
        path: 'doctor-form/:id',
        component: DoctorFormComponent
      },
      {
        path: 'doctor-form',
        component: DoctorFormComponent
      },
      {
        path: 'appointments',
        component: AppointmentListComponent
      },
      {
        path: 'appointment-form/:id',
        component: AppointmentFormComponent
      },
      {
        path: 'appointment-form',
        component: AppointmentFormComponent
      },
      {
        path: 'medicines',
        component: MedicineListComponent
      },
      {
        path: 'medicine-form/:id',
        component: MedicineFormComponent
      },
      {
        path: 'medicine-form',
        component: MedicineFormComponent
      },
      {
        path: 'prescriptions',
        component: PrescriptionListComponent
      },
      {
        path: 'prescription-form/:id',
        component: PrescriptionFormComponent
      },
      {
        path: 'prescription-form',
        component: PrescriptionFormComponent
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
