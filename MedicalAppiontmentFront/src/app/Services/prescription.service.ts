import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientConnectionService } from './HttpClientConnection.service';

export interface PrescriptionDetail {
  id?: number;
  prescriptionId?: number;
  medicineId: number;
  dosage: string;
  startDate: string;
  endDate: string;
  notes?: string;
  // Additional properties for display
  medicineName?: string;
  medicineGenericName?: string;
  medicineDosageForm?: string;
  medicineStrength?: string;
  medicineManufacturer?: string;
}

export interface Prescription {
  id?: number;
  appointmentId: number;
  generalNotes?: string;
  followUpInstructions?: string;
  prescriptionDate: string;
  // Additional properties for display
  patientName?: string;
  doctorName?: string;
  appointmentDate?: string;
  visitType?: string;
  // Grid data
  prescriptionDetails: PrescriptionDetail[];
}

export interface PrescriptionCreate {
  appointmentId: number;
  generalNotes?: string;
  followUpInstructions?: string;
  prescriptionDetails: PrescriptionDetailCreate[];
}

export interface PrescriptionDetailCreate {
  id?: number;
  medicineId: number;
  dosage: string;
  startDate: string;
  endDate: string;
  notes?: string;
}

export interface PrescriptionUpdate {
  id: number;
  appointmentId: number;
  generalNotes?: string;
  followUpInstructions?: string;
  prescriptionDetails: PrescriptionDetailUpdate[];
}

export interface PrescriptionDetailUpdate {
  id: number; // 0 for new items
  prescriptionId: number;
  medicineId: number;
  dosage: string;
  startDate: string;
  endDate: string;
  notes?: string;
  isDeleted: boolean; // For grid operations
}

export interface PrescriptionResponse {
  data: Prescription[];
  totalCount: number;
  skip: number;
  take: number;
  hasMore: boolean;
  totalPages: number;
}

export interface PrescriptionGridOperation {
  prescriptionId: number;
  prescriptionDetails: PrescriptionDetailUpdate[];
}

