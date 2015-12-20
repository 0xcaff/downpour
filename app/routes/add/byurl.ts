import {Component} from 'angular2/core';

import {DelugeService} from '../../services/deluge';
import {TreeComponent} from '../../components/tree';
import {Directory} from '../../models/tree';
// import {MockTree} from '../../mock/tree';

@Component({
  templateUrl: 'templates/add/byurl.html',
  directives: [TreeComponent],
})
export class ByURLComponent {
  url: string;
  tree: Directory;

  constructor(public ds: DelugeService) {}

  getTorrent() {
    this.ds.rpc('web.download_torrent_from_url', [this.url])
      .then(d => this.ds.rpc('web.get_torrent_info', [d]))
      .then(d => { console.log(d); return d })

      // TODO: Handle Single File Torrents
      .then(d => this.tree = new Directory(d['files_tree']['contents']));
  }

  addTorrent() {
    this.ds.rpc('web.add_torrents', [[{
      options: {
        add_paused: false,
        file_priorities: [
        //  ...
        ],
        max_connections: -1,
        max_download_speed: -1,
        max_upload_slots: -1,
        max_upload_speed: -1,
        move_completed: false,
        move_completed_path: "/var/lib/deluge/Downloads",
        prioritize_first_last_pieces: false,
      }
    }]])
  }
}

