import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientConnectionService } from './HttpClientConnection.service';

export interface Doctor {
  id?: number;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  specialization: string;
  licenseNumber?: string;
  qualification?: string;
  yearsOfExperience?: number;
  bio?: string;
  profileImageUrl?: string;
  department?: string;
  availableFrom?: string;
  availableTo?: string;
  consultationFee?: string;
  isActive: boolean;
  isAvailable: boolean;
  createdDate?: string;
  updatedDate?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface DoctorResponse {
  status: number;
  message: string;
  data: Doctor[];
}

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private httpService: HttpClientConnectionService) { }

  /**
   * Get all doctors with pagination
   * @param take - Number of records to take
   * @param skip - Number of records to skip
   * @returns Observable<DoctorResponse>
   */
  getAllDoctors(take: number = 50, skip: number = 0): Observable<DoctorResponse> {
    const url = `Doctor?take=${take}&skip=${skip}`;
    return this.httpService.GetData(url) as Observable<DoctorResponse>;
  }

  /**
   * Get doctor by ID
   * @param id - Doctor ID
   * @returns Observable<Doctor>
   */
  getDoctorById(id: number): Observable<Doctor> {
    return this.httpService.GetDataById('Doctor', id.toString()) as Observable<Doctor>;
  }

  /**
   * Create a new doctor
   * @param doctor - Doctor data
   * @returns Observable<any>
   */
  createDoctor(doctor: Doctor): Observable<any> {
    return this.httpService.PostData('Doctor', doctor);
  }

  /**
   * Update an existing doctor
   * @param id - Doctor ID
   * @param doctor - Updated doctor data
   * @returns Observable<any>
   */
  updateDoctor(id: number, doctor: Doctor): Observable<any> {
    return this.httpService.PutData('Doctor', id.toString(), doctor);
  }

  /**
   * Delete a doctor
   * @param id - Doctor ID
   * @returns Observable<any>
   */
  deleteDoctor(id: number): Observable<any> {
    return this.httpService.DeleteData(`Doctor/${id}`);
  }

  /**
   * Search doctors by term
   * @param searchTerm - Search term
   * @returns Observable<Doctor[]>
   */
  searchDoctors(searchTerm: string): Observable<Doctor[]> {
    const url = `Doctor/search?searchTerm=${encodeURIComponent(searchTerm)}`;
    return this.httpService.GetData(url) as Observable<Doctor[]>;
  }

  /**
   * Get doctors by specialization
   * @param specialization - Specialization name
   * @returns Observable<Doctor[]>
   */
  getDoctorsBySpecialization(specialization: string): Observable<Doctor[]> {
    const url = `Doctor/specialization/${encodeURIComponent(specialization)}`;
    return this.httpService.GetData(url) as Observable<Doctor[]>;
  }

  /**
   * Get available doctors
   * @returns Observable<Doctor[]>
   */
  getAvailableDoctors(): Observable<Doctor[]> {
    return this.httpService.GetData('Doctor/available') as Observable<Doctor[]>;
  }

  /**
   * Update doctor availability
   * @param id - Doctor ID
   * @param isAvailable - Availability status
   * @returns Observable<any>
   */
  updateDoctorAvailability(id: number, isAvailable: boolean): Observable<any> {
    return this.httpService.PutData(`Doctor/${id}/availability`, id.toString(), isAvailable);
  }
}
