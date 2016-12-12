import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { DelugeService, poll } from './deluge.service';
import { StateService } from './state.service';
import { Daemon } from './models/daemon';

@Component({
  templateUrl: './daemon.route.html',
})
export class DaemonComponent implements OnInit {
  constructor(private ds: DelugeService, private r: Router, private stateService: StateService) { }

  daemons: Daemon[] = [];

  daemonSubscription: Subscription;

  ngOnInit() {
    this.daemonSubscription = this.ds.getDaemons()
      .switchMap(daemons => {
        return poll(
          () => Observable.forkJoin(
            // TODO: This kinda works but deletions and additions aren't
            // accounted for.
            // TODO: When disconnecting, state doesn't update.
            daemons.map(daemon => this.ds.updateDaemon(daemon))
          ).map(daemons => {
            if (this.daemons.length === 0) {
              this.daemons.push(...daemons);
            }
            return daemons;
          }),
          Observable.timer(1000),
        );
      })
      .subscribe();
  }

  ngOnDestroy() {
    this.daemonSubscription.unsubscribe();
  }

  connect(daemon: Daemon) {
    if (daemon.status === "Connected") {
      // TODO: Handle Error
      this.ds.disconnect().subscribe()
      return;
    }

    (() => {
      if (this.stateService.state.connected) {
        return this.ds.disconnect();
      } else {
        return Observable.from([undefined]);
      }
    })()
      .flatMap(() => this.ds.connectDaemon(daemon.id))
      .map(() => this.r.navigate(['']))
      .subscribe();
  }
}

