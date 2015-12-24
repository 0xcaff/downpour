import {Component} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';

import {DelugeService} from '../services/deluge';
import {AuthenticatedRoute} from './authenticated';
import {Torrent} from '../model/torrent';
import {BytesPipe} from '../pipes/bytes';
import {ProgressComponent} from '../components/progress';

@Component({
  templateUrl: 'templates/detail.html',
  directives: [ProgressComponent],
  pipes: [BytesPipe],
})
export class TorrentDetailComponent extends AuthenticatedRoute {
  constructor(ds: DelugeService, r: Router, public rp: RouteParams) {
    super(ds, r);
    this.torrentId = rp.get('hash');
  }

  torrentId: string;
  running: boolean;

  ngOnInit() {
    this.running = true;
    super.ngOnInit()
      .then(ds => {
        ds.syncOnceInformation = information;
        sync(this);
      });
  }

  ngOnDestroy() {
    this.running = false;
    this.ds.currentTorrent = null;
  }
}

function sync(ctx) {
  if (ctx.running)
    ctx.ds.syncTorrent(ctx.torrentId).then(() => sync(ctx));
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
  'trackers',
  'peers',
  'state',
];

