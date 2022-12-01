/* eslint-disable */
import * as admin from 'firebase-admin';
const serviceAccount = require("./../outoforder-2022-firebase-adminsdk-tj6ui-daadd8db23.json");

export default admin.initializeApp({
    // credential: applicationDefault(),
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
  });


