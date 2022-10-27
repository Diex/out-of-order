import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InstalledGuard } from '../guards/installed.guard';

import { HomeComponent } from './home/home.component';
import { InstallComponent } from './install/install.component';
import { MenuComponent } from './menu/menu.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { OnboardComponent } from './onboard/onboard.component';
import { OngoingComponent } from './ongoing/ongoing.component';
import { PostinstallComponent } from './postinstall/postinstall.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  
  {
    path: '',
    redirectTo: "onboard"
  },
  {
    path: 'onboard',
    component: OnboardComponent,
  },
  {
    path: 'install',
    component: InstallComponent
  },
  {
    path: 'postinstall',
    component: PostinstallComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [InstalledGuard]
  },
  {
    path: 'menu',
    component: MenuComponent,
    canActivate: [InstalledGuard]
  },
  {
    path: 'ongoing',
    component: OngoingComponent,
    canActivate: [InstalledGuard]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [InstalledGuard]
  },
  {
    path: '404',
    component: NotfoundComponent
  },
  { path: '**', redirectTo: '404', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
