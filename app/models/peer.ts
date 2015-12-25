import {Serializable, prop} from './serializable';

export class Peer extends Serializable {
  // The transfer speed for packets flowing from this peer to me.
  @prop('down_speed') downloadSpeed: number;

  // The transfer speed for packets flowing from me to this peer.
  @prop('up_speed') uploadSpeed: number;

  // The ip address used to conect to the peer.
  @prop ip: string;

  // The country determined based on the IP address and GeoIP database.
  @prop country: string;

  // The client string as advertised by the client.
  @prop client: string;

  // The progress of the peer, a foat between 0 and 1.
  @prop progress: number;

  // TODO: Something magical which allows deluge torrents to know about each
  // other?
  @prop seed;

  constructor(o: Object) {
    super(o);
  }
}

