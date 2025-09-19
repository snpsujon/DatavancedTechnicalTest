export class Pharmacy {
    id: number = 0;
    name: string = '';
    address: string = '';
    phoneNumber: string = '';
    email: string = '';
    licenseNumber: string = '';
    openingHours: Date = new Date(); // Use Date type for ISO 8601 strings
    deliveryAvailable: boolean = false; // Can be 0 (false) or 1 (true)
    website: string = '';
    paymentOptions: string = '';
  }
  