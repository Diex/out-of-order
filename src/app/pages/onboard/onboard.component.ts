import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
// import { StorageService } from 'src/app/services/localstorage.service';
// import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-onboard',
  templateUrl: './onboard.component.html',
  styleUrls: ['./onboard.component.scss'],
})
export class OnboardComponent implements OnInit {
  deferredPrompt;
  result: string;

  constructor(
    // private storage: StorageService,
    private router: Router
  ) {}

  ngOnInit() {
    // this.storage.get('store').then((store) => {
    //   if (store.displayMode === 'standalone') {
    //     // si ya estoy instalada me voy al home (podría usar un guard)
    //     this.router.navigate(['pages/home'])
    //   }
    // });
  }

  click(event) {
    console.log(event);
    this.router.navigate(['pages/install']);
  }
}
