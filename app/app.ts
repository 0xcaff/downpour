import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {ConnectComponent} from './routes/connect';
import {AddComponent} from './routes/add';
import {TorrentDetailComponent} from './routes/detail';
import {TorrentsComponent} from './routes/torrents';

@Component({
  selector: 'deluge-app',
  templateUrl: 'templates/index.html',
  directives: [ROUTER_DIRECTIVES],
})
@RouteConfig([
  {
    path: '/connect',
    name: 'Connect',
    component: ConnectComponent,
  },
  {
    path: '/add/...',
    name: 'AddTorrent',
    component: AddComponent,
  },
  {
    path: '/torrents/:id',
    name: 'TorrentDetail',
    component: TorrentDetailComponent,
  },
  {
    path: '/torrents',
    name: 'Torrents',
    component: TorrentsComponent,
    useAsDefault: true,
  }
])
export class AppComponent { }

