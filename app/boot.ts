///<reference path="../typings/globals/es6-shim/index.d.ts"/>
import {ROUTER_PROVIDERS} from '@angular/router-deprecated';

import {bootstrap} from '@angular/platform/browser-dynamic';
import {provide} from '@angular/core';

import {DelugeService} from './services/deluge';
import {MobileService} from './services/mediaquery';
import {InputDetectorService} from './services/input-detector';

import {AppComponent} from './app';

bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  DelugeService,
  MobileService,
  InputDetectorService,
]);

