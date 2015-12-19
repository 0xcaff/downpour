import {ROUTER_PROVIDERS} from 'angular2/router';

import {bootstrap} from 'angular2/platform/browser';
import {provide} from 'angular2/core';

import {DelugeService} from './services/deluge';

import {AppComponent} from './app.component';

bootstrap(AppComponent, [
  ROUTER_PROVIDERS,

  provide(DelugeService, {
    useFactory: () => {
      var ds = new DelugeService();
      var s = localStorage.getItem('serverURL');
      var pw = localStorage.getItem('password');

      if (s && pw)
        ds.auth(s, pw);

      return ds;
    },
  }),
]);

