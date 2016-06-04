import {Component} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {DelugeService} from '../services/deluge';
import {MobileService} from '../services/mediaquery';
import {InputDetectorService} from '../services/input-detector';

import {Torrent} from '../models/torrent';
import {AuthenticatedRoute} from './authenticated';
import {ObjectFilterPipe} from '../pipes/object';
import {BytesPipe} from '../pipes/bytes';

@Component({
  templateUrl: 'templates/torrents.html',
  styleUrls: ['templates/torrents.css', 'css/dropdown-submenu.css'],
  directives: [ROUTER_DIRECTIVES],
  pipes: [ObjectFilterPipe, BytesPipe],
})
export class TorrentsComponent extends AuthenticatedRoute {
  filter: string;
  sortBy: string;
  descending: boolean;
  contextVisible: boolean;
  y: number;
  x: number;

  constructor(
    ds: DelugeService, r: Router, public mediaQuery: MobileService,
    public ids: InputDetectorService
  ) {
    super(ds, r);
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

  sort(column: string, evt: Event) {
    if (column == this.sortBy && this.descending !== undefined) {
      this.descending = !this.descending;
    } else {
      if (column == '')
        this.descending = undefined;
      else
        this.descending = true;

      this.sortBy = column;
    }
  }

  getSelected() {
    return this.ds.state.torrents.values.filter((v, i) => v.checked).map(v => v.hash);
  }

  unselect() {
    this.ds.state.torrents.values.forEach(v => v.checked = false);
  }

  contextmenu(t: Torrent, evt: MouseEvent) {
    // TODO: This assumes that if a mouse is available it is always being used.
    if (evt.altKey || !this.ids.hasMouse) {
      return;
    }
    evt.preventDefault();

    this.contextVisible = true;
    this.y = evt.pageY;
    this.x = evt.pageX;

    t.checked = true;
  }

  clickedOutside() {
    this.contextVisible = false;
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

