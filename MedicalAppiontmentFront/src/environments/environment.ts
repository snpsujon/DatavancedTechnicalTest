import packageInfo from '../../package.json';

export const environment = {
  //Development Environment on 26-11-2024
  //appVersion: packageInfo.version,
  //production: true,
  //  apiUrl: 'https://dermosalesbackend.techstdio.com/api/v1.0/',
  //   reportUrl:'https://dermosalesbackend.techstdio.com/',
  //    signalRUrl:'https://dermosalesbackend.techstdio.com//Hub',
  //   uploadFileUrl:'D:/project/Inventory-Front/src/assets/images/uploadedImages'

  //Test Live Environment on 26-11-2024
  appVersion: packageInfo.version,
  production: false,
  apiUrl: 'https://localhost:7203/api/',
  reportUrl: 'https://localhost:7203/',
  signalRUrl: 'https://localhost:7203/Hub',
  appsApiUrl: 'https://localhost:7203/api/apps/v1.0/',
  uploadFileUrl: 'D:/project/Inventory-Front/src/assets/images/uploadedImages'
};
