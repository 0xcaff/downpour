import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { DelugeService } from './deluge.service';
import { Configuration } from './models/configuration';
import { TorrentInformation, TorrentType } from './models/torrent-information';

// TODO: Handle Adding Duplicates
// TODO: Handle Removal
// TODO: Handle Actual Addition
// TODO: Add With Cookies
@Component({
  templateUrl: 'add.route.html',
  styleUrls: ['add.route.css'],
})
export class AddTorrentComponent {
  torrents: TorrentInformation[] = [];
  config: Configuration;

  constructor(private ds: DelugeService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    (<any>navigator).registerProtocolHandler('magnet',
      `${window.location.href}/magnet/%s`, "Downpour Magnet Link Handler");

    // TODO: Add to app.module.ts
    this.route.params.subscribe(params => {
      let magnetLink = params['magnet'];
      if (magnetLink) {
        this.fromUrl(magnetLink);
      }
    });

    return this.ds.getConfiguration(config_keys)
      .subscribe(defaultConfig => this.config = defaultConfig);;
  }

  fileDropped(e: DragEvent) {
    // File Dropped
    if (e.dataTransfer.files) {
      this.sendFiles(e.dataTransfer.files);
    }
  }

  // TODO: Handle repeat selections
  fileSelected(e: Event) {
    // File Input Changed
    let input = <HTMLInputElement>e.target;
    if (input.files) {
      this.sendFiles(input.files);
    }
  }

  // Uploads torrent files to server for adding.
  sendFiles(files: FileList) {
    this.ds.uploadTorrents(files)
      .subscribe(resp => {
        if (!resp.success) {
          // TODO: Handle
          return;
        }

        for (let file of resp.files) {
          this.ds.getTorrentInfo(file)
            .subscribe(info => this.torrents.push(info));
        }
      });
  }

  fromUrl(link: string) {
    // Magnet or Remote Torrent Link
    if (!link) {
      return;
    }

    // TODO: Handle Error
    this.ds.getTorrentInfoFromLink(link)
      .subscribe(torrentInfo => this.torrents.push(torrentInfo));
  }

  addTorrents() {
    console.log(this.torrents);
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

