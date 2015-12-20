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
  connect() {
    console.log(`URL: ${this.serverURL}, Password: ${this.password}`);
    this.ds.auth(this.serverURL, this.password)
      .then(() => {
        localStorage.setItem('serverURL', this.serverURL);
        localStorage.setItem('password', this.password);
        this.r.navigate(['Torrents']);
      })
      // TODO: Handle Fail
  }
}

