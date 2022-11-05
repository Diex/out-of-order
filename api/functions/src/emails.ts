
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


      const nodemailer = require('nodemailer');
      const moment = require('moment');

var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
      user: 'developer.viset@gmail.com',
      pass: 'mkzaphfsampxjupn'
  }
});



export const sendMails = async () => {

  console.log('send mail running');
  let dow = moment().day();
  let topic1: any[] = [];
  let topic2: any[] = []; 
  let topic3: any[] = [];

  const snapshot = await db.collection('users').get();
    snapshot.forEach((doc) => {
      let data = doc.data();

      if(data.topicId == 0) { 
        topic1.push(data.email)
      }
      // 

      if(data.topicId == 1 && (dow == 2 || dow == 5)) {
        topic2.push(data.email)
      }

      if(data.topicId == 2 && (dow == 1 || dow == 3 || dow == 5)) {
        topic3.push(data.email)
      }

      console.log(topic1, topic2, topic3);
  });



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
});
}

export default emails;
