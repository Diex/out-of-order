import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, ModalController, ToastController } from '@ionic/angular';
import { StorageService } from 'src/app/services/localstorage.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, AfterViewInit {
  settings;
  ios;
  email = '';
  // savedEmail = '';

  @ViewChild(IonModal) modal: IonModal;
  showModal = false;

  constructor(
    private store: StorageService,
    private notifications: NotificationsService,
    private toast: ToastController,
    private router: Router,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.store.get('store').then((store) => {
      console.log(store);
      this.ios = store.os === 'ios' ? true : false;
      this.email = store.email ? store.email : '';
      this.settings = store?.notifications;
      console.log(this.ios, this.email);
      if (this.ios) {
        this.modal.present();
        // this.showModal = true;
      }
    });
  }

  validateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    }
    // alert("You have entered an invalid email address!")
    return false;
  }

  updateNotifications(event) {
    console.log(event);
    this.store.get('store').then((store) => {
      this.store.set('store', {
        ...store,
        notifications: event.detail.value,
      });
      console.log('os:', store.os, 'isAndroid', store.os === 'android');
      if (store.os === 'android') {
        if (event.detail.value === '3') {
          if (store.os === 'android') this.notifications.unsuscribe();
        } else {
          if (store.os === 'android')
            this.notifications.subscribeToFCM(event.detail.value);
        }
      } else {
        // ios subscribe mail
        if (store.email && event.detail.value)
          this.notifications.susbscribeToEmail(event.detail.value, store.email);
      }
    });

    this.router.navigate(['/pages/home']);
    console.log('done');

    let texts = ['1XWEEK SET', '2XWEEK SET', '3XWEEK SET', 'SUBSCRIPTION REMOVED']
    this.presentToast(texts[event.detail.value]);
  }

  cancel() {
    // this.modal.dismiss(null, 'cancel');
    this.modalCtrl.getTop().then((modal) => modal.dismiss());
  }

  close() {
    // por ahora no hago nada...
    this.router.navigate(['/pages/home']);
  }
  confirm() {
    console.log(this.email);
    if (this.validateEmail(this.email)) {
      this.store.get('store').then((store) => {
        this.store.set('store', {
          ...store,
          email: this.email,
        });
      });
    } else {
      this.presentToast('WRONG EMAIL');
    }

    // this.modal.dismiss();
    // this.modalCtrl.dismiss()
    this.cancel();
  }

  openModal() {
    this.modal.present();

    // const { data, role } = await modal.onWillDismiss();

    // if (role === 'confirm') {
    //   this.message = `Hello, ${data}!`;
    // }
  }

  async presentToast(text) {
    const toast = await this.toast.create({
      message: text,
      duration: 4000,
      position: 'bottom',
      cssClass: 'ion-toast-custom',
    });

    await toast.present();
  }
}
