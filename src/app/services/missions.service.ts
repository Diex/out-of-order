import { Injectable } from '@angular/core';
import { StorageService } from './localstorage.service';
import * as missions from './../../assets/misions.json';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MissionsService {
  id = 0;
  text = ""
  
  current:BehaviorSubject<any> = new BehaviorSubject({});

  constructor(private store:StorageService) {    
   }

  public next(){    

    this.store.get('mission').then((mission) => {    
      if(!mission){
        let date: Date = new Date();
        let firstMission = {id: this.id, text: missions[this.id], shown:date};
        this.store.set('mission', firstMission)              
        this.current.next(firstMission); // muestro la actual
        console.log('first mission created')      
      }else{                
        let date: Date = new Date();
        this.id = (mission.id+1) % (Object.keys(missions).length-1);
        this.text = mission.text;
        let nextMission = {id: this.id, text: missions[this.id], shown:date};
        this.store.set('mission', nextMission)      
        this.current.next(nextMission);
        console.log('get current mission...')      
      }
    }).catch( () => {
      console.log('something went wrong')      
    });    

    console.log(Object.keys(missions))
    console.log(this.id, Object.keys(missions).length)
    // this.updateMission();
  }

  // updateMission(){
  //   let date: Date = new Date();
  //   this.store.get('mission').then((mission) => {    
  //     if(!mission){
  //       throw console.error('something went wrong');        
  //     }else{
  //       this.store.set('mission', {id: this.id, text: missions[this.id], shown:date})      
  //       this.current.next(mission);
  //     }
  //   }).catch( () => {
  //     console.log('no missions: create first')      
  //   });
    

  // }
  
}
