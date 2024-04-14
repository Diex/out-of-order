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
          this.string = 'USE CHROME';
          this.osua = 'andxxx';
        } else {
          this.osua = 'andchr';
          this.string = ''
          
        }
      } else if (store.os === 'ios') {
        if (store.ua !== 'safari') {
          this.string = 'USE SAFARI';
          this.osua = 'iosxxx'
        } else {
          this.string = 'HOW TO INSTALL SAFARI';
          this.osua = 'iossafa'
        }
      } else {
        // don't know...
        this.osua = 'unknown';
        this.string = 'USE A MOBILE DEVICE';
      }
    });
  }
}
