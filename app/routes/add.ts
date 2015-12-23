import {Component} from 'angular2/core';
import {Router} from 'angular2/router';

import {DelugeService} from '../services/deluge';
import {TreeComponent} from '../components/tree';
import {FileView} from '../components/file';
import {Configuration} from '../models/configuration';
import {TorrentRequest, TorrentType} from '../models/torrent_request';
import {AuthenticatedRoute} from './authenticated';

@Component({
  templateUrl: 'templates/add.html',
  styleUrls: ['templates/add.css'],
  directives: [TreeComponent, FileView],
})
export class AddTorrent extends AuthenticatedRoute {
  url: string;
  formDisabled: boolean;

  torrentRequest: TorrentRequest;
  config: Configuration;

  constructor(public ds: DelugeService, public r: Router) {
    super(ds, r);
  }

  ngOnInit() {
    super.ngOnInit()
      .then(ds => ds.rpc('core.get_config_values', [config_values]))
      .then(d => this.config = new Configuration(d));
  }

  // TODO: Multiple Uploads at Once Support
  getTorrentFromFile(e: Event) {
    var f: File;
    if (e.type == 'change' && e.target.files[0]) {
      f = e.target.files[0];
    } else if (e.type == 'drop' && e.dataTransfer.files[0]) {
      f = e.dataTransfer.files[0];
    } else {
      return;
    }

    this.url = f.name;
    this.formDisabled = true;

    var fd = new FormData();
    fd.append('file', f);

    return fetch(this.ds.serverURL + '/../upload', {
      method: 'POST',
      body: fd,
      mode: 'cors',
      credentials: 'include',
    })
      .then(d => d.json())
      .then(d => this.ds.getInfo(d['files'][0], true))
      .then(d => this.torrentRequest = d)
  }

  getTorrent() {
    if (this.url && !this.formDisabled) {
      this.ds.getInfo(this.url)
        .then(d => this.torrentRequest = d)
    }
  }

  addTorrent() {
    var r = this.torrentRequest.marshall(this.config);

    this.ds.rpc('web.add_torrents', [[r]])
      .then(_ => this.r.navigate(['Torrents']));
  }
}

var config_values = [
  "add_paused",
  "compact_allocation",
  "download_location",
  "max_connections_per_torrent",
  "max_download_speed_per_torrent",
  "move_completed",
  "move_completed_path",
  "max_upload_slots_per_torrent",
  "max_upload_speed_per_torrent",
  "prioritize_first_last_pieces"
]

