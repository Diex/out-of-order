
import fb from './fb';

const express = require('express');
const emails = express();

const db = fb.firestore();

emails.get('/emails', async (req: any, res: any) => {
  console.log('Hello emails');
  res.status(200).send('hello from emails');
});

emails.post('/emails/subscribeToEmail', async (req: any, res: any) => {
  
  let email = req.body.email;
    let emails = db.collection('emailusers')
    let snapshot =  await emails.where('email', '==', email).get()
      if (snapshot.empty) {
        await db.collection('emailusers').doc().set(req.body);
        res.status(200).send({
          msg: `Added: ${req.body}`
        });
      }else{
        snapshot.docs[0].ref.update(req.body);
        res.status(200).json({updated: `${req.body.email}`});    
      }})    


export default emails;
