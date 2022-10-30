import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-postinstall',
  templateUrl: './postinstall.component.html',
  styleUrls: ['./postinstall.component.scss'],
})
export class PostinstallComponent implements OnInit {
  installing = true;
  constructor() { }

  ngOnInit() {

    // this.store.get('store').then((store) => {
    //   this.store.set('store', {
    //     ...store,
    //     displayMode: 'standalone',
    //   });
      
    // });
    
  }

}
