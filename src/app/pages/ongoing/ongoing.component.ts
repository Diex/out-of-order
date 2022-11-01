import { Component, OnInit } from '@angular/core';
import { MissionsService } from 'src/app/services/missions.service';

@Component({
  selector: 'app-ongoing',
  templateUrl: './ongoing.component.html',
  styleUrls: ['./ongoing.component.scss'],
})
export class OngoingComponent implements OnInit {

  current;

  constructor(public missions:MissionsService) { }

  ngOnInit() {
    this.missions.next();
  }

  setCurrentMission(){

    
  }

}
