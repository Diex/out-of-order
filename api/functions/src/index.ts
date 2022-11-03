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

const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
      user: 'developer.viset@gmail.com',
      pass: 'mkzaphfsampxjupn'
  }
});


export const scheduledFunction = functions.pubsub.schedule('every 5 minutes').onRun((context) => {
  console.log('This will be run every 5 minutes!');

  const mailOptions = {
    from: `developer.viset@gmail.com`,
    to: 'aboiledtiger@gmail.com',
    subject: 'contact form message',
    html: `<h1>Order Confirmation</h1>
     <p> <b>Email: </b>testing </p>`
};
  return transporter.sendMail(mailOptions, (error:any, data:any) => {
    console.log(data);
    if (error) {
      console.log(error)
      return
  }
  // console.log("Sent!")
});

  return null;
});