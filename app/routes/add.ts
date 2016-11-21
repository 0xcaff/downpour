import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { DelugeService } from '../deluge.service';
import { Configuration } from '../models/configuration';
import { TorrentRequest, TorrentType } from '../models/torrent_request';

import { TreeComponent } from '../components/tree';
import { FileView } from '../components/file';
import { CheckboxView } from '../components/checkbox';
import { TextInputView } from '../components/text';
import { SpeedInputView } from '../components/speed';
import { NumberInputView } from '../components/number';

@Component({
  templateUrl: 'templates/add.html',
  styleUrls: ['templates/add.css'],
  directives: [TreeComponent, FileView, CheckboxView, TextInputView,
    SpeedInputView, NumberInputView],
})
export class AddTorrent {
  url: string;
  formDisabled: boolean;

  torrentRequest: TorrentRequest;
  config: Configuration;

  constructor(private ds: DelugeService, private r: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    return this.ds.getConfiguration(config_keys)
      .then(d => this.config = d)
      .then(() => {
        this.route.params.forEach((params: Params) => {
            let magnet = params['magnet'];
            if (magnet) {
              this.url = decodeURIComponent(requestedMagnet);
              this.getTorrent();
            } else {
              navigator.registerProtocolHandler('magnet',
                `${window.location.href}?magnet=%s`, "Downpour Magnet Link Handler");
            }
        });
      });
  }

  // TODO: Multiple Uploads at Once Support
  getTorrentFromFile(e: Event) {
    var f: File;
    if (e.type == 'change' && e.target.files[0]) {
      f = e.target.files[0];
    } else if (e.type == 'drop') {
      var dragEvent = <DragEvent>e;
      if (dragEvent.dataTransfer.files[0]) {
        f = e.dataTransfer.files[0];
      }
    } else {
      return;
    }

    this.url = f.name;
    this.formDisabled = true;

    this.ds.getTorrentInfo(f)
      .then(tr => this.torrentRequest = tr);
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
      .then(_ => this.r.navigate(['torrents']));
  }
}

var config_keys = [
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

