import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss'],
})
export class InviteComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  async share() {
    const shareData = {
      title: 'Out Of Order',
      text: 'DEAR FRIEND COME ALONG LET’S GO ØUT ØF ØRDER',
      url: 'https://outoforder-2022.web.app',
    };

    try {
      await navigator.share(shareData);
      console.log('MDN shared successfully');
    } catch (err) {
      console.error(`Error: ${err}`);
      window.alert(`Can't share on this platform`);
    }
  }
}
