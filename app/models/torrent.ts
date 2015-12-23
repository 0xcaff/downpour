import {Serializable, prop} from './serializable';

export class Torrent extends Serializable {
  // The SHA-1 has of the torrent's bencoded information section. Commonly used
  // to refer to the torrent.
  hash: string;

  @prop('num_peers') peersCount: number;
  @prop ratio: number;
  @prop progress: number;
  @prop label: string;
  @prop state: string;
  @prop progress: number;
  @prop('tracker_host') tracker: string;
  @prop name: string;

  constructor(o: Object, public hash: string) {
    super(o);
  }
};

