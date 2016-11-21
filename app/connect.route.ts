import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { DelugeService } from './deluge.service';

@Component({
  templateUrl: './connect.route.html',
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
        return this.r.navigate(['torrents']);
      })
      .catch(err => {
        this.pending = false;
        this.failed = true;
        this.failedServer = this.serverURL;
        this.err = err;
      });
  }
}

