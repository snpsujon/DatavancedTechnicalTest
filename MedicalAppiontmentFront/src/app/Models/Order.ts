export class Order {
    productId?: number | null;
    orderTp?: number | null;
    orderQty?: number | null;
    oderTtp?: number | null;
    tpWithVat?: number | null;
  }
  
  export class OrderModel {
    id?: number | null;
    pharmacyId?: number | null;
    totalOrder?: number | null;
    deliveryDate?: string | null;
    doctorId?: number | null;
    salesTypeId?: number | null;
    currencyId?: number | null;
    isActive?: boolean | null;
    user?: string | null;
    ordersList?: Order[];
  }
  