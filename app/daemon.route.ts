import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { DelugeService, poll } from './deluge.service';
import { StateService } from './state.service';
import { ConnectionService } from './connection.service';
import { Daemon } from './models/daemon';

// TODO: Automatic Selection

@Component({
  templateUrl: './daemon.route.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DaemonComponent implements OnInit {
  constructor(private ds: DelugeService, private r: Router,
    private stateService: StateService, private ref: ChangeDetectorRef,
    private connService: ConnectionService) { }

  loading: boolean = true;
  daemons: Daemon[] = [];
  daemonsMap: Map<string, Daemon> = new Map<string, Daemon>();
  daemonSubscription: Subscription;

  hostAddress: string;
  hostPort: number;
  hostUsername: string;
  hostPassword: string;

  localPort: number;

  // TODO: When disconnecting, state doesn't update.
  ngOnInit() {
    if (this.connService.needsConnection) {
      // Forced to choose daemon due to disconnection, pause state updates.
      this.stateService.stateSubscription.unsubscribe();
    }

    this.loading = true;
    this.ref.markForCheck();

    this.daemonSubscription = poll(
      () => this.ds.updateDaemons(this.daemonsMap),
      Observable.timer(1000),
    ).map(daemons => {
      if (daemons) {
        this.loading = false;
        this.daemons = daemons;
        this.ref.markForCheck();
      }
    }).subscribe();
  }

  ngOnDestroy() {
    this.daemonSubscription.unsubscribe();
  }

  toggleConnection(daemon: Daemon) {
    const oldStatus = daemon.status;
    let beforeReset: Observable<any> = null;
    daemon.status = "Loading";

    // Stop hammering server.
    this.stateService.stateSubscription.unsubscribe();

    if (oldStatus === "Connected") {
      // Already Connected, Disconnect
      // TODO: Handle Error

      beforeReset = this.ds.disconnect()
        .map(() => daemon.status = "Online");

    } else {
      let before = null;
      if (this.stateService.state.connected) {
        // Already connected to another daemon, disconnect first.
        before = this.ds.disconnect();
        // TODO: The other daemon's status won't ever change to disconnected.
      } else {
        // Not connected, do nothing before.
        before = Observable.from([undefined]);
      }

      this.ref.markForCheck();
      beforeReset = before
        .flatMap(() => this.ds.connectDaemon(daemon.id))
        .map(() => {
          daemon.status = "Connected";
          this.ref.markForCheck();

          // Redirect if needed
          if (this.connService.needsConnection) {
            this.r.navigate([this.connService.oldUrl]).then(success => {
              if (success) {
                this.connService.needsConnection = false;
              }
            });
          }
        })
    }

    // TODO: Reset state after.
    beforeReset.subscribe(
      () => this.stateService.pollState(),
    );
  }

  stopDaemon(daemon: Daemon) {
    daemon.status = "Loading";
    this.ref.markForCheck();

    this.ds.stopDaemon(daemon.id)
      .subscribe(() => this.ref.markForCheck());
  }

  removeDaemon(daemon: Daemon) {
    daemon.status = "Loading";
    this.ref.markForCheck();

    this.ds.removeDaemon(daemon.id)
      .subscribe(() => this.ref.markForCheck());
  }

  // TODO: Transative States
  startDaemon(port: number) {
    // Reset Fields
    this.localPort = null;

    this.ds.startDaemon(port)
      .subscribe();
  }

  addDaemon(address: string, port: string, username: string, password: string) {
    // Reset Fields
    this.hostAddress = '';
    this.hostPort = null;
    this.hostUsername = '';
    this.hostPassword = '';

    this.ds.addDaemon(address, port, username, password)
      .subscribe();
  }
}

