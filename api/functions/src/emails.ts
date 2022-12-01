/* eslint-disable */
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
      user: 'outoforderapp@gmail.com',
      pass: 'fyanmzcllnkjxzbd'
  }
});


const sendMail = (email:string) => {
  const mailOptions = {
    from: `outoforderapp@gmail.com`,
    to: email,
    subject: 'OOO PROPOSITION',
    html: `<h1>go to outoforder app and see what is it about</h1>`
    //  <p> <b>User: </b>${email} </p>`
  };

  return transporter.sendMail(mailOptions, (error:any, data:any) => {
      // console.log(data);
    if (error) {
      console.log(error)
      return
  }
  });

}


export const sendMails = async () => {

  console.log('send mail running');
  let dow = moment().day();
  let topic0: any[] = [];
  let topic1: any[] = [];
  let topic2: any[] = [];

  const snapshot = await db.collection('emailusers').get();
    snapshot.forEach((doc: any) => {
      let data = doc.data();

      switch(data.topicId){
          case '0':
          topic0.push(data.email)
          break;
          case '1':
            topic1.push(data.email);
          break;
          case '2':
            topic2.push(data.email);
          break;

      }

  });

  // sendMail('aboiledtiger@gmail.com');
  /*
  */

    if(dow == 1){  // 1XWEEK on mondays
      topic0.forEach((email)=>{
        sendMail(email);
      })
    }

    if(dow == 2 || dow == 4){ // 2XWEEK tue/thurs
      topic1.forEach((email)=>{
        sendMail(email);
      })
    }

    if(dow == 1 || dow == 3 || dow == 5){
      topic2.forEach((email)=>{
        sendMail(email);
      })
    }



  console.log(topic0, topic1, topic2);
  console.log(dow);

  return 'byebye';
}

export default emails;
