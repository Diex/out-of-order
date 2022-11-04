import { Injectable } from '@angular/core';
import { StorageService } from './localstorage.service';
import * as missions from './../../assets/misions.json';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class MissionsService {
  id = 0;
  canUpdate = false;
  // twice = [2, 5]

  current: BehaviorSubject<any> = new BehaviorSubject({});
  saved: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(private store: StorageService, private toast:ToastController) {
    this.store.get('saved').then((saved) => {
      console.log('saved');
      if (!saved) {
        this.saved.next([]);
      } else {
        this.saved.next(saved);
      }
    });
  }

  public async next() {
    await this.store
      .get('store')
      .then((store) => {
        let date: Date = new Date();
        const m = moment(date); // Thursday Feb 2015
        const dow = m.day().toLocaleString();
        // console.log(store)
        this.canUpdate = this.matchDay(store.notifications, dow);
        console.log(this.canUpdate);
      })
      .catch(() => {
        console.log('something went wrong');
      });

    // if matches selection
    // if > 13:00

    this.store
      .get('mission')
      .then((mission) => {
        if (!mission) {
          this.createMission();
        } else {
          if (!this.isToday(new Date(mission.shown)) && this.canUpdate) {
            // if(true){ // engania pichanga
            this.updateMission(mission);
          } else {
            console.log('cant update');
            this.current.next(mission);
          }
        }
      })
      .catch(() => {
        console.log('something went wrong');
      });
  }

  createMission() {
    let date: Date = new Date();
    let firstMission = { id: this.id, text: missions[this.id], shown: date };
    this.store.set('mission', firstMission);
    this.current.next(firstMission); // muestro la actual
    console.log('first mission created');
  }

  updateMission(mission) {
    let date: Date = new Date();
    this.id = (mission.id + 1) % (Object.keys(missions).length - 1);
    let nextMission = { id: this.id, text: missions[this.id], shown: date };
    this.store.set('mission', nextMission);
    this.current.next(nextMission);
    console.log('get current mission...');
  }

  matchDay(notification, dow) {
    if (!notification || notification === 'null') return false;
    if (notification == 0) return true; // daily
    if (notification == 1 && dow == 2) return true; // twice tuesday
    if (notification == 1 && dow == 5) return true; // twice friday
    if (notification == 2 && dow == 1) return true; // 3 monday
    if (notification == 2 && dow == 3) return true; // 3 wendsday
    if (notification == 2 && dow == 5) return true; // 3 friday
    return false;
  }

  isToday(date) {
    let m1 = moment(date);
    let m2 = moment(new Date());
    return m1.date() === m2.date() && m1.month() === m2.month();
  }

  save() {
  
    this.store.get('saved').then((saved: Array<any>) => {
      if (!saved) saved = [];
      if (
        saved.findIndex((mission) => mission.id === this.current.value.id) != -1
      ) {
        // window.alert('already saved');
        this.presentToast('ALREADY SAVED')
        return;
      }
      console.log('save mission', this.current.value
      .id )
      saved.push(this.current.value);
      this.store.set('saved', saved); // updates storage
      this.saved.next(saved); // updates subscribers
    });
  }

  isSaved(id): boolean {
    let result = false;
    this.store.get('saved').then((saved: Array<any>) => {
      console.log(saved);
      if (!saved) {
        result = false;
        return;
      }

      let index = saved.findIndex((mission) => mission.id === id);
      if (index != -1) {
        console.log(saved);
        result = true;
        return;
      }

      result = false;
    });
    return result;
  }

  addNote(text, id) {
    this.store.get('saved').then((saved: Array<any>) => {
      if (!saved) return;
      let index = saved.findIndex((mission) => mission.id === id);
      console.log(index);
      if (index != -1) {
        // window.alert('already saved');
        saved[index]['note'] = text;
        // console.log(saved[index]);
        this.store.set('saved', saved); // updates storage
        this.saved.next(saved); // updates subscribers
      }
      
    });
  }

  async presentToast(text) {
    const toast = await this.toast.create({
      message: text,
      duration: 1500,
      position: 'bottom'
    });

    await toast.present();
  }
}
