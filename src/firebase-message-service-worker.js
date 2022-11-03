// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
// importScripts('/__/firebase/9.2.0/firebase-app-compat.js');
// importScripts('/__/firebase/9.2.0/firebase-messaging-compat.js');
// importScripts('/__/firebase/init.js');


//  * Here is is the code snippet to initialize Firebase Messaging in the Service
//  * Worker when your app is not hosted on Firebase Hosting.
 // Give the service worker access to Firebase Messaging.
 // Note that you can only use Firebase Messaging here. Other Firebase libraries
 // are not available in the service worker.
 importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js');
 importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js');

 // Initialize the Firebase app in the service worker by passing in
 // your app's Firebase config object.
 // https://firebase.google.com/docs/web/setup#config-object
 firebase.initializeApp({
    projectId: 'outoforder-2022',
    appId: '1:880867423776:web:e91552cc1137b0d445ee45',
    storageBucket: 'outoforder-2022.appspot.com',
    apiKey: 'AIzaSyCsNGEKM0hMfvZcmFNQgksxTMPgPinMqtc',
    authDomain: 'outoforder-2022.firebaseapp.com',
    messagingSenderId: '880867423776',
    measurementId: 'G-YW9BKP3XLH',
  });

 // Retrieve an instance of Firebase Messaging so that it can handle background
 // messages.
 const messaging = firebase.messaging();
 console.log(messaging);

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// Keep in mind that FCM will still show notification messages automatically 
// and you should use data messages for custom notifications.
// For more info see: 
// https://firebase.google.com/docs/cloud-messaging/concept-options
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  channel.postMessage({title: 'Hello from SW'});
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: './assets/icon/favicon.png'
  };

  // self.registration.showNotification(notificationTitle,
  //   notificationOptions);
});

// From service-worker.js:
// const channel = new BroadcastChannel('sw-messages');


self.addEventListener('notificationclick', (event) => {
  console.log("This is custom service worker notificationclick method.");
  console.log('Notification details: ', event.notification);
   // Close the notification popout
   event.notification.close();
   
   // Get all the Window clients
   event.waitUntil(clients.matchAll({ type: 'window' }).then((clientsArr) => {
     // If a Window tab matching the targeted URL already exists, focus that;
     const hadWindowToFocus = clientsArr.some((windowClient) => windowClient.url === '/#/pages/ongoing' ? (windowClient.focus(), true) : false);
     // Otherwise, open a new tab to the applicable URL and focus it.
     if (!hadWindowToFocus) clients.openWindow('/#/pages/ongoing').then((windowClient) => windowClient ? windowClient.focus() : null);
   }));
});


// self.addEventListener('push', (e) => { console.log(e) });

// messaging.onMessage( function (payload){
//   console.log('[firebase-messaging-sw.js] Received foreground message ', payload);
// })

