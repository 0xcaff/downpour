import { HttpModule, Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';

import { DelugeService } from './deluge.service';

describe('deluge service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DelugeService,

        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ],
      imports: [HttpModule],
    });
  });

  it('should create',
    inject([DelugeService], (ds: DelugeService) => {
    expect(ds.rpc).not.toBeNull();
    expect(ds.auth).not.toBeNull();
  }));

  it('should authenticate',
    async(inject([MockBackend, DelugeService], (mockBackend, delugeService) => {
    mockBackend.connections.subscribe(conn => {
      let respOpts = new ResponseOptions({ body: {"id": 10, "result": true, "error": null} });
      conn.mockRespond(new Response(respOpts));
    });

    delugeService.auth('http://drone.lan/deluge/json', 'topSecretPassword')
      .catch(fail)
      .subscribe(success => expect(success).toBe(true));
  })));

  it('should fail to authenticate',
    async(inject([MockBackend, DelugeService], (mockBackend, delugeService) => {
    mockBackend.connections.subscribe(conn => {
      let respOpts = new ResponseOptions({ body: {"id": 10, "result": false, "error": null} });
      conn.mockRespond(new Response(respOpts));
    });

    delugeService.auth('http://drone.lan/deluge/json', 'topSecretPassword')
      .catch(fail)
      .subscribe(success => expect(success).toBe(false));
  })));
});

