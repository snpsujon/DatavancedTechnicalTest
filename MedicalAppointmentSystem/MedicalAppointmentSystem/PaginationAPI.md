# Pagination API Documentation

## Overview
All list APIs in the Medical Appointment System now support dynamic pagination with `skip` and `take` parameters. This allows for efficient data loading and better performance when dealing with large datasets.

## Pagination Parameters

### Query Parameters
- **skip** (int, optional): Number of records to skip (default: 0)
- **take** (int, optional): Number of records to take (default: 50)

### Response Format
All paginated endpoints return data in the following format:
```json
{
  "data": [...],           // Array of actual data
  "totalCount": 150,       // Total number of records
  "skip": 0,               // Number of records skipped
  "take": 50,              // Number of records taken
  "hasMore": true,         // Whether there are more records available
  "totalPages": 3          // Total number of pages
}
```

## Updated Endpoints

### Medicine API

#### 1. Get All Medicines (Paginated)
- **GET** `/api/medicine?skip=0&take=50`
- **Parameters**: 
  - `skip` (int, optional): Records to skip (default: 0)
  - `take` (int, optional): Records to take (default: 50)
- **Response**: Paginated list of medicines

#### 2. Get Active Medicines (Paginated)
- **GET** `/api/medicine/active?skip=0&take=50`
- **Parameters**: 
  - `skip` (int, optional): Records to skip (default: 0)
  - `take` (int, optional): Records to take (default: 50)
- **Response**: Paginated list of active medicines

#### 3. Search Medicines (Paginated)
- **GET** `/api/medicine/search?searchTerm=aspirin&skip=0&take=50`
- **Parameters**: 
  - `searchTerm` (string): Search term
  - `skip` (int, optional): Records to skip (default: 0)
  - `take` (int, optional): Records to take (default: 50)
- **Response**: Paginated search results

#### 4. Get Medicines by Manufacturer (Paginated)
- **GET** `/api/medicine/manufacturer/Pfizer?skip=0&take=50`
- **Parameters**: 
  - `manufacturer` (string): Manufacturer name
  - `skip` (int, optional): Records to skip (default: 0)
  - `take` (int, optional): Records to take (default: 50)
- **Response**: Paginated medicines from manufacturer

#### 5. Get Medicines by Dosage Form (Paginated)
- **GET** `/api/medicine/dosageform/Tablet?skip=0&take=50`
- **Parameters**: 
  - `dosageForm` (string): Dosage form
  - `skip` (int, optional): Records to skip (default: 0)
  - `take` (int, optional): Records to take (default: 50)
- **Response**: Paginated medicines by dosage form

### Prescription API

#### 1. Get All Prescriptions (Paginated)
- **GET** `/api/prescription?skip=0&take=50`
- **Parameters**: 
  - `skip` (int, optional): Records to skip (default: 0)
  - `take` (int, optional): Records to take (default: 50)
- **Response**: Paginated list of prescriptions with grid data

#### 2. Get Prescriptions by Patient (Paginated)
- **GET** `/api/prescription/patient/1?skip=0&take=50`
- **Parameters**: 
  - `patientId` (int): Patient ID
  - `skip` (int, optional): Records to skip (default: 0)
  - `take` (int, optional): Records to take (default: 50)
- **Response**: Paginated patient prescriptions

#### 3. Search Prescriptions (Paginated)
- **GET** `/api/prescription/search?searchTerm=John&skip=0&take=50`
- **Parameters**: 
  - `searchTerm` (string): Search term
  - `skip` (int, optional): Records to skip (default: 0)
  - `take` (int, optional): Records to take (default: 50)
- **Response**: Paginated search results

### Appointment API

#### 1. Get All Appointments (Paginated)
- **GET** `/api/appointment?skip=0&take=50`
- **Parameters**: 
  - `skip` (int, optional): Records to skip (default: 0)
  - `take` (int, optional): Records to take (default: 50)
- **Response**: Paginated list of appointments

## Usage Examples

### Basic Pagination
```bash
# Get first 10 medicines
GET /api/medicine?skip=0&take=10

# Get next 10 medicines
GET /api/medicine?skip=10&take=10

# Get medicines 21-30
GET /api/medicine?skip=20&take=10
```

### Search with Pagination
```bash
# Search for "aspirin" with pagination
GET /api/medicine/search?searchTerm=aspirin&skip=0&take=20

# Get next page of search results
GET /api/medicine/search?searchTerm=aspirin&skip=20&take=20
```

### Filter with Pagination
```bash
# Get prescriptions for patient 1, first 25 records
GET /api/prescription/patient/1?skip=0&take=25

# Get next 25 prescriptions for patient 1
GET /api/prescription/patient/1?skip=25&take=25
```

