import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowserGuard } from '../guards/browser.guard';
import { InstalledGuard } from '../guards/installed.guard';
import { AboutComponent } from './about/about.component';

import { HomeComponent } from './home/home.component';
import { InstallComponent } from './install/install.component';
import { InviteComponent } from './invite/invite.component';
import { MenuComponent } from './menu/menu.component';
import { MystuffComponent } from './mystuff/mystuff.component';
import { NotesComponent } from './notes/notes.component';
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
    // canActivate: [BrowserGuard]
  },
  {
    path: 'install',
    component: InstallComponent,
    // canActivate: [BrowserGuard]
  },
  {
    path: 'postinstall',
    component: PostinstallComponent,
    // canActivate: [BrowserGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
    // canActivate: [InstalledGuard]
  },
  {
    path: 'menu',
    component: MenuComponent,
    // canActivate: [InstalledGuard]
  },
  {
    path: 'ongoing/:id',
    component: OngoingComponent,
    // canActivate: [InstalledGuard]
  },
  // {
  //   path: 'ongoing',
  //   component: OngoingComponent,
  //   // canActivate: [InstalledGuard]
  // },
  {
    path: 'about',
    component: AboutComponent,
    // canActivate: [InstalledGuard]
  },
  {
    path: 'invite',
    component: InviteComponent,
    // canActivate: [InstalledGuard]
  },
  {
    path: 'mystuff',
    component: MystuffComponent,
    // canActivate: [InstalledGuard]
  },
  {
    path: 'notes',
    component: NotesComponent,
    // canActivate: [InstalledGuard]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    // canActivate: [InstalledGuard]
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
