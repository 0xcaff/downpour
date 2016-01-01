import {Component} from 'angular2/core';
import {Router} from 'angular2/router';

import {DelugeService} from '../services/deluge';

@Component({
  templateUrl: 'templates/connect.html',
})
export class ConnectComponent {
  constructor(public ds: DelugeService, public r: Router) {}

  serverURL: string;
  password: string;
  pending: boolean;

  err: string;
  failed: boolean;
  failedServer: string;

  connect() {
    this.pending = true;
    this.ds.auth(this.serverURL, this.password)
      .then(() => {
        this.pending = false;
        localStorage.setItem('serverURL', this.serverURL);
        localStorage.setItem('password', this.password);
        this.r.navigate(['Torrents']);
      })
      .catch(d => {
        this.pending = false;
        this.failed = true;
        this.failedServer = this.serverURL;

        if (d) {
          this.err = d;
        }
      });
  }
}

