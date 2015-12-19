// import {HTTP_PROVIDERS, Http} from 'angular2/http';
// import {MockBackend} from 'angular2/http/testing';
import {Injector, provide} from 'angular2/core';

import {DelugeService} from 'app/services/deluge.js';
// import {Observable} from 'rxjs/Rx';

var injector = Injector.resolveAndCreate([
  // HTTP_PROVIDERS,
  provide(DelugeService, {
    useFactory: () => {
      var ds = new DelugeService();
      var s = localStorage.getItem('serverURL');
      var pw = localStorage.getItem('password');

      if (s && pw)
        ds.auth(s, pw);

      return ds;
    },
    // deps: [Http],
  }),
]);

// var p = Observable.just(100).toPromise()
//   .then(function (value) { console.log('Value: %s', s); });


describe('deluge service', () => {
  var ds;

  it('should create', () => {
    ds = injector.get(DelugeService);
    expect(ds.rpc).not.toBeNull();
    expect(ds.auth).not.toBeNull();
    expect(ds.sync).not.toBeNull();
  });

  it('should authenticate', (done) => {
    ds.auth('http://drone.lan/deluge/json', 'deluge')
      .catch(fail)
      .then(() => {
        expect(ds.authenticated).toBe(true);
        expect(ds.serverURL).not.toBeNull();
      })
      .then(done)
  });

  it('should sync', (done) => {
    ds.sync()
      .catch(fail)
      .then(d => expect(ds.torrents.size).toBeGreaterThan(0))
      .then(done)
  });
});

