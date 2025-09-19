# Prescription API Documentation

## Overview
This document describes the Prescription API endpoints for the Medical Appointment System. The API provides full CRUD operations for managing prescriptions with multiple medicines per appointment, including grid operations for inline editing.

## Base URLs
```
/api/medicine
/api/prescription
```

## Models

### MedicineVM
```json
{
  "id": 0,
  "name": "string",
  "genericName": "string",
  "dosageForm": "string",
  "strength": "string",
  "manufacturer": "string",
  "description": "string",
  "indications": "string",
  "contraindications": "string",
  "sideEffects": "string",
  "instructions": "string"
}
```

### PrescriptionVM
```json
{
  "id": 0,
  "appointmentId": 0,
  "generalNotes": "string",
  "followUpInstructions": "string",
  "prescriptionDate": "2024-01-01T10:00:00Z",
  "patientName": "string",
  "doctorName": "string",
  "appointmentDate": "2024-01-01",
  "visitType": "string",
  "prescriptionDetails": [
    {
      "id": 0,
      "prescriptionId": 0,
      "medicineId": 0,
      "dosage": "2x daily",
      "startDate": "2024-01-01T00:00:00Z",
      "endDate": "2024-01-07T00:00:00Z",
      "notes": "Take with food",
      "medicineName": "string",
      "medicineGenericName": "string",
      "medicineDosageForm": "string",
      "medicineStrength": "string",
      "medicineManufacturer": "string"
    }
  ]
}
```

### PrescriptionDetailVM (Grid Row)
```json
{
  "id": 0,
  "prescriptionId": 0,
  "medicineId": 0,
  "dosage": "2x daily",
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-01-07T00:00:00Z",
  "notes": "Take with food",
  "medicineName": "string",
  "medicineGenericName": "string",
  "medicineDosageForm": "string",
  "medicineStrength": "string",
  "medicineManufacturer": "string"
}
```

## Medicine API Endpoints

### 1. Get All Medicines
- **GET** `/api/medicine`
- **Description**: Retrieve all medicines
- **Response**: Array of MedicineVM

### 2. Get Active Medicines (for Dropdown)
- **GET** `/api/medicine/active`
- **Description**: Retrieve active medicines for dropdown population
- **Response**: Array of MedicineVM

### 3. Get Medicine by ID
- **GET** `/api/medicine/{id}`
- **Description**: Retrieve a specific medicine by ID
- **Parameters**: 
  - `id` (int): Medicine ID
- **Response**: MedicineVM or 404 if not found

### 4. Search Medicines
- **GET** `/api/medicine/search?searchTerm={searchTerm}`
- **Description**: Search medicines by name, generic name, manufacturer, or dosage form
- **Parameters**: 
  - `searchTerm` (string): Search term
- **Response**: Array of MedicineVM

### 5. Get Medicines by Manufacturer
- **GET** `/api/medicine/manufacturer/{manufacturer}`
- **Description**: Get medicines from a specific manufacturer
- **Parameters**: 
  - `manufacturer` (string): Manufacturer name
- **Response**: Array of MedicineVM

### 6. Get Medicines by Dosage Form
- **GET** `/api/medicine/dosageform/{dosageForm}`
- **Description**: Get medicines with a specific dosage form
- **Parameters**: 
  - `dosageForm` (string): Dosage form (Tablet, Syrup, Injection, etc.)
- **Response**: Array of MedicineVM

## Prescription API Endpoints

### 1. Get All Prescriptions
- **GET** `/api/prescription`
- **Description**: Retrieve all prescriptions with grid data
- **Response**: Array of PrescriptionVM

### 2. Get Prescription by ID
- **GET** `/api/prescription/{id}`
- **Description**: Retrieve a specific prescription with grid data
- **Parameters**: 
  - `id` (int): Prescription ID
- **Response**: PrescriptionVM or 404 if not found

### 3. Get Prescription by Appointment ID
- **GET** `/api/prescription/appointment/{appointmentId}`
- **Description**: Get prescription for a specific appointment
- **Parameters**: 
  - `appointmentId` (int): Appointment ID
- **Response**: PrescriptionVM or 404 if not found

### 4. Create Prescription
- **POST** `/api/prescription`
- **Description**: Create a new prescription with multiple medicines
- **Body**: PrescriptionCreateVM
- **Response**: Created PrescriptionVM
- **Validation**: 
  - Validates medicine existence
  - Validates date ranges
  - Validates required fields

### 5. Create or Update Prescription for Appointment
- **POST** `/api/prescription/appointment`
- **Description**: Create new or update existing prescription for an appointment
- **Body**: PrescriptionCreateVM
- **Response**: PrescriptionVM

### 6. Update Prescription
- **PUT** `/api/prescription/{id}`
- **Description**: Update an existing prescription
- **Parameters**: 
  - `id` (int): Prescription ID
- **Body**: PrescriptionUpdateVM
- **Response**: Updated PrescriptionVM

### 7. Delete Prescription
- **DELETE** `/api/prescription/{id}`
- **Description**: Delete a prescription and all its details
- **Parameters**: 
  - `id` (int): Prescription ID
- **Response**: Success message

## Grid Operations (Prescription Details)

### 8. Add New Row to Grid
- **POST** `/api/prescription/{prescriptionId}/details`
- **Description**: Add a new medicine row to the prescription grid
- **Parameters**: 
  - `prescriptionId` (int): Prescription ID
