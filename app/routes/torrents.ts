import {Component} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {DelugeService} from '../services/deluge';
import {AuthenticatedRoute} from './authenticated';
import {ObjectFilterPipe} from '../pipes/object';

@Component({
  templateUrl: 'templates/torrents.html',
  styleUrls: ['templates/torrents.css'],
  directives: [ROUTER_DIRECTIVES],
  pipes: [ObjectFilterPipe],
})
export class TorrentsComponent extends AuthenticatedRoute {
  running: boolean;
  filter: string;

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

  getSelected() {
    return this.ds.state.torrents.values.filter((v, i) => v.checked).map(v => v.hash);
  }

  unselect() {
    this.ds.state.torrents.values.forEach(v => v.checked = false);
  }
}

function sync(ds, ctx) {
  if (ctx.running) {
    ds.sync().then(() => sync(ds, ctx));
  }
}

