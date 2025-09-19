import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  apiUrl: 'https://quickmed.snpsujon.me/api/v1.0/',
  reportUrl:'https://quickmed.snpsujon.me/',
  signalRUrl :'https://quickmed.snpsujon.me/Hub',
  appsApiUrl :'https://quickmed.snpsujon.me/api/apps/v1.0/',
  uploadFileUrl:'D:/project/Inventory-Front/src/assets/images/uploadedImages'

  // apiUrl: 'https://salesapi.dermolive.com.bd/api/v1.0/',
  // reportUrl:'https://salesapi.dermolive.com.bd/',  
  //  signalRUrl:'https://sales.dermolive.com.bd/Hub',
  // uploadFileUrl:'D:/project/Inventory-Front/src/assets/images/uploadedImages'

};
