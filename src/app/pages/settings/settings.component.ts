import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, ModalController, ToastController } from '@ionic/angular';
import { StorageService } from 'src/app/services/localstorage.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, AfterViewInit {

  settings ;
  ios = false;
  email = '';
  // savedEmail = '';

  @ViewChild(IonModal) modal: IonModal;


  constructor(private store:StorageService,private notifications:NotificationsService, private toast:ToastController) { }

   ngOnInit() {
    
   
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.store.get('store').then((store) => {
      if(store?.notifications){
        this.ios = store.os === 'ios' ? true : false;
        this.email = store.email;        
      }

      this.settings = store?.notifications;
      console.log(this.ios, this.email);
      if(this.ios) {      
        this.modal.present();
      }
    });
    
    
  }

  validateEmail(mail) 
  {
   if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
    {
      return (true)
    }
      // alert("You have entered an invalid email address!")
      return (false)
  }

  updateNotifications(event){
    console.log(event);
      this.store.get('store').then((store) => {
        this.store.set('store', {
          ...store,
          notifications: event.detail.value
        });                        
        console.log('os:', store.os, 'isAndroid', store.os === 'android');
        if(event.detail.value === 'null') {
          if(store.os === 'android') this.notifications.unsuscribe();  
          return;
        }
        if(store.os === 'android') this.notifications.subscribeToFCM(event.detail.value);
      });
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    if(this.validateEmail(this.email)){      
      this.store.get('store').then((store) => {
        this.store.set('store', {
          ...store,
          email: this.email
        })        
        this.modal.dismiss(this.email, 'confirm');
      });
    }else{
      this.presentToast("WRONG EMAIL")
    }
    
    
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
      duration: 1500,
      position: 'bottom'
    });

    await toast.present();
  }
}
