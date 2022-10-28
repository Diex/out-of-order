import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  notifications ;
  

  constructor(private store:StorageService) { }

  ngOnInit() {
    this.store.get('store').then((store) => {
      if(store?.notifications){
        this.notifications = store.notifications
      }
    });
  }

  updateNotifications(event){
      console.log(event.detail.value)
      this.store.get('store').then((store) => {
        this.store.set('store', {
          ...store,
          notifications: event.detail.value
        });                        
      });

      console.log(this.notifications)
  }

}
