import {Component} from 'angular2/core';
import {Router} from 'angular2/router';

import {DelugeService} from '../services/deluge';

// TODO: Use CanActivate when Injector becomes accessable from context
export class AuthenticatedRoute {
  constructor(public ds: DelugeService, public r: Router) {}

  ngOnInit() {
    if (!this.ds.authenticated)
      this.r.navigate(['Connect']);
  }
}

