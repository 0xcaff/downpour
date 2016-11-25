import { Injectable, EventEmitter } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { DelugeService } from './deluge.service';
import { StateService } from './state.service';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService implements CanActivate {
  constructor(private ds: DelugeService, private r: Router, private appState: StateService) { }

  // Url to redirect to after a sucessful login.
  oldUrl: string;

  // Error, if any, which occured during authentication.
  error: Error;

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean|Promise<boolean> {
    if (this.appState.authenticated) {
      return true;
    }

    this.oldUrl = state.url;
    this.error = null;

    // Try to Authenticate
    var s = localStorage.getItem('serverURL');

    if (!s) {
      // Never Visited, Please Sign In
      this.r.navigate(['connect']);
      return false;
    }

    return this.ds.isAuthed(s)
      .flatMap(isAuthed => {
        if (isAuthed) {
          // Already Authenticated Session
          this.loggedIn(s);
          return Observable.of(true);
        }

        // Not Signed In, Try Remembered Credentials
        var pw = localStorage.getItem('password');
        if (!pw) {
          // No Stored Credentials, Redirect
          this.r.navigate(['connect']);
          return Observable.of(false);
        }

        // Remembered Password, Attempt
        return this.ds.auth(s, pw)
          .map(validCredentials => {
            if (validCredentials) {
              this.loggedIn(s);
              return true;
            }

            // Invalid Credentials, Forget Them
            localStorage.removeItem('password');
            this.r.navigate(['connect']);
            return false;
          });
      }).toPromise().catch(err => {
        // Auth Failed
        this.error = err;
        this.r.navigate(['connect']);
        return false;
      });
  }

  // Called after a sucessful login.
  loggedIn(server: string) {
    // Set Server
    this.ds.serverURL = server;

    // Start Polling
    this.appState.pollState();

    // Tell everyone we're signed in.
    this.appState.authenticated = true;
  }
}
