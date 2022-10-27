import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../services/localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class InstalledGuard implements CanActivate {
  constructor(private store:StorageService, private router:Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {      
      return this.store.get('store').then(store => {

       if( store.displayMode === 'browser') {
        this.router.navigate(['/pages/onboard'])
        return false
      }
      return true;
    }); 

  }
  
}
