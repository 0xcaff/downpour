import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { DelugeService } from './deluge.service';

import { Torrent } from './models/torrent';

// TODO: Add Capability to Change a Torrent's Label
@Component({
  templateUrl: './detail.route.html',
  styleUrls: ['./detail.route.css'],
})
export class TorrentDetailComponent {
  constructor(public ds: DelugeService, private route: ActivatedRoute,
    private router: Router) { }

  torrentId: string;
  running: boolean;

  ngOnInit() {
    this.running = true;
    this.ds.currentTorrent = null;
    this.route.params.subscribe(params => {
      this.torrentId = params['hash']
      this.ds.syncTorrent(this.torrentId);
    });
  }

  ngOnDestroy() {
    this.running = false;
  }

  get color(): string {
    var ct = this.ds.currentTorrent;
    if (ct.state == 'Seeding')
      return 'green';
    else if (ct.state == 'Error')
      return 'red';
    else if (ct.state == 'Queued')
      return 'orange';
    else if (ct.state == 'Paused')
      return 'gray';
  }
}

var information = [
  'name',
  'private',
  'label',
  'is_seed',
  'progress',
  'active_time',
  'eta',
  'time_added',
  'all_time_download',
  'total_uploaded',
  'ratio',
  'download_payload_rate',
  'upload_payload_rate',
  'total_size',
  'files',
  'file_priorities',
  'file_progress',
  'trackers',
  'peers',
  'state',
  'comment',
  'total_peers',

  // Configuration
  'max_download_speed',
  'max_upload_speed',
  'max_connections',
  'max_upload_slots',
  'is_auto_managed',
  'stop_at_ratio',
  'stop_ratio',
  'remove_at_ratio',
  'prioritize_first_last',
  'move_completed',
  'move_completed_path'
];

