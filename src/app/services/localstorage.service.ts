import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
  }


  init() : Promise<Boolean>
  {
    return new Promise<Boolean>((resolve)=>{
        //   // If using, define drivers here: await this.storage.defineDriver(/*...*/);
        const storage = this.storage.create().then(
          storage => {
            this._storage = storage;    
            console.log('storage:' , this._storage);
            resolve(true);
          }
        );
    });    
  }

  
  // Create and expose methods that users of this service can
  // call, for example:
  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }

    // Create and expose methods that users of this service can
  // call, for example:
  public get(key: string) {
    return this._storage?.get(key);
  }
}