export interface PrescriptionDetailAdd {
  prescriptionId: number;
  medicineId: number;
  dosage: string;
  startDate: string;
  endDate: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {

  constructor(private httpService: HttpClientConnectionService) { }

  /**
   * Get all prescriptions with pagination
   * @param skip - Number of records to skip
   * @param take - Number of records to take
   * @returns Observable<PrescriptionResponse>
   */
  getAllPrescriptions(skip: number = 0, take: number = 50): Observable<PrescriptionResponse> {
    const url = `Prescription?skip=${skip}&take=${take}`;
    return this.httpService.GetData(url) as Observable<PrescriptionResponse>;
  }

  /**
   * Get prescription by ID
   * @param id - Prescription ID
   * @returns Observable<Prescription>
   */
  getPrescriptionById(id: number): Observable<Prescription> {
    return this.httpService.GetDataById('Prescription', id.toString()) as Observable<Prescription>;
  }

  /**
   * Get prescription by appointment ID
   * @param appointmentId - Appointment ID
   * @returns Observable<Prescription>
   */
  getPrescriptionByAppointment(appointmentId: number): Observable<Prescription> {
    return this.httpService.GetData(`Prescription/appointment/${appointmentId}`) as Observable<Prescription>;
  }

  /**
   * Get prescription details by prescription ID
   * @param prescriptionId - Prescription ID
   * @returns Observable<PrescriptionDetail[]>
   */
  getPrescriptionDetailsByPrescriptionId(prescriptionId: number): Observable<PrescriptionDetail[]> {
    return this.httpService.GetData(`Prescription/${prescriptionId}/details`) as Observable<PrescriptionDetail[]>;
  }

  /**
   * Create a new prescription
   * @param prescription - Prescription data
   * @returns Observable<any>
   */
  createPrescription(prescription: PrescriptionCreate): Observable<any> {
    return this.httpService.PostData('Prescription', prescription);
  }

  /**
   * Create or update prescription for appointment
   * @param prescription - Prescription data
   * @returns Observable<any>
   */
  createOrUpdatePrescriptionForAppointment(prescription: PrescriptionCreate): Observable<any> {
    return this.httpService.PostData('Prescription/appointment', prescription);
  }

  /**
   * Update an existing prescription
   * @param id - Prescription ID
   * @param prescription - Updated prescription data
   * @returns Observable<any>
   */
  updatePrescription(id: number, prescription: PrescriptionUpdate): Observable<any> {
    return this.httpService.PutData('Prescription', id.toString(), prescription);
  }

  /**
   * Delete a prescription
   * @param id - Prescription ID
   * @returns Observable<any>
   */
  deletePrescription(id: number): Observable<any> {
    return this.httpService.DeleteData(`Prescription/${id}`);
  }

  // Grid Operations

  /**
   * Add a new row to prescription grid
   * @param prescriptionId - Prescription ID
   * @param prescriptionDetail - New prescription detail
   * @returns Observable<PrescriptionDetail>
   */
  addPrescriptionDetail(prescriptionId: number, prescriptionDetail: PrescriptionDetailAdd): Observable<PrescriptionDetail> {
    return this.httpService.PostData(`Prescription/${prescriptionId}/details`, prescriptionDetail) as Observable<PrescriptionDetail>;
  }

  /**
   * Update a row in prescription grid
   * @param prescriptionDetailId - Prescription detail ID
   * @param prescriptionDetail - Updated prescription detail
   * @returns Observable<PrescriptionDetail>
   */
  updatePrescriptionDetail(prescriptionDetailId: number, prescriptionDetail: PrescriptionDetailUpdate): Observable<PrescriptionDetail> {
    return this.httpService.PutData(`Prescription/details/${prescriptionDetailId}`, prescriptionDetailId.toString(), prescriptionDetail) as Observable<PrescriptionDetail>;
  }

  /**
   * Delete a row from prescription grid
   * @param prescriptionDetailId - Prescription detail ID
   * @returns Observable<any>
   */
  deletePrescriptionDetail(prescriptionDetailId: number): Observable<any> {
    return this.httpService.DeleteData(`Prescription/details/${prescriptionDetailId}`);
  }

  /**
   * Update prescription grid (bulk operation)
   * @param gridOperation - Grid operation data
   * @returns Observable<Prescription>
   */
  updatePrescriptionGrid(gridOperation: PrescriptionGridOperation): Observable<Prescription> {
    return this.httpService.PutData('Prescription/grid', '', gridOperation) as Observable<Prescription>;
  }

  /**
   * Get prescription details by prescription ID
   * @param prescriptionId - Prescription ID
   * @returns Observable<PrescriptionDetail[]>
   */
  getPrescriptionDetails(prescriptionId: number): Observable<PrescriptionDetail[]> {
    return this.httpService.GetData(`Prescription/${prescriptionId}/details`) as Observable<PrescriptionDetail[]>;
  }

  // Additional operations

  /**
   * Get prescriptions by patient ID with pagination
   * @param patientId - Patient ID
   * @param skip - Number of records to skip
   * @param take - Number of records to take
   * @returns Observable<PrescriptionResponse>
   */
  getPrescriptionsByPatient(patientId: number, skip: number = 0, take: number = 50): Observable<PrescriptionResponse> {
    const url = `Prescription/patient/${patientId}?skip=${skip}&take=${take}`;
    return this.httpService.GetData(url) as Observable<PrescriptionResponse>;
  }

  /**
   * Get prescriptions by doctor ID
   * @param doctorId - Doctor ID
   * @returns Observable<Prescription[]>
   */
  getPrescriptionsByDoctor(doctorId: number): Observable<Prescription[]> {
    return this.httpService.GetData(`Prescription/doctor/${doctorId}`) as Observable<Prescription[]>;
  }

  /**
   * Get prescriptions by date range
   * @param startDate - Start date
   * @param endDate - End date
   * @returns Observable<Prescription[]>
   */
  getPrescriptionsByDateRange(startDate: string, endDate: string): Observable<Prescription[]> {
    const url = `Prescription/daterange?startDate=${startDate}&endDate=${endDate}`;
    return this.httpService.GetData(url) as Observable<Prescription[]>;
  }

  /**
   * Search prescriptions with pagination
   * @param searchTerm - Search term
   * @param skip - Number of records to skip
   * @param take - Number of records to take
   * @returns Observable<PrescriptionResponse>
   */
  searchPrescriptions(searchTerm: string, skip: number = 0, take: number = 50): Observable<PrescriptionResponse> {
    const url = `Prescription/search?searchTerm=${encodeURIComponent(searchTerm)}&skip=${skip}&take=${take}`;
    return this.httpService.GetData(url) as Observable<PrescriptionResponse>;
  }
}

