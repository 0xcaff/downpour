import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { InputDetectorComponent } from './input-detector.component';

import { ConnectComponent } from './connect.route';
import { TorrentsComponent } from './torrents.route';
import { TorrentDetailComponent } from './detail.route';
// import { AddTorrent } from './routes/add';
// import { ConfigurationComponent } from './routes/configuration';

import { ProgressComponent } from './components/progress';
import { UiTabs, UiPane } from './components/ui-tabs';
import { CheckboxView } from './components/checkbox';
import { NumberInputView } from './components/number';
import { TextInputView } from './components/text';
import { SpeedInputView } from './components/speed';

import { BytesPipe } from './bytes.pipe';
import { DurationPipe } from './duration.pipe';
import { ObjectPipe } from './object.pipe';

import { InputDetectorService } from './input-detector.service';
import { DelugeService } from './deluge.service';
import { AuthService } from './auth.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,

    RouterModule.forRoot([
      {
        path: 'connect',
        component: ConnectComponent
      },
      {
        path: 'torrents',
        canActivate: [AuthService],
        children: [
          {
            path: ':hash',
            component: TorrentDetailComponent,
          },
          {
            path: '',
            component: TorrentsComponent,
          },
        ],
      },

      { path: '', redirectTo: 'torrents', pathMatch: 'full' },
      // { path: 'add', component: AddTorrent, canActivate: [AuthService] },
      // { path: 'configuration', component: ConfigurationComponent, canActivate: [AuthService] },
    ]),
  ],
  declarations: [
    // Components
    AppComponent,
    InputDetectorComponent,
    ProgressComponent,
    UiTabs, UiPane,
    CheckboxView,
    NumberInputView,
    TextInputView,
    SpeedInputView,

    // Routes
    ConnectComponent,
    TorrentsComponent,
    TorrentDetailComponent,
    // AddTorrent,
    // ConfigurationComponent,

    // Pipes
    BytesPipe,
    DurationPipe,
    ObjectPipe
  ],
  providers: [
    DelugeService,
    AuthService,

    InputDetectorService,
  ],
  bootstrap: [ AppComponent ],
})
export class AppModule { }

