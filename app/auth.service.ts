import { Injectable, EventEmitter } from '@angular/core';

import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot }
  from '@angular/router';
import { DelugeService } from './deluge.service';

@Injectable()
export class AuthService implements CanActivate {
  constructor(private ds: DelugeService, private r: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean|Promise<boolean> {
    let oldUrl: string = state.url;
    if (this.ds.authenticated) {
      return true;
    }

    // Try to Authenticate
    var s = localStorage.getItem('serverURL');
    var pw = localStorage.getItem('password');

    if (s && pw) {
      return this.ds.auth(s, pw)
        .then(_ => true)
        .catch(_ => { this.r.navigate(['connect']); return false; });
    } else {
      this.r.navigate(['connect']);
      return false;
    }
  }
}
