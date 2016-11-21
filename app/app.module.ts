import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { InputDetectorComponent } from './components/input-detector';

import { ConnectComponent } from './connect.route';
import { TorrentsComponent } from './torrents.route';
// import { AddTorrent } from './routes/add';
// import { TorrentDetailComponent } from './routes/detail';
// import { ConfigurationComponent } from './routes/configuration';

import { BytesPipe } from './bytes.pipe';
import { DurationPipe } from './duration.pipe';
import { ObjectPipe } from './object.pipe';

import { DelugeService } from './deluge.service';
import { AuthService } from './auth.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,

    RouterModule.forRoot([
      { path: 'connect', component: ConnectComponent },
      { path: 'torrents', component: TorrentsComponent, canActivate: [AuthService] },
      { path: '', redirectTo: 'torrents', pathMatch: 'full' },
      // { path: 'add', component: AddTorrent, canActivate: [AuthService] },
      // { path: 'torrents/:hash', component: TorrentDetailComponent, canActivate: [AuthService] },
      // { path: 'configuration', component: ConfigurationComponent, canActivate: [AuthService] },
    ]),
  ],
  declarations: [
    // Components
    AppComponent,
    InputDetectorComponent,

    // Routes
    ConnectComponent,
    TorrentsComponent,
    // AddTorrent,
    // TorrentDetailComponent,
    // ConfigurationComponent,

    // Pipes
    BytesPipe,
    DurationPipe,
    ObjectPipe
  ],
  providers: [
    // TODO: Initialize from localstorage.
    DelugeService,
    AuthService,
  ],
  bootstrap: [ AppComponent ],
})
export class AppModule { }

