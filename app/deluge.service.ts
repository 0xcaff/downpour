import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Torrent } from './models/torrent';
import { ValueMap } from './models/map';
import { TorrentRequest, TorrentType } from './models/torrent_request';
import { Configuration } from './models/configuration';
import { File, Directory, fromFilesTree } from './models/tree';
import { State } from './models/state';

export class DelugeError extends Error {
  code: number;

  constructor(rawError: Object) {
    super(rawError['message']);
    this.name = "DelugeError";
    this.message = rawError['message'];
    this.code = rawError['code'];
  }
}

// TODO: Statelessness
@Injectable()
export class DelugeService {
  constructor(private http: Http) { }

  // The URL at which the JSON endpoint of the server is located at.
  serverURL: string;

  // ID of the next RPC request.
  id: number = 0;

  // Calls a method on the remote using the rpc protocol over json.
  rpc(method: string, payload: any, serverURL?: string): Observable<Object> {
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
      .map(resp => {
        var body;
        try {
          body = resp.json();
        } catch (err) {
          if (err instanceof SyntaxError) {
            // JSON Parse Error
            // console.error(`Not a JSON Endpoint: ${serverURL}`);
            // console.error(`Recieved: ${resp.text()}`);
            throw new Error("Didn't Get JSON");
          } else {
            throw err;
          }
        }

        if (body.error) {
          throw new DelugeError(body.error);
        }

        return body.result;
      });
  }

  // Authenticates the client with the server, configuring the session.
  auth(serverURL: string, password: string): Observable<boolean> {
    return this.rpc('auth.login', [password], serverURL);
  }

  isAuthed(serverURL: string): Observable<boolean> {
    return this.rpc('auth.check_session', [], serverURL);
  }

  // Bring state into the server's ui state.
  // TODO: Immutable or Observer?
  updateState(state: State, params: string[]): Observable<State> {
    return this.rpc('web.update_ui', [params, {}])
      .map(d => {
        state.unmarshall(d);
        return state;
      });
  }

  // syncOnceInformation: string[];
  // currentTorrent: Torrent;

  // syncTorrent(hash: string): Observable<any> {
  //   if (!this.currentTorrent)
  //     this.currentTorrent = new Torrent(hash);

  //   return this.rpc('web.get_torrent_status', [hash, this.syncOnceInformation])
  //     .map(d => this.currentTorrent.unmarshall(d))
  //     .map(_ => this.currentTorrent);
  // }

  pause(hashes: string[]): Observable<any> {
    return this.rpc('core.pause_torrent', [hashes])
  }

  resume(hashes: string[]): Observable<any> {
    return this.rpc('core.resume_torrent', [hashes]);
  }

  remove(hashes: string[], removeData: boolean): Promise<any> {
    return Promise.all(hashes.map((v, i) => {
      return this.rpc('core.remove_torrent', [v, removeData]).toPromise();
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

// Continously poll, one response after another. Guarantees that request() will
// be called no more than once per interval.
export function poll(request: () => Observable<T>, interval: number): Observable<T> {
  return request().expand(() => {
    return Observable.combineLatest(
      request(),
      Observable.timer(interval),
      (resp, _) => resp,
  });

  // return this.rpc(method, payload).take(1).expand(() => {
  //   // After Both Occur, Send the next request
  //   return Observable.combineLatest(
  //     this.rpc(method, payload),
  //     Observable.timer(1000),
  //     (resp, _) => resp,
  //   );
  // });
}

