import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { StorageService } from 'src/app/services/localstorage.service';
import { MissionsService } from 'src/app/services/missions.service';

@Component({
  selector: 'app-ongoing',
  templateUrl: './ongoing.component.html',
  styleUrls: ['./ongoing.component.scss'],
})
export class OngoingComponent implements OnInit {

  current:BehaviorSubject<any> = new BehaviorSubject({});
  unsuscribe:Subject<any> = new Subject();

  constructor(public missions:MissionsService, private route: ActivatedRoute) { }
  //https://appdividend.com/2020/07/14/angular-route-params-how-to-pass-route-params-in-angular/
  ngOnInit() {
    this.route.params
      .subscribe(params => {        
        if(params.id && params.id !== 'next'){
          let index = this.missions.saved.value.findIndex(mission => mission.id == params.id);        
          this.current.next(this.missions.saved.value[index]);
        }else{
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

  save(){
    this.missions.save();
  }

  async share(){

    // const resultPara = document.querySelector('.result');


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
    }
  }

}
