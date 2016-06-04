import {Injectable} from 'angular2/core';

@Injectable()
export class MediaQueryService {
  matches: boolean;
  constructor(mediaQuery: string) {
    var mq = window.matchMedia(mediaQuery);
    this.matches = mq.matches;
    mq.addListener((mql) => {
      this.matches = mql.matches;
    });
  }
}

@Injectable()
export class MobileService extends MediaQueryService {
  constructor() {
    super('(max-width: 768px)');
  }
}

