import {Component} from 'angular2/core';
import {Router} from 'angular2/router';

import {DelugeService} from '../services/deluge';
import {AuthenticatedRoute} from './authenticated';

@Component({
  templateUrl: 'templates/detail.html',
})
export class TorrentDetailComponent extends AuthenticatedRoute {
  constructor(ds: DelugeService, r: Router) {
    super(ds, r)
  }
}

