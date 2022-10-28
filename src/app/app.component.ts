import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { Platform } from '@ionic/angular';
import { StorageService } from './services/localstorage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private swUpdate: SwUpdate,
    private store: StorageService,
    public platform: Platform,
    private router: Router
  ) {}

  deferredPrompt;
  
  ngOnInit(): void {
    this.platform.ready().then(() => {
      console.log('platform ready');
      let os = this.findOs(this.platform.platforms());
      let mode = this.getPWADisplayMode();
      let name_browser = this.findname_browser();
      let ver_browser = this.findver_browser();
      
      
      this.store.get('store').then((store) => {
        this.store.set('store', {
          ...store,
          displayMode: mode,
          ua: name_browser,
          version: ver_browser,
          os: os,
        });                        
      });
      
      console.log(os, mode, name_browser, ver_browser);

      if (mode === 'standalone') { // already installed
        console.log('check for notifications')
        // check for notifications
        this.notifyMe();
        this.router.navigate(['/pages/home']);
      } else {        
        // https://web.dev/customize-install/#show_the_prompt
        window.addEventListener('beforeinstallprompt', (e) => {
          e.preventDefault();
          this.deferredPrompt = e;
          // https://stackoverflow.com/questions/57572999/beforeinstallprompt-event-is-not-caught-second-time-user-enters-the-page
          // TODO Optionally, send analytics event that PWA install promo was shown.
          console.log(`'beforeinstallprompt' event was fired.`, e);
        });

        window.addEventListener('appinstalled', async () => {
          this.deferredPrompt = null;
          // TODO Optionally, send analytics event to indicate successful install
          console.log('PWA was installed');
          this.store.get('store').then((store) => {
            this.store.set('store', {
              ...store,
              displayMode: 'standalone',
            });                        
            this.router.navigate(['/pages/postinstall']);
          });
        });
      }
      
      this.update();

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

  notifyMe() {
    console.log('requesting notifications permission');
    if (!('Notification' in window)) {
      console.log('no notifications')
      // Check if the browser supports notifications
      alert('This browser does not support desktop notification. sorry');
    } else if (Notification.permission === 'granted') {
      // Check whether notification permissions have already been granted;
      // if so, create a notification
      console.log('notifications granted')
      // const notification = new Notification('Hi there!');
      // this.notifications.subscribeToFCM();
    } else if (Notification.permission !== 'denied') {
      // We need to ask the user for permission
      console.log('ask for permission')
      Notification.requestPermission().then((permission) => {
        // If the user accepts, let's create a notification
        if (permission === 'granted') {
          const notification = new Notification('Thank you!');
          // …
        }
      });
    }else{
      console.log('shit happens')
    }
  }

  notifyMe2(){
    if (Notification.permission === "default") {
      return Notification.requestPermission().then((permission) => {
        console.log(permission); // "granted", "default", "blocked"
       
        // If the user accepts
        if (permission === "granted") { return true; }
        // If the user clicks away or clicks "Block" 
        return false;
      });
    } else if (Notification.permission === "denied") {
      // if the permissions are blocked, we cannot open the option - the user must do it manually
      window.confirm("Your browser is blocking notifications. Click the     🔒 icon in the URL bar to change your notification preferences.");
      return false;
    } else {
      // hence permission is already "granted"
      return true;
    }
  }

  update() {
    console.log('checking for updates...');
    
    navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
      // console.log(serviceWorkerRegistration, this.swUpdate);
      this.swUpdate.versionUpdates.subscribe((e) => {
        // here you can reload your page
        console.log(e);
        switch (e.type) {
          case 'VERSION_DETECTED':
            console.log(`Downloading new app version: ${e.version.hash}`);
            break;
          case 'VERSION_READY':
            console.log(`Current app version: ${e.currentVersion.hash}`);
            console.log(
              `New app version ready for use: ${e.latestVersion.hash}`
            );
            window.location.reload();
            break;
          case 'VERSION_INSTALLATION_FAILED':
            console.log(
              `Failed to install app version '${e.version.hash}': ${e.error}`
            );
            break;
        }
      })
    }
      
    );
  }
}
