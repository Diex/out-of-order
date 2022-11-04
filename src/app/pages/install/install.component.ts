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
  osua;

  ngOnInit() {
    this.store.get('store').then((store) => {
      if (store.os === 'android') {
        if (store.ua !== 'chrome') {
          this.string = 'please use chrome';
          this.osua = 'andxxx';
        } else {
          this.osua = 'andchr';
          this.string = ''
          
        }
      } else if (store.os === 'ios') {
        if (store.ua !== 'safari') {
          this.string = 'please use safari';
          this.osua = 'iosxxx'
        } else {
          this.string = 'how to install safari';
          this.osua = 'iossafa'
        }
      } else {
        // don't know...
        this.string = 'please use a mobile device'
      }
    });
  }
}
