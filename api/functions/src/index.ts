// TODO ENGANIA PICHANGA
/* eslint-disable */
import * as functions from "firebase-functions";
import express from "express";
import { RuntimeOptions } from "firebase-functions";
import topics from "./topics";
import emails from "./emails";

// import admin from "firebase-admin";

// import { initializeApp } from "firebase-admin/app";



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
app.use(emails);
app.use(topics);




const runtimeOpts: RuntimeOptions = {
  timeoutSeconds: 60,
  memory: "256MB",
};

export const api = functions.runWith(runtimeOpts).https.onRequest(main);



import { sendMails } from "./emails";


export const scheduledFunction = functions.pubsub.schedule('0 17 * * *').timeZone('Europe/Brussels').onRun(  (context) => {
  sendMails();
});