## Frontend Integration

### JavaScript/TypeScript Example
```javascript
// Function to load paginated data
async function loadMedicines(page = 0, pageSize = 50) {
    const skip = page * pageSize;
    const response = await fetch(`/api/medicine?skip=${skip}&take=${pageSize}`);
    const result = await response.json();
    
    return {
        data: result.data,
        totalCount: result.totalCount,
        hasMore: result.hasMore,
        totalPages: result.totalPages,
        currentPage: page,
        pageSize: pageSize
    };
}

// Usage
const medicines = await loadMedicines(0, 20); // First page, 20 items
console.log(`Loaded ${medicines.data.length} of ${medicines.totalCount} medicines`);
console.log(`Page 1 of ${medicines.totalPages} total pages`);
console.log(`Has more: ${medicines.hasMore}`);
```

### React Example
```jsx
import { useState, useEffect } from 'react';

function MedicineList() {
    const [medicines, setMedicines] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const pageSize = 20;

    const loadMedicines = async (page) => {
        const skip = page * pageSize;
        const response = await fetch(`/api/medicine?skip=${skip}&take=${pageSize}`);
        const result = await response.json();
        
        setMedicines(result.data);
        setTotalCount(result.totalCount);
        setTotalPages(result.totalPages);
        setHasMore(result.hasMore);
        setCurrentPage(page);
    };

    useEffect(() => {
        loadMedicines(0);
    }, []);

    return (
        <div>
            <div>
                Showing {medicines.length} of {totalCount} medicines (Page {currentPage + 1} of {totalPages})
            </div>
            
            {medicines.map(medicine => (
                <div key={medicine.id}>{medicine.name}</div>
            ))}
            
            <div>
                <button 
                    onClick={() => loadMedicines(currentPage - 1)}
                    disabled={currentPage === 0}
                >
                    Previous
                </button>
                
                <span>Page {currentPage + 1}</span>
                
                <button 
                    onClick={() => loadMedicines(currentPage + 1)}
                    disabled={!hasMore}
                >
                    Next
                </button>
            </div>
            
            {/* Page numbers */}
            <div>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => loadMedicines(i)}
                        style={{
                            backgroundColor: i === currentPage ? '#007bff' : '#f8f9fa',
                            color: i === currentPage ? 'white' : 'black',
                            margin: '0 2px',
                            padding: '5px 10px',
                            border: '1px solid #dee2e6',
                            cursor: 'pointer'
                        }}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}
```

## Performance Benefits

### 1. Reduced Memory Usage
- Only loads the required number of records
- Prevents memory issues with large datasets

### 2. Faster Response Times
- Smaller payload sizes
- Reduced network transfer time
- Better user experience

### 3. Scalability
- Handles large datasets efficiently
- Database queries are optimized with OFFSET/FETCH
- Supports thousands of records without performance degradation

## Database Optimization

### SQL Server Pagination
All stored procedures use SQL Server's `OFFSET` and `FETCH NEXT` for efficient pagination:

```sql
SELECT * FROM TableName
ORDER BY ColumnName
OFFSET @Skip ROWS
FETCH NEXT @Take ROWS ONLY;
```

### Count Queries
Separate count stored procedures provide total record counts without loading data:
- `sp_GetMedicinesCount`
- `sp_GetPrescriptionsCount`
- `sp_GetAppointmentsCount`
- And many more...

## Best Practices

### 1. Default Page Size
- Default `take` value is 50 records
- Adjust based on your UI requirements
- Consider mobile vs desktop performance

### 2. Maximum Page Size
- Consider implementing a maximum `take` limit (e.g., 100)
- Prevents abuse and ensures performance

### 3. Caching
- Consider caching count results for better performance
- Cache frequently accessed data

### 4. Error Handling
```javascript
try {
    const response = await fetch('/api/medicine?skip=0&take=50');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    // Handle result
} catch (error) {
    console.error('Error loading medicines:', error);
}
```

## Migration Notes

### Breaking Changes
- All list endpoints now return paginated response format
- Response structure changed from array to object with pagination metadata

### Backward Compatibility
- Default parameters maintain existing behavior
- `skip=0&take=50` provides reasonable defaults
- Existing code will work with minimal changes

## Monitoring and Analytics

### Key Metrics to Track
- Average response time by page size
- Most common skip/take combinations
- Error rates for pagination requests
- Database query performance

### Logging
```javascript
// Log pagination usage
console.log(`Pagination request: skip=${skip}, take=${take}, totalCount=${totalCount}`);
```

The pagination system is now fully implemented across all APIs, providing efficient data loading and better user experience for large datasets!
