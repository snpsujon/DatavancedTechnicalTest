export class DeliveryOrder {
    id?: number | null;
    dONo?: string | null;
    soId?: number | null;
    deliveryDate?: Date  = new Date();
    wareHouseId?: number | null;
    paymentMethodId?: number | null;
    deliveryVehicleId?: number | null;
    remarks?: string | null;
    userId?: string | null;
    isDelete?: boolean | null;
    isActive?: boolean | null;
  
    
  }
  