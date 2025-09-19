# Appointment API Documentation

## Overview
This document describes the Appointment API endpoints for the Medical Appointment System. The API provides full CRUD operations for managing appointments with patients and doctors.

## Base URL
```
/api/appointment
```

## Models

### AppointmentVM
```json
{
  "id": 0,
  "patientId": 0,
  "doctorId": 0,
  "appointmentDate": "2024-01-01T10:00:00Z",
  "visitType": "First Visit",
  "notes": "string",
  "diagnosis": "string",
  "status": "Scheduled",
  "patientName": "string",
  "doctorName": "string",
  "doctorSpecialization": "string"
}
```

### AppointmentCreateVM
```json
{
  "patientId": 0,
  "doctorId": 0,
  "appointmentDate": "2024-01-01T10:00:00Z",
  "visitType": "First Visit",
  "notes": "string",
  "diagnosis": "string"
}
```

### AppointmentUpdateVM
```json
{
  "id": 0,
  "patientId": 0,
  "doctorId": 0,
  "appointmentDate": "2024-01-01T10:00:00Z",
  "visitType": "First Visit",
  "notes": "string",
  "diagnosis": "string",
  "status": "Scheduled"
}
```

## Endpoints

### 1. Get All Appointments
- **GET** `/api/appointment`
- **Description**: Retrieve all appointments with patient and doctor details
- **Response**: Array of AppointmentVM

### 2. Get Appointment by ID
- **GET** `/api/appointment/{id}`
- **Description**: Retrieve a specific appointment by ID
- **Parameters**: 
  - `id` (int): Appointment ID
- **Response**: AppointmentVM or 404 if not found

### 3. Create Appointment
- **POST** `/api/appointment`
- **Description**: Create a new appointment
- **Body**: AppointmentCreateVM
- **Response**: Created AppointmentVM or 400 if validation fails
- **Validation**: 
  - Checks if doctor is available
  - Checks if time slot is available
  - Validates required fields

### 4. Update Appointment
- **PUT** `/api/appointment/{id}`
- **Description**: Update an existing appointment
- **Parameters**: 
  - `id` (int): Appointment ID
- **Body**: AppointmentUpdateVM
- **Response**: Updated AppointmentVM or 404 if not found

### 5. Delete Appointment
- **DELETE** `/api/appointment/{id}`
- **Description**: Delete an appointment
- **Parameters**: 
  - `id` (int): Appointment ID
- **Response**: Success message or 404 if not found

### 6. Get Appointments by Patient
- **GET** `/api/appointment/patient/{patientId}`
- **Description**: Get all appointments for a specific patient
- **Parameters**: 
  - `patientId` (int): Patient ID
- **Response**: Array of AppointmentVM

### 7. Get Appointments by Doctor
- **GET** `/api/appointment/doctor/{doctorId}`
- **Description**: Get all appointments for a specific doctor
- **Parameters**: 
  - `doctorId` (int): Doctor ID
- **Response**: Array of AppointmentVM

### 8. Get Appointments by Date
- **GET** `/api/appointment/date/{date}`
- **Description**: Get all appointments for a specific date
- **Parameters**: 
  - `date` (datetime): Appointment date
- **Response**: Array of AppointmentVM

### 9. Get Appointments by Date Range
- **GET** `/api/appointment/daterange?startDate={startDate}&endDate={endDate}`
- **Description**: Get appointments within a date range
- **Parameters**: 
  - `startDate` (datetime): Start date
  - `endDate` (datetime): End date
- **Response**: Array of AppointmentVM

### 10. Get Appointments by Status
- **GET** `/api/appointment/status/{status}`
- **Description**: Get appointments with a specific status
- **Parameters**: 
  - `status` (string): Appointment status (Scheduled, Completed, Cancelled, No-Show)
- **Response**: Array of AppointmentVM

### 11. Get Upcoming Appointments
- **GET** `/api/appointment/upcoming`
- **Description**: Get all upcoming appointments
- **Response**: Array of AppointmentVM

### 12. Get Today's Appointments
- **GET** `/api/appointment/today`
- **Description**: Get all appointments for today
- **Response**: Array of AppointmentVM

### 13. Search Appointments
- **GET** `/api/appointment/search?searchTerm={searchTerm}`
- **Description**: Search appointments by various criteria
- **Parameters**: 
  - `searchTerm` (string): Search term
- **Response**: Array of AppointmentVM
- **Search Fields**: Patient name, Doctor name, Specialization, Visit type, Status, Notes, Diagnosis

### 14. Get Appointments by Visit Type
- **GET** `/api/appointment/visittype/{visitType}`
- **Description**: Get appointments by visit type
- **Parameters**: 
  - `visitType` (string): Visit type (First Visit, Follow-up, etc.)
- **Response**: Array of AppointmentVM

### 15. Update Appointment Status
- **PUT** `/api/appointment/{id}/status`
- **Description**: Update appointment status
- **Parameters**: 
  - `id` (int): Appointment ID
- **Body**: Status string
- **Response**: Success message

### 16. Cancel Appointment
- **PUT** `/api/appointment/{id}/cancel`
- **Description**: Cancel an appointment
- **Parameters**: 
  - `id` (int): Appointment ID
- **Response**: Success message

### 17. Complete Appointment
- **PUT** `/api/appointment/{id}/complete`
- **Description**: Mark an appointment as completed
- **Parameters**: 
  - `id` (int): Appointment ID
- **Response**: Success message

### 18. Check Doctor Availability
- **GET** `/api/appointment/availability/doctor/{doctorId}?appointmentDate={date}`
- **Description**: Check if a doctor is available
- **Parameters**: 
  - `doctorId` (int): Doctor ID
  - `appointmentDate` (datetime): Appointment date
- **Response**: Availability status

### 19. Get Available Time Slots
- **GET** `/api/appointment/availability/timeslots/{doctorId}?date={date}`
- **Description**: Get available time slots for a doctor on a specific date
- **Parameters**: 
  - `doctorId` (int): Doctor ID
  - `date` (datetime): Date
- **Response**: Array of available time slots

## Status Values
- `Scheduled`: Appointment is scheduled
- `Confirmed`: Appointment is confirmed
- `Completed`: Appointment is completed
- `Cancelled`: Appointment is cancelled
- `No-Show`: Patient did not show up

## Visit Types
- `First Visit`: First time patient visit
- `Follow-up`: Follow-up appointment
- `Consultation`: General consultation
- `Emergency`: Emergency visit
- `Check-up`: Regular check-up

## Error Responses
- **400 Bad Request**: Validation errors or business logic violations
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

## Example Usage

### Create an Appointment
```bash
POST /api/appointment
Content-Type: application/json

{
  "patientId": 1,
  "doctorId": 2,
  "appointmentDate": "2024-01-15T10:00:00Z",
  "visitType": "First Visit",
  "notes": "Patient complains of headache",
  "diagnosis": "To be determined"
}
```

### Get Today's Appointments
```bash
GET /api/appointment/today
```

### Search Appointments
```bash
GET /api/appointment/search?searchTerm=John
```
