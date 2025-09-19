export class Company {
  id: number=0;
  name: string='';
  parentId: number=0;
  address: string='';
  phoneNumber: string='';
  email: string='';
  website: string='';
  registrationNumber: string='';
  taxId: string='';
  logo: string='';
  isActive:boolean=true;
  }
  


  export class WareHouse{
    id:number =0;
    wareHouseName :string ='';
    branchId :number=0;
    isActive:boolean =true;
  }



  export class InvoiceDetail {
    productId: number = 0;
    quantity: number = 0;
    unitPrice: number = 0;
    totalPrice: number = 0;
  }
  
  export class PurchaseInvoice {
    id: number = 0;
    pIDate: Date = new Date();
    totalAmount: number = 0;
    poId: number = 0;
    userId: string = '';
    isActive: boolean = true;
    invoiceDetails: InvoiceDetail[] = [];
  }
  