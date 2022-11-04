// import { messaging } from 'firebase-admin';
// import { from, map, forkJoin } from 'rxjs';
import fb from './fb';

const express = require('express');
const emails = express();

// const firestore = require('@google-cloud/firestore');
const db = fb.firestore();

emails.get('/emails', async (req: any, res: any) => {
  console.log('Hello emails');
  res.status(200).send('hello from emails');
});

emails.post('/emails/subscribeToEmail', async (req: any, res: any) => {
  // console.log(db);
    db.collection('emailusers')
    .doc('ebTOqswbEVsPvnnxuvlK')
    .get()
    .then((doc:any) => {
      console.log(doc);
      if (!(doc && doc.exists)) {
        return res.status(404).send({
          error: 'Unable to find the document'
        });
      }else{
        res.status(200).send(doc.data());    
      }})    
});

export default emails;
