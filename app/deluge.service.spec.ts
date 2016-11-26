import { Http } from '@angular/http';
import { inject } from '@angular/core/testing';

import { DelugeService } from './deluge.service';

describe('deluge service', () => {
  it('should create',
    inject([Http, DelugeService], (http: Http, ds: DelugeService) => {
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
      .then(d => expect(ds.state.torrents.values.length).toBeGreaterThan(0))
      .then(done)
  });
});

