import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../services/localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class BrowserGuard implements CanActivate {
  constructor(private store:StorageService, private router:Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {      
      return this.store.get('store').then(store => {       
        if(store && store.displayMode === 'standalone') { 
          this.router.navigate(['/pages/home'])
        return false
      }
      return true;
    }); 

  }
}
