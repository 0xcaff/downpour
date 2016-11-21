import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Torrent } from './models/torrent';
import { ValueMap } from './models/map';
import { TorrentRequest, TorrentType } from './models/torrent_request';
import { Configuration } from './models/configuration';
import { File, Directory, fromFilesTree } from './models/tree';
import { State } from './models/state';

// TODO: More information
export class DelugeError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "DelugeError";
  }
}

@Injectable()
export class DelugeService {
  constructor(private http: Http) { }

  // Do we have an authenticated session with the server?
  authenticated: boolean;

  // The URL at which the JSON endpoint of the server is located at.
  serverURL: string;

  // Not really used, but required for a uniq val in rpc request.
  id: number = 0;

  // Calls a method on the remote using the rpc protocol over json.
  // TODO: Support Sockets for Native App
  rpc(method: string, payload: any, serverURL?: string): Promise<Error|Object> {
    let options = new RequestOptions({
      withCredentials: true,
    });

    if (!serverURL)
      serverURL = this.serverURL;

    return this.http.post(serverURL, {
      method: method,
      params: payload,
      id: this.id++,
    }, options)
      .toPromise()
      .then(resp => {
        var body;
        try {
          body = resp.json();
        } catch (err) {
          if (err instanceof SyntaxError) {
            // JSON Parse Error
            console.error(`Not a JSON Endpoint: ${serverURL}`);
            // console.error(`Recieved: ${resp.text()}`);
            return Promise.reject(new Error("Didn't Get JSON"));
          } else {
            return Promise.reject(err);
          }
        }

        if (body.error) {
          return Promise.reject(new DelugeError(body.error));
        }

        return Promise.resolve(body.result);
      });
  }

  // Authenticates the client with the server, configuring the session.
  auth(serverURL: string, password: string): Promise<string|void> {
    return this.rpc('auth.login', [password], serverURL)
      .then(success => {
        if (success) {
          this.serverURL = serverURL;
          this.authenticated = true;
          return Promise.resolve()
        } else {
          return Promise.reject("Authentication Failed")
        }
      })
  }

  // The information requested about each torrent every time sync is called.
  // These are the values requested by default by the official deluge web client.
  syncStateInformation: string[] = [''];

  state: State = new State();
  stateChanged: EventEmitter<State> = new EventEmitter();

  // Brings the service's state in sync with the remote's state.
  // TODO: Immutable or Observer?
  sync(): Promise<State> {
    return this.rpc('web.update_ui', [this.syncStateInformation, {}])
      .then(d => {
        this.state.unmarshall(d);
        this.stateChanged.emit(this.state);
        return this.state;
      });
  }

  syncOnceInformation: string[];
  currentTorrent: Torrent;

  syncTorrent(hash: string): Promise<any> {
    if (!this.currentTorrent)
      this.currentTorrent = new Torrent(hash);

    return this.rpc('web.get_torrent_status', [hash, this.syncOnceInformation])
      .then(d => this.currentTorrent.unmarshall(d))
      .then(_ => this.currentTorrent);
  }

  pause(hashes: string[]): Promise<any> {
    return this.rpc('core.pause_torrent', [hashes])
  }

  resume(hashes: string[]): Promise<any> {
    return this.rpc('core.resume_torrent', [hashes]);
  }

  remove(hashes: string[], removeData: boolean): Promise<any> {
    return Promise.all(hashes.map((v, i) => {
      return this.rpc('core.remove_torrent', [v, removeData]);
    }));
  }

  getTree(hash: string): Promise<Directory|File> {
    return this.rpc('web.get_torrent_files', [hash])
      .then(d => fromFilesTree(d));
  }

  updateTorrentSettings(t?: Torrent): Promise<any> {
    if (t === undefined)
      t = this.currentTorrent;

    return this.rpc('core.set_torrent_options', [[t.hash], t.configuration.marshall()])
  }

  // Takes a URL, Magnet Link, or location on the remote server and returns a
  // TorrentRequest.
  getInfo(url: string, serverFile: boolean = false): Promise<TorrentRequest> {
    var ti = new TorrentRequest();
    return (() => {
      if (url.startsWith('magnet') && !serverFile) {
        ti.format = TorrentType.Magnet;
        ti.path = url;
        return this.rpc('web.get_magnet_info', [url]);
      } else {
        ti.format = TorrentType.File;

        return (() => {
          if (!serverFile) {
            return this.rpc('web.download_torrent_from_url', [url])
          } else {
            return Promise.resolve(url);
          }
        })()
        .then(d => {
          ti.path = d
          return this.rpc('web.get_torrent_info', [d])
        })
      }
    })()
    .then(d => {
      ti.unmarshall(d)
      return ti;
    })
  }

  getTorrentInfo(f: File): Promise<TorrentRequest> {
    var fd = new FormData();
    fd.append('file', f);

    return fetch(this.serverURL + '/../upload', {
      method: 'POST',
      body: fd,
      mode: 'cors',
      credentials: 'include',
    })
      .then(d => d.json())
      .then(d => this.getInfo(d['files'][0], true));
  }

  getConfiguration(params: string[] = []): Promise<Configuration> {
    if (params.length == 0) {
      return this.rpc('core.get_config', [])
        .then(d => new Configuration(d));
    } else {
      return this.rpc('core.get_config_values', [params])
        .then(d => new Configuration(d));
    }
  }

  setConfiguration(c: Configuration): Promise<void> {
    return this.rpc('core.set_config', [c.marshall()]);
  }
}

