import {Component} from 'angular2/core';
import {Router} from 'angular2/router';

import {DelugeService} from '../../services/deluge';
import {TreeComponent} from '../../components/tree';
import {FileView} from '../../components/file';
import {Directory, File} from '../../models/tree';
import {Configuration} from '../../models/configuration';

@Component({
  templateUrl: 'templates/add/byurl.html',
  styleUrls: ['templates/add/byurl.css'],
  directives: [TreeComponent, FileView],
})
export class ByURLComponent {
  // url: string = 'http://releases.ubuntu.com/15.10/ubuntu-15.10-desktop-amd64.iso.torrent';
  // url: string = 'http://torrent.unix-ag.uni-kl.de/torrents/KNOPPIX_V7.6.0DVD-2015-11-21-EN.torrent';
  url: string = 'magnet:?xt=urn:btih:08515290D557A2A313DB61C2ED2765E9CB845839&dn=the+hateful+eight+2015+dvdscr+xvid+ac3+hq+hive+cm8&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80%2Fannounce&tr=udp%3A%2F%2Fglotorrents.pw%3A6969%2Fannounce'

  tree: Directory;
  file: File;

  temporaryLocation: string;
  config: Configuration;
  name: string;
  hash: string;

  constructor(public ds: DelugeService, public r: Router) {}

  getTorrent() {
    this.ds.rpc('core.get_config_values', [config_values])
      .then(d => this.config = new Configuration(d));

    (() => {
      if (this.url.startsWith('magnet')) {
        return this.ds.rpc('web.get_magnet_info', [this.url])
          .then(d => { console.log(d); return d; });
      } else {
        return this.ds.rpc('web.download_torrent_from_url', [this.url])
          .then(d => {
            this.temporaryLocation = d;
            return this.ds.rpc('web.get_torrent_info', [d]);
          })
          .then(d => {
            var keys = Object.keys(d['files_tree']['contents']);
            var o = d['files_tree']['contents'][keys[0]];

            if (o['type'] == 'file') {
              this.file = new File(o, keys[0]);
            } else if (o['type'] == 'dir') {
              this.tree = new Directory(d['files_tree']['contents']);
            }
          })
      }
    })()
      .then(d => {
        this.hash = d['info_hash'];
        this.name = d['name'];
      });
  }

  addTorrent() {
    var priorities: boolean[];
    if (this.tree) {
      priorities = this.tree.flatten().map((d) => +d.download);
    } else if (this.file) {
      priorities = [+this.file.download];
    } else if (this.url.startsWith('magnet')) {
      priorities = [];
    }

    var r = {};
    if (!this.tree && !this.file) {
      r.path = this.url;
    } else {
      r.path = this.temporaryLocation;
    }
    r.options = this.config.marshall();
    r.options.file_priorities = priorities;

    this.ds.rpc('web.add_torrents', [[r]])
      // TODO: make this work
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

