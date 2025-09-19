export class Unit{
    id:number= 0;
    name: string='';
    shortCode: string='';
    description: string='';
}




export class AspnetUsers{
    id: string = '';
    email: string = '';
    mobile: string = '';
    password: string = '';
    userFName: string = '';
    userLName: string = '';
    userName: string = '';
    dateOfBirth: Date | null = new Date();
    genderId: number = 1;
    designationId: number = 0;
    userStatusId: number = 1;
    userTypeId: number = 1;
    status: boolean = true;
    distributerId: number = 0;
    regionId: number = 0;
    userRoleId: string = '';
    shiftId:number=0;
    parentUserId:string='';
    userDistributerDetails:SelectedDistributer[]=[];
    userRegionDetails:SelectedRegion []=[];
}
export class SelectedRegion{
    regionId:number=0
}
export class SelectedDistributer{
    distributerId:number=0;
}
export class AspNetRole {
    id: string = "";
    name: string = "";
    normalizedName:string="";
    concurrencyStamp:string="";
    AspNetRoleClaims:[]=[];
    selected:boolean=true;

}