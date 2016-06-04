///<reference path="../typings/globals/es6-shim/index.d.ts"/>
import {ROUTER_PROVIDERS} from 'angular2/router';

import {bootstrap} from 'angular2/platform/browser';
import {provide} from 'angular2/core';

import {DelugeService} from './services/deluge';
import {MobileService} from './services/mediaquery';
import {InputDetectorService} from './services/input-detector';

import {AppComponent} from './app';

bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  DelugeService,
  MobileService,
  InputDetectorService,

  // provide(DelugeService, {
  //   useFactory: () => {
  //     var ds = new DelugeService();
  //     var s = localStorage.getItem('serverURL');
  //     var pw = localStorage.getItem('password');

  //     if (s && pw)
  //       return ds.auth(s, pw)
  //         .then(() => ds)
  //     else
  //       return ds;
  //   },
  // }),
]);

