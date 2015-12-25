import {Component} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {DelugeService} from '../services/deluge';
import {AuthenticatedRoute} from './authenticated';

@Component({
  templateUrl: 'templates/torrents.html',
  directives: [ROUTER_DIRECTIVES],
})
export class TorrentsComponent extends AuthenticatedRoute {
  running: boolean;

  constructor(ds: DelugeService, r: Router) {
    super(ds, r)
  }

  ngOnInit() {
    this.running = true;
    return super.ngOnInit().then((ds) => {
      sync(ds, this);
    });
  }

  ngOnDestroy() {
    this.running = false;
  }
}

function sync(ds, ctx) {
  if (ctx.running) {
    ds.sync().then(() => sync(ds, ctx));
  }
}

