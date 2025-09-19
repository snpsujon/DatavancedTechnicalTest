export class PurchaseItem {
    id: number=0;
    purchaseOrderId: number=0;
    productId: number=0;
    quantity: number=0;
    unitPrice: number=0;
    totalPrice: number=0;
}


export class PurchaseOrder {
    id: number =0;
    orderDate: Date = new Date();
    supplierId: number =0;
    totalAmount: number =0;
    shippingCost: number =0;
    paymentMethodId: number =0;
    purchasList: PurchaseItem[] =[];
}