import {Component} from '@angular/core';
import {Router} from '@angular/router-deprecated';

import {DelugeService} from '../services/deluge';

@Component({
  templateUrl: 'templates/connect.html',
})
export class ConnectComponent {
  constructor(public ds: DelugeService, public r: Router) {}

  serverURL: string;
  password: string;
  pending: boolean;

  err: Error;
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
      .catch(err => {
        this.pending = false;
        this.failed = true;
        this.failedServer = this.serverURL;
        this.err = err;
      });
  }
}

