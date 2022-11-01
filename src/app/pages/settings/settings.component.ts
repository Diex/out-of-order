import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/localstorage.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  settings ;
  

  constructor(private store:StorageService,private notifications:NotificationsService) { }

  ngOnInit() {
    this.store.get('store').then((store) => {
      if(store?.notifications){
        this.settings = store.notifications
      }
    });
  }

  updateNotifications(event){
      this.store.get('store').then((store) => {
        this.store.set('store', {
          ...store,
          notifications: event.detail.value
        });                        
        if(event.detail.value === 'null') {
          this.notifications.unsuscribe();  
          return;
        }
        this.notifications.subscribeToFCM(event.detail.value);
      });
  }

}
