import {Component} from 'angular2/core';
import {Router} from 'angular2/router';

import {DelugeService} from '../services/deluge';
import {AuthenticatedRoute} from './authenticated';

@Component({
  templateUrl: 'templates/torrents.html',
})
export class TorrentsComponent extends AuthenticatedRoute {
  constructor(ds: DelugeService, r: Router) {
    super(ds, r)
  }
}
