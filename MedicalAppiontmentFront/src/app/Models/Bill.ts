export class Bill {
    id?: number = 0;
    piId?: number = 0;
    billNumber?: string = '';
    billDate?: Date = new Date();
    supplierId?: number = 0;
    supplierName?: string = '';
    totalAmount?: number = 0;
    discount?: number = 0;
    taxAmount?: number = 0;
    netAmount?: number = 0;
    userid?: string = '';
    isActive?: boolean = true;
    billDetails?: BillDetail[] = [];
  }
  
  export class BillDetail {
    id?: number = 0;
    productId?: number = 0;
    quantity?: number = 0;
    unitPrice?: number = 0;
    totalPrice?: number = 0;
    remarks?: string = '';
  }
  