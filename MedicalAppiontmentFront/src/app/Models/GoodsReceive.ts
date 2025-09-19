export class GoodsReceived {
    id?: number = 0;
    pIId?: number = 0;
    receivedDate?: string = ''; // ISO date format
    receivedBy?: string = '';
    statusId?: number = 0;
    remarks?: string = '';
    userId?: string = '';
    isActive?: boolean = true;
    goodsReceivedDetails?: GoodsReceivedDetail[] = [];
  
  }
  
  export class GoodsReceivedDetail {
    id?: number = 0;
    goodsReceivedId?: number = 0;
    productId?: number = 0;
    receivedQuantity?: number = 0;
    damagedQuantity?: number = 0;
    remarks?: string = '';
    userId?: string = '';
    isActive?: boolean = true;
    goodsReceived?: string = '';
  
  }
  