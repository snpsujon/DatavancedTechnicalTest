import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientConnectionService } from './HttpClientConnection.service';

export interface Medicine {
  id?: number;
  name: string;
  genericName?: string;
  dosageForm?: string;
  strength?: string;
  manufacturer?: string;
  description?: string;
  indications?: string;
  contraindications?: string;
  sideEffects?: string;
  instructions?: string;
  isActive: boolean;
  createdDate?: string;
  updatedDate?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface MedicineCreate {
  name: string;
  genericName?: string;
  dosageForm?: string;
  strength?: string;
  manufacturer?: string;
  description?: string;
  indications?: string;
  contraindications?: string;
  sideEffects?: string;
  instructions?: string;
  isActive: boolean;
}

export interface MedicineUpdate {
  id: number;
  name: string;
  genericName?: string;
  dosageForm?: string;
  strength?: string;
  manufacturer?: string;
  description?: string;
  indications?: string;
  contraindications?: string;
  sideEffects?: string;
  instructions?: string;
  isActive: boolean;
}

export interface MedicineResponse {
  data: Medicine[];
  totalCount: number;
  skip: number;
  take: number;
  hasMore: boolean;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class MedicineService {

  constructor(private httpService: HttpClientConnectionService) { }

  /**
   * Get all medicines with pagination
   * @param skip - Number of records to skip
   * @param take - Number of records to take
   * @returns Observable<MedicineResponse>
   */
  getAllMedicines(skip: number = 0, take: number = 50): Observable<MedicineResponse> {
    const url = `Medicine?skip=${skip}&take=${take}`;
    return this.httpService.GetData(url) as Observable<MedicineResponse>;
  }

  /**
   * Get active medicines with pagination (for dropdowns)
   * @param skip - Number of records to skip
   * @param take - Number of records to take
   * @returns Observable<MedicineResponse>
   */
  getActiveMedicines(skip: number = 0, take: number = 50): Observable<MedicineResponse> {
    const url = `Medicine/active?skip=${skip}&take=${take}`;
    return this.httpService.GetData(url) as Observable<MedicineResponse>;
  }

  /**
   * Get medicine by ID
   * @param id - Medicine ID
   * @returns Observable<Medicine>
   */
  getMedicineById(id: number): Observable<Medicine> {
    return this.httpService.GetDataById('Medicine', id.toString()) as Observable<Medicine>;
  }

  /**
   * Create a new medicine
   * @param medicine - Medicine data
   * @returns Observable<any>
   */
  createMedicine(medicine: MedicineCreate): Observable<any> {
    return this.httpService.PostData('Medicine', medicine);
  }

  /**
   * Update an existing medicine
   * @param id - Medicine ID
   * @param medicine - Updated medicine data
   * @returns Observable<any>
   */
  updateMedicine(id: number, medicine: MedicineUpdate): Observable<any> {
    return this.httpService.PutData('Medicine', id.toString(), medicine);
  }

  /**
   * Delete a medicine
   * @param id - Medicine ID
   * @returns Observable<any>
   */
  deleteMedicine(id: number): Observable<any> {
    return this.httpService.DeleteData(`Medicine/${id}`);
  }

  /**
   * Search medicines with pagination
   * @param searchTerm - Search term
   * @param skip - Number of records to skip
   * @param take - Number of records to take
   * @returns Observable<MedicineResponse>
   */
  searchMedicines(searchTerm: string, skip: number = 0, take: number = 50): Observable<MedicineResponse> {
    const url = `Medicine/search?searchTerm=${encodeURIComponent(searchTerm)}&skip=${skip}&take=${take}`;
    return this.httpService.GetData(url) as Observable<MedicineResponse>;
  }

  /**
   * Get medicines by manufacturer with pagination
   * @param manufacturer - Manufacturer name
   * @param skip - Number of records to skip
   * @param take - Number of records to take
   * @returns Observable<MedicineResponse>
   */
  getMedicinesByManufacturer(manufacturer: string, skip: number = 0, take: number = 50): Observable<MedicineResponse> {
    const url = `Medicine/manufacturer/${encodeURIComponent(manufacturer)}?skip=${skip}&take=${take}`;
    return this.httpService.GetData(url) as Observable<MedicineResponse>;
  }

  /**
   * Get medicines by dosage form with pagination
   * @param dosageForm - Dosage form
   * @param skip - Number of records to skip
   * @param take - Number of records to take
   * @returns Observable<MedicineResponse>
   */
  getMedicinesByDosageForm(dosageForm: string, skip: number = 0, take: number = 50): Observable<MedicineResponse> {
    const url = `Medicine/dosageform/${encodeURIComponent(dosageForm)}?skip=${skip}&take=${take}`;
    return this.httpService.GetData(url) as Observable<MedicineResponse>;
  }

  /**
   * Get all unique manufacturers
   * @returns Observable<string[]>
   */
  getManufacturers(): Observable<string[]> {
    // This would need to be implemented in the backend
    // For now, we'll return an empty array
    return new Observable(observer => {
      observer.next([]);
      observer.complete();
    });
  }

  /**
   * Get all unique dosage forms
   * @returns Observable<string[]>
   */
  getDosageForms(): Observable<string[]> {
    // This would need to be implemented in the backend
    // For now, we'll return common dosage forms
    return new Observable(observer => {
      observer.next([
        'Tablet',
        'Capsule',
        'Syrup',
        'Injection',
        'Cream',
        'Ointment',
        'Drops',
        'Inhaler',
        'Patch',
        'Gel'
      ]);
      observer.complete();
    });
  }
}
