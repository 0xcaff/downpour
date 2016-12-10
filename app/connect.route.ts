import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DelugeService } from './deluge.service';
import { AuthService } from './auth.service';

@Component({
  templateUrl: './connect.route.html',
})
export class ConnectComponent implements OnInit {
  constructor(public ds: DelugeService, public r: Router, private auth: AuthService) { }

  serverURL: string;
  password: string;

  pending: boolean;
  err: Error;
  failed: boolean;
  failedServer: string;

  ngOnInit() {
    // Display Error from AuthService
    if (this.auth.error) {
      this.err = this.auth.error;
    }
  }

  connect() {
    this.pending = true;
    this.ds.auth(this.serverURL, this.password)
      .finally(() => this.pending = false)
      .map(success => {
        if (!success) {
          throw new Error("Invalid Credentials");
        }
      }).subscribe(() => {
        localStorage.setItem('serverURL', this.serverURL);

        // TODO: Remember password option.
        localStorage.setItem('password', this.password);

        if (this.auth.oldUrl) {
          this.r.navigate([this.auth.oldUrl]);
        } else {
          this.r.navigate(['torrents']);
        }
      }, err => {
        this.failed = true;

        this.failedServer = this.serverURL;
        this.err = err;
      });
  }
}

