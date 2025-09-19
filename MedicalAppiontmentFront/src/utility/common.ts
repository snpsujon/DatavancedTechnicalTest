import { appsApiUrl, baseUrl } from "./config";

function createUrl(subUrl:any){
    return baseUrl + subUrl;
}
export {createUrl}


function createAppsUrl(subUrl:string) {
    return appsApiUrl + subUrl;
}
export {createAppsUrl}