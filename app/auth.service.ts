import { Injectable, EventEmitter } from '@angular/core';

import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot }
  from '@angular/router';
import { DelugeService } from './deluge.service';

@Injectable()
export class AuthService implements CanActivate {
  constructor(private ds: DelugeService, private r: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let oldUrl: string = state.url;
    if (this.ds.authenticated) {
      return true;
    } else {
      // Authenticate
      this.r.navigate(['/connect']);

      // TODO: Handle redirect
      return false;
    }
  }
}
