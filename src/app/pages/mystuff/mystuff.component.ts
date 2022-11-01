import { Component, OnInit } from '@angular/core';
import { MissionsService } from 'src/app/services/missions.service';

@Component({
  selector: 'app-mystuff',
  templateUrl: './mystuff.component.html',
  styleUrls: ['./mystuff.component.scss'],
})
export class MystuffComponent implements OnInit {

  constructor(public missions:MissionsService) { }

  ngOnInit() {}

}
