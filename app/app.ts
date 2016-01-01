import {Component} from 'angular2/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {ConnectComponent} from './routes/connect';
import {AddTorrent} from './routes/add';
import {TorrentDetailComponent} from './routes/detail';
import {TorrentsComponent} from './routes/torrents';
import {ConfigurationComponent} from './routes/configuration';
import {BytesPipe} from './pipes/bytes';
import {DelugeService} from './services/deluge';

@Component({
  selector: 'deluge-app',
  templateUrl: 'templates/index.html',
  directives: [ROUTER_DIRECTIVES],
  pipes: [BytesPipe],
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
  constructor(public ds: DelugeService, public r: Router) { }

  isCurrentRoute(route: string[]): boolean {
    var instruction = this.r.generate(route);
    return this.r.isRouteActive(instruction);
  }
}

