export class DoctorDegree {
    id: number = 0;
    doctorId: number = 0;
    degreeId: number = 0;
  }
  
  export class DoctorSpeciality {
    id: number = 0;
    doctorId: number = 0;
    specialityId: number = 0;
  }
  
  export class DoctorBrand {
    id: number = 0;
    doctorId: number = 0;
    brandId: number = 0;
  }
  
  export class DoctorSpecialDay {
    id?: number = 0;
    doctorId?: number = 0;
    specialDayId?: number = 0;
    specialDate?: string = "";
    specialDayName?: string = "";
  }
  
  export class DoctorChamber {
    id: number = 0;
    doctorId: number = 0;
    chamberId: number = 0;
    chamber: string = "";
  }
  
  export class Doctor {
    id: number = 0;
    name: string = "";
    address: string = "";
    designationId: number = 0;
    doctorCategoryId: number = 0;
    chamberId: number = 0;
    phone: string = "";
    email: string = "";
    zoneId: number = 0;
    areaId: number = 0;
    territoryId: number = 0;
    marketId: number = 0;
    userId: string = "";
    isActive: boolean = true;
    degrees: DoctorDegree[] = [];
    specialities: DoctorSpeciality[] = [];
    brands: DoctorBrand[] = [];
    specialDays: DoctorSpecialDay[] = [];
    chambers: DoctorChamber[] = [];
  }
  