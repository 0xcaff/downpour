import {Component} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {DelugeService} from '../services/deluge';
import {AuthenticatedRoute} from './authenticated';
import {ObjectFilterPipe} from '../pipes/object';
import {BytesPipe} from '../pipes/bytes';

@Component({
  templateUrl: 'templates/torrents.html',
  styleUrls: ['templates/torrents.css'],
  directives: [ROUTER_DIRECTIVES],
  pipes: [ObjectFilterPipe, BytesPipe],
})
export class TorrentsComponent extends AuthenticatedRoute {
  filter: string;

  constructor(ds: DelugeService, r: Router) {
    super(ds, r)
  }

  ngOnInit() {
    super.ngOnInit();
    this.filter = this.ds.filter;
    this.ds.syncStateInformation = torrentProperties;
  }

  ngOnDestroy() {
    this.ds.filter = this.filter;
    this.ds.syncStateInformation = [''];
  }

  getSelected() {
    return this.ds.state.torrents.values.filter((v, i) => v.checked).map(v => v.hash);
  }

  unselect() {
    this.ds.state.torrents.values.forEach(v => v.checked = false);
  }
}

var torrentProperties = [
    // "queue",
    "name",
    // "total_wanted",
    "state",
    "progress",
    // "num_seeds",
    // "total_seeds",
    // "num_peers",
    // "total_peers",
    "download_payload_rate",
    "upload_payload_rate",
    // "eta",
    "ratio",
    // "distributed_copies",
    // "is_auto_managed",
    // "time_added",
    "tracker_host",
    // "save_path",
    // "total_done",
    // "total_uploaded",
    // "max_download_speed",
    // "max_upload_speed",
    // "seeds_peers_ratio",
    "label",
    "total_size",
];

