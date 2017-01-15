import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { DelugeService } from './deluge.service';
import { Configuration } from './models/configuration';
import { TorrentInformation, TorrentType } from './models/torrent-information';

import { Observable } from 'rxjs/Observable';

// TODO: Handle Adding Duplicates
// TODO: Add With Cookies
@Component({
  templateUrl: 'add.route.html',
  styleUrls: ['add.route.css'],
})
export class AddTorrentComponent {
  torrents: TorrentInformation[] = [];
  config: Configuration;
  url: string;

  constructor(private ds: DelugeService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    if ((<any>navigator).registerProtocolHandler) {
      (<any>navigator).registerProtocolHandler('magnet',
        `${window.location.href};magnet=%s`, "Downpour Magnet Link Handler");
    }

    this.route.params.subscribe(params => {
      let magnetLink = params['magnet'];
      if (magnetLink) {
        this.fromUrl(magnetLink);
        this.url = magnetLink;
      }

      let infoHash = params['infohash'];
      if (infoHash) {
        let magnet = `magnet:?xt=urn:btih:${infoHash}`;
        this.fromUrl(magnet);
      }
    });

    return this.ds.getConfiguration(config_keys)
      .subscribe(defaultConfig => this.config = defaultConfig);
  }

  fileDropped(e: DragEvent) {
    // File Dropped
    if (e.dataTransfer.files) {
      this.sendFiles(e.dataTransfer.files);
    }
  }

  fileSelected(e: Event) {
    // File Input Changed
    let input = <HTMLInputElement>e.target;
    if (input.files) {
      this.sendFiles(input.files);
    }
    input.value = null;
  }

  // Uploads torrent files to server for adding.
  sendFiles(files: FileList) {
    let currentInfos: TorrentInformation[] = [];
    for (let i = 0; i < files.length; i++) {
      let file = files.item(i);
      let info = new TorrentInformation();
      info.source = file.name;
      currentInfos.push(info);
    }

    // Add To UI
    this.torrents.push(...currentInfos);

    this.ds.uploadTorrents(files)
      .subscribe(resp => {
        if (!resp.success) {
          currentInfos.forEach(
            info => info.error = "Failed to upload torrent to server."
          );

          return;
        }

        for (let i = 0; i < resp.files.length; i++) {
          let file = resp.files[i];
          this.ds.getTorrentInfo(file, currentInfos[i])
            .catch(error => currentInfos[i].error = error.message || error.toString())
            .subscribe();
        }
      }, err =>
        currentInfos.forEach(info => info.error = err.message || err.toString())
      );
  }

  fromUrl(link: string) {
    // Magnet or Remote Torrent Link
    if (!link) {
      return;
    }

    this.url = '';

    let info = new TorrentInformation();
    info.source = link;
    this.torrents.push(info);

    this.ds.getTorrentInfoFromLink(link, info)
      .catch(error => info.error = error.message || error.toString())
      .subscribe();
  }

  addTorrents() {
    let requests = this.torrents.reduce((result, torrentRequest) => {
      if (!torrentRequest.path) {
        // Unpopulated Torrent
        return result;
      }

      let raw = torrentRequest.marshallWithConfig(this.config);
      result.push(raw);

      return result;
    }, []);

    this.ds.addTorrents(requests)
      .subscribe(() => this.router.navigate(['/']));
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

