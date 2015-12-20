import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig, Router} from 'angular2/router';

import {ByTorrentComponent} from './add/bytorrent';
import {ByURLComponent} from './add/byurl';

import {DelugeService} from '../services/deluge';
import {AuthenticatedRoute} from './authenticated';

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
export class AddComponent extends AuthenticatedRoute {
  constructor(ds: DelugeService, r: Router) {
    super(ds, r)
  }
}

