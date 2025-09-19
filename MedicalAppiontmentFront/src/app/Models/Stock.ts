export class StockDetail {
    qty?: number | null;
  }
  
  export class StockModel {
    id?: number | null;
    pIId?: number | null;
    productId?: number | null;
    stockCode?: string | null;
    batchNumber?: string | null;
    quantity?: number | null;
    purchaseRate?: number | null;
    stockRate?: number | null;
    expiryDate?: string | Date | null;
    transitQty?: number | null;
    manufacturarDate?: string | Date | null;
    userId?: string | null;
    stockDetails?: StockDetail[] | null;
  }
  

  export class productTargetDetails {
    qty?: number | null;
    productId?: number | null;
  }
  
  export class ProductTargetVM {
    id?: number | null;
    targetFor?: string | null;
    targetStart?: string | Date | null;
    targetEnd?: string | Date | null;
    productTargetDetails?: productTargetDetails[] | null;
  }
  export class FlatTargetVM {
    id?: number | null;
    targetFor?: string | null;
    targetAmount?: number | null;
    targetStart?: string | Date | null;
    targetEnd?: string | Date | null;
  }
  