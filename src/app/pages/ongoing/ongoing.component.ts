import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonModal, ModalController, ToastController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';

import { BehaviorSubject, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { StorageService } from 'src/app/services/localstorage.service';
import { MissionsService } from 'src/app/services/missions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ongoing',
  templateUrl: './ongoing.component.html',
  styleUrls: ['./ongoing.component.scss'],
})
export class OngoingComponent implements OnInit {
  @ViewChild('noteModal') noteModal: IonModal;
  @ViewChild('feedbackModal') feedbackModal: IonModal;

  noteText;
  feedbackText;
  current: BehaviorSubject<any> = new BehaviorSubject({});
  unsuscribe: Subject<any> = new Subject();
  edit = false;
  constructor(
    public missions: MissionsService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private store: StorageService,
    private toast: ToastController,
  ) { }
  //https://appdividend.com/2020/07/14/angular-route-params-how-to-pass-route-params-in-angular/
  ngOnInit() {
    this.route.params
      .subscribe(params => {
        if (params.id && params.id !== 'next') {
          let index = this.missions.saved.value.findIndex(mission => mission.id == params.id);
          this.current.next(this.missions.saved.value[index]);
        } else {
          this.missions.next();
          this.missions.current.pipe(
            takeUntil(this.unsuscribe),
            map(mission => {
              this.current.next(mission);
            })
          ).subscribe();
        }
      }
      );

  }

  ngOnDestroy(): void {
    this.unsuscribe.next();
  }

  save() {
    this.missions.save();
  }

  note() {
    console.log(this.current.value)
    console.log(this.current.value.note)
    let index = this.missions.saved.value.findIndex(mission => mission.id == this.current.value.id);
    console.log(index);

    if (index != -1) {
      this.noteText = this.missions.saved.value[index].note;
      return;
    }

    this.noteText = '';
  }

  async share() {

    const shareData = {
      title: 'Out Of Order',
      text: this.current.value.text,
      url: 'https://outoforder-2022.web.app'
    }

    try {
      await navigator.share(shareData)
      console.log('MDN shared successfully')
    } catch (err) {
      console.error(`Error: ${err}`);
      window.alert(`Can't share on this platform`);
    }
  }



  name: string;

  cancel() {
    // close any modal
    this.noteModal.dismiss(null, 'cancel');
    this.feedbackModal.dismiss(null, 'cancel');
  }

  confirm() {
    this.noteModal.dismiss(this.name, 'confirm');
    console.log(this.noteText);
    let index = this.missions.saved.value.findIndex(mission => mission.id == this.current.value.id);
    if (index == -1) {
      this.current.value['note'] = this.noteText;
      this.save();
      return;
    }
    this.missions.addNote(this.noteText, this.current.value.id);
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') { }
  }

  async fb() {

    let email;

    await this.store.get('store').then(store => {
      console.log(store.email)
      email = store.email ?? undefined;
    })

    let data = {
      'mission': this.missions.current.value.text,
      'feedback': this.feedbackText,
      'email': email
    };

    console.log(data);

    this.http
      .post(environment.firebase.api + '/emails/feedback', data)
      .toPromise().then(
        () => {
          this.feedbackModal.dismiss(this.name, 'confirm');
          this.feedbackText = '';
          this.presentToast("FEEDBACK SENT...")
        }
      ).catch(error => {
        this.feedbackModal.dismiss(this.name, 'confirm');
        this.feedbackText = '';
        this.presentToast(`THERE WAS AN ERROR: ${error}`);
      })

    console.log(this.feedbackText);
  }

  async presentToast(text) {
    const toast = await this.toast.create({
      message: text,
      duration: 4000,
      position: 'bottom',
      cssClass: 'ion-toast-custom',
    });

    await toast.present();
  }

}
