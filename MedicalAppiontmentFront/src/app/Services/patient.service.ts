import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientConnectionService } from './HttpClientConnection.service';

export interface Patient {
  id?: number;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  medicalHistory?: string;
  allergies?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  isActive: boolean;
  createdDate?: string;
  updatedDate?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface PatientResponse {
  status: number;
  message: string;
  data: Patient[];
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private httpService: HttpClientConnectionService) { }

  /**
   * Get all patients with pagination
   * @param take - Number of records to take
   * @param skip - Number of records to skip
   * @returns Observable<PatientResponse>
   */
  getAllPatients(take: number = 50, skip: number = 0): Observable<PatientResponse> {
    const url = `Patient?take=${take}&skip=${skip}`;
    return this.httpService.GetData(url) as Observable<PatientResponse>;
  }

  /**
   * Get patient by ID
   * @param id - Patient ID
   * @returns Observable<Patient>
   */
  getPatientById(id: number): Observable<Patient> {
    return this.httpService.GetDataById('Patient', id.toString()) as Observable<Patient>;
  }

  /**
   * Create a new patient
   * @param patient - Patient data
   * @returns Observable<any>
   */
  createPatient(patient: Patient): Observable<any> {
    return this.httpService.PostData('Patient', patient);
  }

  /**
   * Update an existing patient
   * @param id - Patient ID
   * @param patient - Updated patient data
   * @returns Observable<any>
   */
  updatePatient(id: number, patient: Patient): Observable<any> {
    return this.httpService.PutData('Patient', id.toString(), patient);
  }

  /**
   * Delete a patient
   * @param id - Patient ID
   * @returns Observable<any>
   */
  deletePatient(id: number): Observable<any> {
    return this.httpService.DeleteData(`Patient/${id}`);
  }

  /**
   * Search patients by term
   * @param searchTerm - Search term
   * @returns Observable<Patient[]>
   */
  searchPatients(searchTerm: string): Observable<Patient[]> {
    const url = `Patient/search?searchTerm=${encodeURIComponent(searchTerm)}`;
    return this.httpService.GetData(url) as Observable<Patient[]>;
  }
}
