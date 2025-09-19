export class SalesOrder{
    id: number = 0;
    pharmacyId: number = 0;
    totalOrder: number = 0;
    deliveryDate: Date = new Date();
    doctorId: number = 0;
    salesTypeId: number = 0;
    currencyId: number = 0;
    distributerId: number = 0;
    ordersList: OrderItem[] = []
}

export class OrderItem {
    productId: number = 0;
    orderTp: number = 0;
    orderQty: number = 0;
    oderTtp: number = 0;
    tpWithVat: number = 0;
  }