import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class ConnectionService implements CanActivate {
  constructor(private router: Router) { }

  // Url to redirect to after a sucessful connection.
  oldUrl: string;

  needsConnection: boolean;

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean|Promise<boolean> {
    if (!this.needsConnection) {
      return true;
    }

    this.oldUrl = state.url;

    return this.router.navigate(['daemons']);
  }
}

