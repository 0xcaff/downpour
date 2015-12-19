import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {ConnectComponent} from './connect.component';
import {AddComponent} from './add.component';

@Component({
  selector: 'deluge-app',
  templateUrl: 'templates/index.html',
  directives: [ROUTER_DIRECTIVES],
})
@RouteConfig([
  {
    path:'/connect',
    name: 'Connect',
    component: ConnectComponent,
  },
  {
    path:'/add/...',
    name: 'AddTorrent',
    component: AddComponent,
  },
  // {
  //   path:'/torrents/:id',
  //   name: 'TorrentDetail',
  //   component: HeroListComponent
  // },
  // {
])
export class AppComponent { }

