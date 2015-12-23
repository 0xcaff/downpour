import {Component} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';

import {DelugeService} from '../services/deluge';
import {AuthenticatedRoute} from './authenticated';

@Component({
  templateUrl: 'templates/detail.html',
})
export class TorrentDetailComponent extends AuthenticatedRoute {
  constructor(ds: DelugeService, r: Router, public rp: RouteParams) {
    super(ds, r)
    console.log(rp.get('hash'));
  }
}

