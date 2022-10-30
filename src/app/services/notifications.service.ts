import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { getToken, Messaging, onMessage } from "@angular/fire/messaging";
import { Router } from "@angular/router";
import { ModalController, ToastController } from "@ionic/angular";
import { from, Observable } from "rxjs";
import { map, share, switchMap, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
// import { NotificationsBlockedComponent } from "../modals/notifications-blocked/notifications-blocked.component";

@Injectable({
  providedIn: "root",
})
export class NotificationsService {
  token;
  message;
 api;
  constructor(
    private afMessaging: Messaging,
    public toastController: ToastController,
    private router: Router,
    private modalCtrl: ModalController,
    private http: HttpClient
  ) {
    this.api = environment.firebase.api;
  }

  topics = ['daily', 'twice', 'three', 'random'];

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
          // this.modalCtrl.getTop().then((modal) => {            
          //   if(modal) this.modalCtrl.dismiss()
          // }) 
          // const modal = await this.modalCtrl.create({
          //   component: NotificationsBlockedComponent,
          // });
          // modal.present();
        })
    )
      .pipe(
        switchMap((token) => {
          console.log("FCM", { token })          
          return this.http.post(this.api+'/topics/subscribe', 
            {token, topic:this.topics[topicId]}).pipe(
            map(res => console.log(res))
          )
        }),
        share(),

      )
      .subscribe();


    // https://firebase.google.com/docs/cloud-messaging/js/receive
    this.message = new Observable((sub) =>
      onMessage(this.afMessaging, (it) => sub.next(it))
    )
      .pipe(
        map((message) => {
          console.log(message);
          this.displayToast(message["notification"]);
        })
      )
      .subscribe();
  }

  //https://alex-goff.medium.com/pwa-notifications-example-how-i-finally-got-it-to-work-9c9bfa89b2c1
  notifyMe2() {
    if (Notification.permission === 'default') {
      return Notification.requestPermission().then((permission) => {
        console.log(permission); // "granted", "default", "blocked"

        // If the user accepts
        if (permission === 'granted') {
          const notification = new Notification('Thank you!', {
            body: 'Out Of Order',
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
      console.log('notifications already granted')
      return true;
    }
  }

  handlerMessage = "";
  roleMessage = "";

  displayToast(notification) {
    this.toastController
      .create({
        header: notification.title,
        message: notification.body,
        position: "bottom",
        duration: 30000,
        // cssClass: 'toast-custom-class',
        buttons: [
          {
            text: "ONGOING",
            role: "info",
            handler: () => {
              this.router.navigate(["pages/ongoing"]);
            },
          },
          {
            text: "MEH...",
            role: "cancel",
            handler: () => {
              this.handlerMessage = "Dismiss clicked";
            },
          },
        ],
      })
      .then((toast) => {
        toast.present();
      });
  }
}
