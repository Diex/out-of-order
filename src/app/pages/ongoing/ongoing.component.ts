import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from 'src/app/services/localstorage.service';
import { MissionsService } from 'src/app/services/missions.service';

@Component({
  selector: 'app-ongoing',
  templateUrl: './ongoing.component.html',
  styleUrls: ['./ongoing.component.scss'],
})
export class OngoingComponent implements OnInit {

  // current:BehaviorSubject<any>;

  constructor(public missions:MissionsService, private store:StorageService) { }

  ngOnInit() {
    this.missions.next();
  }

  setCurrentMission(){
 
  }

  save(){
    this.missions.save();
  }

}
