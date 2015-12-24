import {Serializable, prop} from './serializable';

export class Peer extends Serializable {
  @prop('down_speed') downloadSpeed: number;
  @prop('up_speed') uploadSpeed: number;
  @prop ip: string;
  @prop country: string;
  @prop client: string;
  @prop progress: number;
  @prop seed;

  constructor(o: Object) {
    super(o);
  }
}

