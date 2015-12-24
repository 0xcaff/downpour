import {Serializable, prop} from './serializable';

export class Tracker extends Serializable {
  // Whether or not to send stats about the pieces downloaded and uploaded from
  // each peer to the tracker.
  @prop('send_stats') sendStats: boolean;

  // Whether or not the connection to the tracker is secure.
  @prop verified: boolean;

  @prop('complete_sent') sentComplete: boolean;
  @prop('start_sent') sentStart: boolean;

  @prop source: number;
  @prop tier: number;
  @prop updating: boolean;

  @prop('fails') failsCount: number;
  @prop('fail_limit') maxFails: number;

  constructor(o: Object) {
    super(o);
  }
}

