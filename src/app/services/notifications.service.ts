import { Injectable } from "@angular/core";
import { getToken, Messaging, onMessage } from "@angular/fire/messaging";
import { Router } from "@angular/router";
import { ModalController, ToastController } from "@ionic/angular";
import { from, Observable } from "rxjs";
import { map, share, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { NotificationsBlockedComponent } from "../modals/notifications-blocked/notifications-blocked.component";

@Injectable({
  providedIn: "root",
})
export class NotificationsService {
  token;
  message;

  constructor(
    private afMessaging: Messaging,
    public toastController: ToastController,
    private router: Router,
    private modalCtrl: ModalController
  ) {
    // this.subscribeToFCM(this.afMessaging);
    // this.token.subscribe();
    // subscribe to foreground messages
    // this.message
  }

  public subscribeToFCM() {
    this.token = from(
      navigator.serviceWorker.ready
        .then((serviceWorkerRegistration) =>
          getToken(this.afMessaging, {
            serviceWorkerRegistration,
            vapidKey: environment.firebase.vapidKey,
          })
        )
        .catch(async (error) => {
          this.modalCtrl.getTop().then((modal) => {            
            if(modal) this.modalCtrl.dismiss()
          }) 
          const modal = await this.modalCtrl.create({
            component: NotificationsBlockedComponent,
          });
          modal.present();
        })
    )
      .pipe(
        tap((token) => {
          console.log("FCM", { token })
          this.modalCtrl.getTop().then((modal) => {            
            if(modal) this.modalCtrl.dismiss()
          }) 
        }),
        share(),

      )
      .subscribe();

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

  public promptNotifications() {
    console.log("notification permission:", Notification.permission);
    if (Notification.permission === "default") {
      return Notification.requestPermission().then((permission) => {
        console.log(permission); // "granted", "default", "blocked"
        // If the user accepts
        if (permission === "granted") {
          return true;
        }
        // If the user clicks away or clicks "Block"
        return false;
      });
    } else if (Notification.permission === "denied") {
      // if the permissions are blocked, we cannot open the option - the user must do it manually
      window.confirm(
        "Your browser is blocking notifications. Click the 🔒 icon in the URL bar to change your notification preferences."
      );
      return false;
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
