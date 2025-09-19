export class RequisitionDetails {
    id?: number;
    requsitionOrderId?: number;
    productId?: number;
    quantity?: number;
    unitPrice?: number;
    totalPrice?: number;
}

export class Requisition {
    id?: number;
    orderDate?: Date;
    wingsId?: number;
    totalAmount?: number;
    userId?: string;
    isActive?: boolean;
    requisitionList?: RequisitionDetails[];
}
