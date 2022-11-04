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
  
  let email = req.body.email;
  // let topicId = req.body.topicId;

  // console.log(db);
    let emails = db.collection('emailusers')
    let snapshot =  await emails.where('email', '==', email).get()

      if (snapshot.empty) {
        await db.collection('emailusers').doc().set(req.body);
        res.status(200).send({
          msg: `Added: ${req.body}`
        });
      }else{
        let files: FirebaseFirestore.DocumentData[] = [];
        snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
          files.push(doc.data())
        });
        res.status(200).send(files);    
      }})    


export default emails;
