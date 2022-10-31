// TODO ENGANIA PICHANGA
/* eslint-disable */ 
import * as functions from "firebase-functions";
import express from "express";
import { RuntimeOptions } from "firebase-functions";
import topics from "./topics";
import admin from "firebase-admin";

import { initializeApp } from "firebase-admin/app";

const serviceAccount = require("./../outoforder-2022-firebase-adminsdk-tj6ui-daadd8db23.json");
const cors = require("cors");

const app = express();
const main = express();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
// firebase deploy --only functions
// export const api = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello api!");
// });

main.use("/v1", app);
main.use(express.json);
main.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(topics);

initializeApp({
  // credential: applicationDefault(),
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
});

const runtimeOpts: RuntimeOptions = {
  timeoutSeconds: 60,
  memory: "256MB",
};

export const api = functions.runWith(runtimeOpts).https.onRequest(main);
