import {Serializable, prop} from './serializable';

export class Tracker extends Serializable {
  // Whether or not to send stats about the pieces downloaded and uploaded from
  // each peer to the tracker.
  @prop('send_stats') sendStats: boolean;

  // Whether or not the connection to the tracker is secure and the identity of
  // the tracker is verified.
  @prop verified: boolean;

  // Whether or not the message that the torrent has completed has been
  // sent to the tracker.
  @prop('complete_sent') sentComplete: boolean;

  // Whether or not the message that the torrent has started has been sent to
  // the tracker.
  @prop('start_sent') sentStart: boolean;

  // TODO: Unknown
  @prop source: number;

  // The tier of the tracker according to the multi-tracker specification. See
  // BEP12.
  @prop tier: number;

  // Whether or not the client is contacting the tracker, sharing its state
  // information and discovering or sharing peers.
  @prop updating: boolean;

  // The number of times the tracker has been contacted unsuccessfully.
  @prop('fails') failsCount: number;

  // The number of times connections to this tracker must fail before another
  // tracker is considered.
  @prop('fail_limit') maxFails: number;

  // The location at which the tracker is located. This is usually a http(s) or
  // udp location.
  @prop url: string;

  constructor(o: Object) {
    super(o);
  }
}

