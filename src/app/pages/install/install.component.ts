import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-install',
  templateUrl: './install.component.html',
  styleUrls: ['./install.component.scss'],
})
export class InstallComponent implements OnInit {
  constructor(private store: StorageService) {}
  string;

  ngOnInit() {
    this.store.get('store').then((store) => {
      if (store.os === 'android') {
        if (store.ua !== 'chrome') {
          this.string = 'please use chrome';
        } else {
          this.string = 'how to install chrome';
        }
      } else if (store.os === 'ios') {
        if (store.ua !== 'safari') {
          this.string = 'please use safari';
        } else {
          this.string = 'how to install safari';
        }
      } else {
        // don't know...
        this.string = 'please use a mobile device'
      }
    });
  }
}
