import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

import { DelugeService, poll } from './deluge.service';
import { ConnectionService } from './connection.service';

import { State } from './models/state';

// A container for global application state.
@Injectable()
export class StateService {
  constructor(private delugeService: DelugeService, private router: Router, private connService: ConnectionService) {
    this.pollUpdates.subscribe(state => {
      if (state && state.connected === false && this.router.url !== '/daemon') {
        this.connService.needsConnection = true;
        this.router.navigate(['/daemon']);
      }
    });
  }

  // Set to true by AuthService after authentication is confirmed. Should be set
  // to false when a authntication check is necessary.
  authenticated: boolean = false;

  // Filter in the /torrents view.
  filter: string;

  // Field table in the /torrents view is sorted by.
  sortBy: string;

  // Whether the table in the /torrents view is sorted in ascending or
  // descending order.
  descending: boolean;

  // Current server ui state. Maintained by polling. Start polling by calling
  // pollState(). Stop by canceling stateSubscription.
  state: State = new State();

  // Subscription for polling of state.
  stateSubscription: Subscription;

  // Information wanted in state.
  stateProperties: string[] = BasicProperties;

  pollUpdates: Subject<State> = new Subject();

  // Start updating state.
  pollState() {
    if (this.stateSubscription && !this.stateSubscription.closed) {
      // Only alow one pollState at a time.
      return;
    }

    // TODO: Backoff if download speed is slow or no state is being viewed.
    this.stateSubscription = poll(
       () => this.delugeService.updateState(this.state, this.stateProperties),
       Observable.timer(2500),
     ).subscribe(this.pollUpdates);
  }
}

// Properties which we want for the TorrentsComponent's state.
export var TorrentsComponentProperties = [
  // "queue",
  "name",
  // "total_wanted",
  "state",
  "progress",
  // "num_seeds",
  // "total_seeds",
  // "num_peers",
  // "total_peers",
  "download_payload_rate",
  "upload_payload_rate",
  // "eta",
  "ratio",
  // "distributed_copies",
  // "is_auto_managed",
  // "time_added",
  "tracker_host",
  // "save_path",
  // "total_done",
  // "total_uploaded",
  // "max_download_speed",
  // "max_upload_speed",
  // "seeds_peers_ratio",
  "label",
  "total_size",
];

export var BasicProperties = [''];
