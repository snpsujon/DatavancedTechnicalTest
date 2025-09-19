import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientConnectionService } from './HttpClientConnection.service';

export interface Appointment {
  id?: number;
  patientId: number;
  doctorId: number;
  appointmentDate: string;
  visitType: string;
  notes?: string;
  diagnosis?: string;
  status: string;
  createdBy?: string;
  updatedBy?: string;
  createdDate?: string;
  updatedDate?: string;
  // Additional properties for display
  patientName?: string;
  doctorName?: string;
  doctorSpecialization?: string;
}

export interface AppointmentCreate {
  patientId: number;
  doctorId: number;
  appointmentDate: string;
  visitType: string;
  notes?: string;
  diagnosis?: string;
}

export interface AppointmentUpdate {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentDate: string;
  visitType: string;
  notes?: string;
  diagnosis?: string;
  status: string;
}

export interface AppointmentResponse {
  data: Appointment[];
  totalCount: number;
  skip: number;
  take: number;
  hasMore: boolean;
  totalPages: number;
}

export interface DoctorAvailability {
  isAvailable: boolean;
  doctorId: number;
  appointmentDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private httpService: HttpClientConnectionService) { }

  /**
   * Get all appointments with pagination
   * @param skip - Number of records to skip
   * @param take - Number of records to take
   * @returns Observable<AppointmentResponse>
   */
  getAllAppointments(skip: number = 0, take: number = 50): Observable<AppointmentResponse> {
    const url = `Appointment?skip=${skip}&take=${take}`;
    return this.httpService.GetData(url) as Observable<AppointmentResponse>;
  }

  /**
   * Get appointment by ID
   * @param id - Appointment ID
   * @returns Observable<Appointment>
   */
  getAppointmentById(id: number): Observable<Appointment> {
    return this.httpService.GetDataById('Appointment', id.toString()) as Observable<Appointment>;
  }

  /**
   * Create a new appointment
   * @param appointment - Appointment data
   * @returns Observable<any>
   */
  createAppointment(appointment: AppointmentCreate): Observable<any> {
    return this.httpService.PostData('Appointment', appointment);
  }

  /**
   * Update an existing appointment
   * @param id - Appointment ID
   * @param appointment - Updated appointment data
   * @returns Observable<any>
   */
  updateAppointment(id: number, appointment: AppointmentUpdate): Observable<any> {
    return this.httpService.PutData('Appointment', id.toString(), appointment);
  }

  /**
   * Delete an appointment
   * @param id - Appointment ID
   * @returns Observable<any>
   */
  deleteAppointment(id: number): Observable<any> {
    return this.httpService.DeleteData(`Appointment/${id}`);
  }

  /**
   * Get appointments by patient ID
   * @param patientId - Patient ID
   * @returns Observable<Appointment[]>
   */
  getAppointmentsByPatient(patientId: number): Observable<Appointment[]> {
    return this.httpService.GetData(`Appointment/patient/${patientId}`) as Observable<Appointment[]>;
  }

  /**
   * Get appointments by doctor ID
   * @param doctorId - Doctor ID
   * @returns Observable<Appointment[]>
   */
  getAppointmentsByDoctor(doctorId: number): Observable<Appointment[]> {
    return this.httpService.GetData(`Appointment/doctor/${doctorId}`) as Observable<Appointment[]>;
  }

  /**
   * Get appointments by date
   * @param date - Appointment date
   * @returns Observable<Appointment[]>
   */
  getAppointmentsByDate(date: string): Observable<Appointment[]> {
    const formattedDate = new Date(date).toISOString().split('T')[0];
    return this.httpService.GetData(`Appointment/date/${formattedDate}`) as Observable<Appointment[]>;
  }

  /**
   * Get appointments by date range
   * @param startDate - Start date
   * @param endDate - End date
   * @returns Observable<Appointment[]>
   */
  getAppointmentsByDateRange(startDate: string, endDate: string): Observable<Appointment[]> {
    const url = `Appointment/daterange?startDate=${startDate}&endDate=${endDate}`;
    return this.httpService.GetData(url) as Observable<Appointment[]>;
  }

  /**
   * Get appointments by status
   * @param status - Appointment status
   * @returns Observable<Appointment[]>
   */
  getAppointmentsByStatus(status: string): Observable<Appointment[]> {
    return this.httpService.GetData(`Appointment/status/${status}`) as Observable<Appointment[]>;
  }

  /**
   * Get upcoming appointments
   * @returns Observable<Appointment[]>
   */
  getUpcomingAppointments(): Observable<Appointment[]> {
    return this.httpService.GetData('Appointment/upcoming') as Observable<Appointment[]>;
  }

  /**
   * Get today's appointments
   * @returns Observable<Appointment[]>
   */
  getTodaysAppointments(): Observable<Appointment[]> {
    return this.httpService.GetData('Appointment/today') as Observable<Appointment[]>;
  }

  /**
   * Search appointments
   * @param searchTerm - Search term
   * @returns Observable<Appointment[]>
   */
  searchAppointments(searchTerm: string): Observable<Appointment[]> {
    const url = `Appointment/search?searchTerm=${encodeURIComponent(searchTerm)}`;
    return this.httpService.GetData(url) as Observable<Appointment[]>;
  }

  /**
   * Get appointments by visit type
   * @param visitType - Visit type
   * @returns Observable<Appointment[]>
   */
  getAppointmentsByVisitType(visitType: string): Observable<Appointment[]> {
    return this.httpService.GetData(`Appointment/visittype/${visitType}`) as Observable<Appointment[]>;
  }

  /**
   * Update appointment status
   * @param id - Appointment ID
   * @param status - New status
   * @returns Observable<any>
   */
  updateAppointmentStatus(id: number, status: string): Observable<any> {
    return this.httpService.PutData(`Appointment/${id}/status`, id.toString(), status);
  }

  /**
   * Cancel an appointment
   * @param id - Appointment ID
   * @returns Observable<any>
   */
  cancelAppointment(id: number): Observable<any> {
    return this.httpService.PutData(`Appointment/${id}/cancel`, id.toString(), {});
  }

  /**
   * Complete an appointment
   * @param id - Appointment ID
   * @returns Observable<any>
   */
  completeAppointment(id: number): Observable<any> {
    return this.httpService.PutData(`Appointment/${id}/complete`, id.toString(), {});
  }

  /**
   * Check if doctor is available
   * @param doctorId - Doctor ID
   * @param appointmentDate - Appointment date
   * @returns Observable<DoctorAvailability>
   */
  checkDoctorAvailability(doctorId: number, appointmentDate: string): Observable<DoctorAvailability> {
    const formattedDate = new Date(appointmentDate).toISOString();
    const url = `Appointment/availability/doctor/${doctorId}?appointmentDate=${formattedDate}`;
    return this.httpService.GetData(url) as Observable<DoctorAvailability>;
  }

  /**
   * Get available time slots for a doctor on a specific date
   * @param doctorId - Doctor ID
   * @param date - Date
   * @returns Observable<string[]>
   */
  getAvailableTimeSlots(doctorId: number, date: string): Observable<string[]> {
    const formattedDate = new Date(date).toISOString();
    const url = `Appointment/availability/timeslots/${doctorId}?date=${formattedDate}`;
    return this.httpService.GetData(url) as Observable<string[]>;
  }
}
