import {Component} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';

import {DelugeService} from '../services/deluge';
import {AuthenticatedRoute} from './authenticated';
import {Torrent} from '../models/torrent';
import {BytesPipe} from '../pipes/bytes';
import {DurationPipe} from '../pipes/duration';
import {ProgressComponent} from '../components/progress';
import {UiTabs, UiPane} from '../components/ui-tabs';

@Component({
  templateUrl: 'templates/detail.html',
  styleUrls: ['templates/detail.css'],
  directives: [ProgressComponent, UiTabs, UiPane],
  pipes: [BytesPipe, DurationPipe],
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
    return super.ngOnInit()
      .then(ds => {
        ds.syncOnceInformation = information;
        sync(this);
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

function sync(ctx) {
  if (ctx.running)
    ctx.ds.syncTorrent(ctx.torrentId)
      .then(() => sync(ctx));
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
  'comment',
];

