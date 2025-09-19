export class IMSMenu {
    id: number = 0;
    parentId: number = 0;  // Assuming default value as 0, similar to id
    title: string = '';
    type: string = '';
    url: string = '';
    icon: string = '';
    target: boolean = false;
    breadcrumbs: boolean = false;
    classes: string = '';
    isActive: boolean = true;
    userId: string = '';
}