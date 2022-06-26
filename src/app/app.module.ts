import { NgModule } from '@angular/core';
import {DatePipe} from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { ru_RU } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import ru from '@angular/common/locales/ru';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

import { EVENT_API_URL } from './app-injection-tokens';
import { environment } from 'src/environments/environment';
import {JwtModule} from '@auth0/angular-jwt';
import {ACCESS_TOKEN_KEY} from './services/auth.service';

import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { AgmCoreModule } from '@agm/core';
import { GooglePayButtonModule } from '@google-pay/button-angular';

import { RegisterComponent } from './components/register/register.component';
import { ApproveEventComponent } from './components/approve-event/approve-event.component';
import { LoginComponent } from './components/login/login.component';
import { EventComponent } from './components/event-item/event.component';
import { EventsComponent } from './components/events/events.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingUsersComponent } from './setting-users/setting-users.component';
import { EventService } from './services/event.service';
import { UserService } from './services/user.service';
import { PhotoPipe } from './pipes/photo.pipe';


export function tokenGetter(){
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

registerLocaleData(ru);

@NgModule({
  declarations: [
 AppComponent,
 EventsComponent,
 EventComponent,
 HomeComponent,
 ProfileComponent,
 RegisterComponent,
 LoginComponent,
 ApproveEventComponent,
 SettingUsersComponent,
 PhotoPipe
  ],
  imports: [
    BrowserModule,

    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCOn7rOusZcLArLLS9PCmcaJl0JDaYUv6k'
    }),
    GooglePayButtonModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    IconsProviderModule,
    NzLayoutModule,
    NzCarouselModule,
    NzModalModule,
    NzCheckboxModule,

    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: environment.tokenWhiteListedDomains
      }
    })
  ],
  providers: [{ 
    provide: NZ_I18N, 
    useValue: ru_RU 
  },
{
  provide: EVENT_API_URL,
  useValue: environment.eventsApi
}, EventService, UserService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
