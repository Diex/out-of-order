import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { PagesRoutingModule } from './pages-routing.module';
import { MenuComponent } from './menu/menu.component';
import { OngoingComponent } from './ongoing/ongoing.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { SettingsComponent } from './settings/settings.component';
import { IonicModule } from '@ionic/angular';
import { OnboardComponent } from './onboard/onboard.component';
import { InstallComponent } from './install/install.component';
import { PostinstallComponent } from './postinstall/postinstall.component';



@NgModule({
  declarations: [
    HomeComponent,
    MenuComponent,
    OngoingComponent,
    SettingsComponent,
    NotfoundComponent,
    OnboardComponent,
    InstallComponent,
    PostinstallComponent
  ],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    PagesRoutingModule
  ]
})
export class PagesModule { }
