import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {ConnectComponent} from './routes/connect';
import {AddTorrent} from './routes/add';
import {TorrentDetailComponent} from './routes/detail';
import {TorrentsComponent} from './routes/torrents';
import {ConfigurationComponent} from './routes/configuration';

import {DelugeService} from './services/deluge';

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
    path: '/add',
    name: 'AddTorrent',
    component: AddTorrent,
  },
  {
    path: '/torrents/:hash',
    name: 'TorrentDetail',
    component: TorrentDetailComponent,
  },
  {
    path: '/torrents',
    name: 'Torrents',
    component: TorrentsComponent,
    useAsDefault: true,
  },
  {
    path: '/configuration',
    name: 'Configuration',
    component: ConfigurationComponent,
  },
])
export class AppComponent {
  constructor(public ds: DelugeService) { }
}