- **Body**: PrescriptionDetailAddVM
- **Response**: Added PrescriptionDetailVM

### 9. Update Row in Grid (Inline Edit)
- **PUT** `/api/prescription/details/{prescriptionDetailId}`
- **Description**: Update an existing row in the prescription grid
- **Parameters**: 
  - `prescriptionDetailId` (int): Prescription detail ID
- **Body**: PrescriptionDetailUpdateVM
- **Response**: Updated PrescriptionDetailVM

### 10. Delete Row from Grid
- **DELETE** `/api/prescription/details/{prescriptionDetailId}`
- **Description**: Delete a row from the prescription grid
- **Parameters**: 
  - `prescriptionDetailId` (int): Prescription detail ID
- **Response**: Success message

### 11. Update Prescription Grid (Bulk Operation)
- **PUT** `/api/prescription/grid`
- **Description**: Update multiple rows in the prescription grid at once
- **Body**: PrescriptionGridOperationVM
- **Response**: Updated PrescriptionVM with grid data

### 12. Get Prescription Details
- **GET** `/api/prescription/{prescriptionId}/details`
- **Description**: Get all prescription details (grid rows) for a prescription
- **Parameters**: 
  - `prescriptionId` (int): Prescription ID
- **Response**: Array of PrescriptionDetailVM

## Additional Prescription Operations

### 13. Get Prescriptions by Patient
- **GET** `/api/prescription/patient/{patientId}`
- **Description**: Get all prescriptions for a specific patient
- **Parameters**: 
  - `patientId` (int): Patient ID
- **Response**: Array of PrescriptionVM

### 14. Get Prescriptions by Doctor
- **GET** `/api/prescription/doctor/{doctorId}`
- **Description**: Get all prescriptions by a specific doctor
- **Parameters**: 
  - `doctorId` (int): Doctor ID
- **Response**: Array of PrescriptionVM

### 15. Get Prescriptions by Date Range
- **GET** `/api/prescription/daterange?startDate={startDate}&endDate={endDate}`
- **Description**: Get prescriptions within a date range
- **Parameters**: 
  - `startDate` (datetime): Start date
  - `endDate` (datetime): End date
- **Response**: Array of PrescriptionVM

### 16. Search Prescriptions
- **GET** `/api/prescription/search?searchTerm={searchTerm}`
- **Description**: Search prescriptions by patient name, doctor name, or notes
- **Parameters**: 
  - `searchTerm` (string): Search term
- **Response**: Array of PrescriptionVM

## Grid Operations Details

### Supported Grid Operations:
1. **Add a new row**: Add new medicine to prescription
2. **Edit inline**: Edit existing rows with dropdowns, textboxes, and date pickers
3. **Delete row**: Remove medicine from prescription

### Grid Columns:
1. **Medicine**: Dropdown populated from `/api/medicine/active`
2. **Dosage**: Free text input (e.g., "2x daily")
3. **Start Date**: Date picker
4. **End Date**: Date picker
5. **Notes**: Editable text cell

### Grid Validation:
- Medicine must exist in database
- Start date cannot be after end date
- All required fields must be filled
- Dosage format validation

## Example Usage

### Create a Prescription with Multiple Medicines
```bash
POST /api/prescription
Content-Type: application/json

{
  "appointmentId": 1,
  "generalNotes": "Patient has mild fever",
  "followUpInstructions": "Return if symptoms worsen",
  "prescriptionDetails": [
    {
      "medicineId": 1,
      "dosage": "2x daily",
      "startDate": "2024-01-15T00:00:00Z",
      "endDate": "2024-01-22T00:00:00Z",
      "notes": "Take with food"
    },
    {
      "medicineId": 2,
      "dosage": "1x daily",
      "startDate": "2024-01-15T00:00:00Z",
      "endDate": "2024-01-29T00:00:00Z",
      "notes": "Take at bedtime"
    }
  ]
}
```

### Add New Row to Grid
```bash
POST /api/prescription/1/details
Content-Type: application/json

{
  "medicineId": 3,
  "dosage": "3x daily",
  "startDate": "2024-01-15T00:00:00Z",
  "endDate": "2024-01-21T00:00:00Z",
  "notes": "Take before meals"
}
```

### Update Grid Row (Inline Edit)
```bash
PUT /api/prescription/details/5
Content-Type: application/json

{
  "id": 5,
  "prescriptionId": 1,
  "medicineId": 1,
  "dosage": "3x daily",
  "startDate": "2024-01-15T00:00:00Z",
  "endDate": "2024-01-25T00:00:00Z",
  "notes": "Updated dosage"
}
```

### Get Active Medicines for Dropdown
```bash
GET /api/medicine/active
```

### Get Prescription with Grid Data
```bash
GET /api/prescription/1
```

## Error Responses
- **400 Bad Request**: Validation errors or business logic violations
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

## Integration with Appointment System
- Prescriptions are linked to appointments via `appointmentId`
- Each appointment can have one prescription
- Prescription can have multiple medicines (grid rows)
- Prescription inherits patient and doctor information from appointment

## Database Tables Created
1. **Medicines**: Medicine master data
2. **Prescriptions**: Prescription header
3. **PrescriptionDetails**: Prescription grid rows (medicines)

The prescription system is now fully integrated and ready to use with comprehensive grid operations for managing multiple medicines per appointment!
