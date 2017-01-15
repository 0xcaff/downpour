import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { DelugeService, poll } from './deluge.service';

import { Torrent } from './models/torrent';

// TODO: Show state at 0% somehow
// TODO: Add Capability to Change a Torrent's Label
@Component({
  templateUrl: './detail.route.html',
  styleUrls: ['./detail.route.css'],
})
export class TorrentDetailComponent {
  constructor(private delugeService: DelugeService, private route: ActivatedRoute, private router: Router) { }

  pollSub: Subscription;
  torrent: Torrent = new Torrent();

  ngOnInit() {
    this.route.params.subscribe(params => {
      let torrentId = params['hash'];
      this.pollSub = poll(
        () => this.delugeService.updateTorrent(this.torrent, torrentId, SingleTorrentSyncParams),
        Observable.timer(1000),
      ).subscribe();
    });
  }

  ngOnDestroy() {
    // Stop Polling
    this.pollSub.unsubscribe();
  }

  // TODO: Move to ui
  get color(): string {
    if (this.torrent.state == 'Seeding')
      return 'green';
    else if (this.torrent.state == 'Error')
      return 'red';
    else if (this.torrent.state == 'Queued')
      return 'orange';
    else if (this.torrent.state == 'Paused')
      return 'gray';
  }
}

var SingleTorrentSyncParams = [
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

