import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getToken, Messaging, onMessage } from '@angular/fire/messaging';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { concat, from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  token;
  message;
  api;
  constructor(
    private afMessaging: Messaging,
    public toastController: ToastController,
    private router: Router,
    private http: HttpClient
  ) {
    this.api = environment.firebase.api;
    this.communications();
  }

  topics = ['daily', 'twice', 'three', 'random'];

  // https://stackoverflow.com/questions/42127148/service-worker-communicate-to-clients
  public communications() {
    // From your client pages:
    const channel = new BroadcastChannel('sw-messages');
    channel.addEventListener('message', (event) => {
      console.log('Received', event.data);
    });
  }

  public unsuscribe() {
    
    // https://firebase.google.com/docs/reference/js/messaging_
    this.token = from(
      navigator.serviceWorker.ready
        .then((serviceWorkerRegistration) =>
          getToken(this.afMessaging, {
            serviceWorkerRegistration,
            vapidKey: environment.firebase.vapidKey,
          })
        )
        .catch(async (error) => {
          console.log(error);
        })
    )
      .pipe(
        switchMap((token) => {
          console.log('FCM unsuscribed:', { token });
          return this.http
            .post(this.api + '/topics/unsubscribeAll', { token })
            .pipe(map((res) => console.log(res)));
        })
      )
      .subscribe();
  }

  public subscribeToFCM(topicId) {
    // https://firebase.google.com/docs/reference/js/messaging_
    this.token = from(
      navigator.serviceWorker.ready
        .then((serviceWorkerRegistration) =>
          getToken(this.afMessaging, {
            serviceWorkerRegistration,
            vapidKey: environment.firebase.vapidKey,
          })
        )
        .catch(async (error) => {
          console.log(error);
        })
    )
      .pipe(
        switchMap((token) => {
          console.log('FCM', { token, topic: this.topics[topicId] });
          return concat(
            this.http
              .post(this.api + '/topics/unsubscribeAll', { token })
              .pipe(map((res) => console.log(res))),
            this.http
              .post(this.api + '/topics/subscribe', {
                token,
                topic: this.topics[topicId],
              })
              .pipe(map((res) => console.log(res)))
          );
        })
      )
      .subscribe();

    // https://firebase.google.com/docs/cloud-messaging/js/receive
    this.message = new Observable((sub) =>
      onMessage(this.afMessaging, (it) => sub.next(it))
    )
      .pipe(
        map((message) => {
          console.log('onMessage:', message);
          this.displayToast(message['notification']);
        })
      )
      .subscribe();
  }

  handlerMessage = '';
  roleMessage = '';

  displayToast(notification) {
    this.toastController
      .create({
        header: notification.title,
        message: notification.body,
        position: 'bottom',
        duration: 30000,
        // cssClass: 'toast-custom-class',
        buttons: [
          {
            text: 'ONGOING',
            role: 'info',
            handler: () => {
              this.router.navigate(['pages/ongoing']);
            },
          },
          {
            text: 'CANCEL',
            role: 'cancel',
            handler: () => {
              this.handlerMessage = 'Dismiss clicked';
            },
          },
        ],
      })
      .then((toast) => {
        toast.present();
      });
  }
  //https://alex-goff.medium.com/pwa-notifications-example-how-i-finally-got-it-to-work-9c9bfa89b2c1
  notifyMe2() {
    console.log('request notification permission...');
    if (Notification.permission === 'default') {
      return Notification.requestPermission().then((permission) => {
        console.log(permission); // "granted", "default", "blocked"
        // If the user accepts
        if (permission === 'granted') {
          const notification = new Notification('Thank you!', {
            body: 'Out Of Order',
            image: './assets/imgs/image.png',
            icon: './assets/icon/favicon.png',
          });
          notification.onclick = () =>
            console.log('user gran permission for notifications');
          return true;
        }
        // If the user clicks away or clicks "Block"
        return false;
      });
    } else if (Notification.permission === 'denied') {
      // if the permissions are blocked, we cannot open the option - the user must do it manually
      window.confirm(
        'Your browser is blocking notifications. Change your notification preferences.'
      );
      return false;
    } else {
      // hence permission is already "granted"
      console.log('notifications already granted');
      return true;
    }
  }
}
