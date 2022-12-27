// TODO ENGANIA PICHANGA
/* eslint-disable */
import * as functions from "firebase-functions";
import express from "express";
import { RuntimeOptions } from "firebase-functions";
import topics from "./topics";
import emails from "./emails";



const cors = require("cors");

const app = express();
const main = express();


main.use("/v1", app);
main.use(express.json);
main.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(emails);
app.use(topics);

app.get('/akg', async (req: any, res: any) => {
  console.log('Hello API');
  res.status(200).send('hello from API');
})




const runtimeOpts: RuntimeOptions = {
  timeoutSeconds: 20,
  memory: "256MB",
};

export const api = functions.runWith(runtimeOpts).https.onRequest(main);



import { sendMails } from "./emails";


export const scheduledFunction = functions.pubsub.schedule('0 17 * * *').timeZone('Europe/Brussels').onRun(  (context) => {
  sendMails();
});
