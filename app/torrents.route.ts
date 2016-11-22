import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { DelugeService } from './deluge.service';
import { MobileService } from './mediaquery.service';
import { InputDetectorService } from './input-detector.service';

import { Torrent } from './models/torrent';

@Component({
  templateUrl: './torrents.route.html',
  styleUrls: ['./torrents.route.css', './dropdown-submenu.css'],
  providers: [
    MobileService,
  ]
})
export class TorrentsComponent {
  filter: string;
  sortBy: string;
  descending: boolean;
  contextVisible: boolean;
  y: number;
  x: number;

  constructor(
    public r: Router, public ds: DelugeService, public mediaQuery: MobileService,
    public ids: InputDetectorService
  ) { }

  ngOnInit() {
    this.filter = this.ds.filter;
    this.ds.syncStateInformation = torrentProperties;

    this.ds.sync();
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

