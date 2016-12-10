export class Daemon {
  id: string;
  address: string;
  port: number;
  status: string;
  version: string;

  constructor(params: any[]) {
    this.unmarshall(params);
  }

  unmarshall(params: any[]) {
    this.id = params[0];
    this.address = params[1];
    this.port = params[2];
    this.status = params[3];
    this.version = params[4];
  }
}

