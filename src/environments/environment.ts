// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: 'outoforder-2022',
    appId: '1:880867423776:web:e91552cc1137b0d445ee45',
    storageBucket: 'outoforder-2022.appspot.com',
    apiKey: 'AIzaSyCsNGEKM0hMfvZcmFNQgksxTMPgPinMqtc',
    authDomain: 'outoforder-2022.firebaseapp.com',
    messagingSenderId: '880867423776',
    measurementId: 'G-YW9BKP3XLH',
    vapidKey:'BAinc6xTO7YNk0g6lJ172vqPGFqUo_1XUX9_re2TuOt2CX5MyjrlFcff3JE91H43MTerM1i-p3fkQPOnVHUqttA',
    api: 'http://localhost:5001/outoforder-2022/us-central1/api/v1'
  },
  production: true // hack
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
