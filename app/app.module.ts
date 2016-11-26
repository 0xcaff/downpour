import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { InputDetectorComponent } from './input-detector.component';

import { ConnectComponent } from './connect.route';
import { TorrentsComponent } from './torrents.route';
import { AddTorrentComponent } from './add.route';
import { TorrentDetailComponent } from './detail.route';
// import { ConfigurationComponent } from './routes/configuration';

import { ProgressComponent } from './components/progress';
import { TreeComponent } from './tree.component';
import { FileComponent } from './components/file';
import { UiTabs, UiPane } from './components/ui-tabs';
import { CheckboxView } from './components/checkbox';
import { NumberInputView } from './components/number';
import { TextInputView } from './components/text';
import { SpeedInputView } from './components/speed';
import { ContextMenuComponent } from './context-menu.component';

import { BytesPipe } from './bytes.pipe';
import { DurationPipe } from './duration.pipe';
import { ObjectPipe } from './object.pipe';

import { InputDetectorService } from './input-detector.service';
import { DelugeService } from './deluge.service';
import { AuthService } from './auth.service';
import { StateService } from './state.service';

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
      {
        path: 'add',
        component: AddTorrentComponent,
        canActivate: [AuthService]
        // TODO: Child routes for add by magnet link and torrent info hash.
      },
      // { path: 'configuration', component: ConfigurationComponent, canActivate: [AuthService] },
      { path: '', redirectTo: 'torrents', pathMatch: 'full' },
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
    TreeComponent,
    ContextMenuComponent,
    FileComponent,

    // Routes
    ConnectComponent,
    TorrentsComponent,
    TorrentDetailComponent,
    AddTorrentComponent,
    // ConfigurationComponent,

    // Pipes
    BytesPipe,
    DurationPipe,
    ObjectPipe
  ],
  providers: [
    DelugeService,
    AuthService,
    StateService,

    InputDetectorService,
  ],
  bootstrap: [ AppComponent ],
})
export class AppModule { }

