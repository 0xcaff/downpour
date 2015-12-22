import {Injector} from 'angular2/core';
import {DelugeService} from 'app/services/deluge';

describe('deluge service', () => {
  var ds;

  var injector = Injector.resolveAndCreate([
    DelugeService,
  ]);

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

