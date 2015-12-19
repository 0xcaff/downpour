import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {ByTorrentComponent} from './bytorrent.component';
import {ByURLComponent} from './byurl.component';

@Component({
  templateUrl: 'templates/add.html',
  directives: [ROUTER_DIRECTIVES],
})
@RouteConfig([
  {
    path:'/torrent',
    name: 'Torrent',
    component: ByTorrentComponent,
  },
  {
    path:'/url',
    name: 'URL',
    component: ByURLComponent,
  },
])
export class AddComponent { }

