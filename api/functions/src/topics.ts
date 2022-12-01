/* eslint-disable */
import { messaging } from 'firebase-admin';
import { from, map, forkJoin } from 'rxjs';

const express = require('express');
const topics = express();

topics.get('/topics', async (req: any, res: any) => {
  console.log('Hello topics');
  res.status(200).send('hello from topics');
});

// Subscribe the devices corresponding to the registration tokens to the
// topic.
// https://stackoverflow.com/questions/37367292/how-to-create-topic-in-fcm-notifications
topics.post('/topics/subscribe', async (req: any, res: any) => {
  const token = req.body.token;
  const topic = req.body.topic;
  messaging()
    .subscribeToTopic(token, topic)
    .then((response) => {
      // See the MessagingTopicManagementResponse reference documentation
      // for the contents of response.
      console.log('Successfully subscribed to topic:', response);
      res.send(response);
    })
    .catch((error) => {
      console.log('Error subscribing to topic:', error);
      res.status(500).send(error);
    });
});

topics.post('/topics/unsubscribeAll', async (req: any, res: any) => {
  const token = req.body.token;
  const topics = ['daily', 'twice', 'three', 'random'];

  let results: any = [];
  forkJoin(
    topics.map((topic) =>
      from(
        messaging()
          .unsubscribeFromTopic(token, topic)
          .then((result) => results.push(result))
      )
    )
  )
    .pipe(
      map(() => {
        res.status(200).send(results);
      })
    )
    .subscribe();
});


export default topics;
