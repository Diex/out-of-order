import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { StorageService } from './services/localstorage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    // private swUpdate: SwUpdate,
    private store: StorageService,
    public platform: Platform,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.platform.ready().then(() => {
      console.log('platform ready');
      let os = this.findOs(this.platform.platforms());
      let mode = this.getPWADisplayMode();
      let name_browser = this.findname_browser();
      let ver_browser = this.findver_browser();
      
      
      this.store.set('store', {
        displayMode: mode,
        ua: name_browser,
        version: ver_browser,
        os: os,
      })
      console.log(os, mode, name_browser, ver_browser);
    });
  }

  getPWADisplayMode() {
    const isStandalone = window.matchMedia(
      '(display-mode: standalone)'
    ).matches;
    if (document.referrer.startsWith('android-app://')) {
      return 'pwa';
    } else if (navigator['standalone'] || isStandalone) {
      return 'standalone';
    }
    return 'browser';
  }

  findOs(platforms) {
    switch (true) {
      case platforms.indexOf('ios') > -1 ||
        platforms.indexOf('iphone') > -1 ||
        platforms.indexOf('ipad') > -1:
        return 'ios';
      case platforms.indexOf('android') > -1:
        return 'android';
      default:
        return 'other';
    }
  }

  findname_browser() {
    const agent = window.navigator.userAgent.toLowerCase();
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'edge';
      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
        return 'opera';
      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
        return 'chrome';
      case agent.indexOf('trident') > -1:
        return 'ie';
      case agent.indexOf('firefox') > -1:
        return 'firefox';
      case agent.indexOf('safari') > -1:
        return 'safari';
      default:
        return 'other';
    }
  }

  findver_browser() {
    var userAgent = navigator.userAgent,
      tem,
      matchTest =
        userAgent.match(
          /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
        ) || [];

    if (/trident/i.test(matchTest[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
      return 'IE ' + (tem[1] || '');
    }

    if (matchTest[1] === 'Chrome') {
      tem = userAgent.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }

    matchTest = matchTest[2]
      ? [matchTest[1], matchTest[2]]
      : [navigator.appName, navigator.appVersion, '-?'];

    if ((tem = userAgent.match(/version\/(\d+)/i)) != null)
      matchTest.splice(1, 1, tem[1]);
    return matchTest.join(' ');
  }
}
