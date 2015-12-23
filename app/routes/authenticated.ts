import {Component} from 'angular2/core';
import {Router} from 'angular2/router';

import {DelugeService} from '../services/deluge';

// TODO: Use CanActivate when Injector becomes accessable from context
export class AuthenticatedRoute {
  constructor(public ds: DelugeService, public r: Router) { }

  ngOnInit(): Promise<any> {
    if (!this.ds.authenticated) {
      var s = localStorage.getItem('serverURL');
      var pw = localStorage.getItem('password');

      if (s && pw)
        return this.ds.auth(s, pw)
          .then(() => this.ds)
          .catch(() => this.r.navigate(['Connect']))
      else
        return this.r.navigate(['Connect']);
    } else {
      return Promise.resolve(this.ds);
    }
  }
}

