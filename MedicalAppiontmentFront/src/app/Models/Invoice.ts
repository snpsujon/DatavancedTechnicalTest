export class InvoiceDetail {
    productId: number = 0;
    quantity: number = 0;
    unitPrice: number = 0;
    totalPrice: number = 0;
  }
  
  export class Invoice {
    id: number = 0;
    pIDate: Date = new Date();
    totalAmount: number = 0;
    poId: number = 0;
    invoiceDetails: InvoiceDetail[] = [];
  }
  