import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Torrent } from './models/torrent';
import { TorrentInformation, TorrentType, RawAddTorrentRequest } from './models/torrent-information';
import { Configuration } from './models/configuration';
import { File, Directory, fromFilesTree } from './models/tree';
import { State } from './models/state';

@Injectable()
export class DelugeService {
  constructor(private http: Http) { }

  // The URL at which the JSON endpoint of the server is located at.
  serverURL: string;

  // ID of the next RPC request.
  id: number = 0;

  // Calls a method on the remote using the rpc protocol over json.
  rpc(method: string, payload: any, serverURL?: string): Observable<any> {
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

  // Authenticates the client with the server.
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

  updateTorrent(torrent: Torrent, hash: string, params: string[]): Observable<Torrent> {
    return this.rpc('web.get_torrent_status', [hash, params])
      .map(raw => {
        torrent.unmarshall(raw);
        return torrent;
      });
  }

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

  // Get a torrent's files.
  getTree(hash: string): Observable<Directory|File> {
    return this.rpc('web.get_torrent_files', [hash])
      .map(d => fromFilesTree(d));
  }

  // updateTorrentSettings(t?: Torrent): Promise<any> {
  //   if (t === undefined)
  //     t = this.currentTorrent;

  //   return this.rpc('core.set_torrent_options', [[t.hash], t.configuration.marshall()])
  // }

  // Upload torrent files to the server for parsing and adding.
  uploadTorrents(files: FileList): Observable<RawUploadsResponse> {
    var formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      let file = files.item(i);
      formData.append('file', file);
    }

    return this.http.post(this.serverURL + '/../upload', formData)
      .map(resp => resp.json());
  }

  // Get torrent information given a file path on the server to a torrent.
  getTorrentInfo(serverPath: string): Observable<TorrentInformation> {
    return this.rpc('web.get_torrent_info', [serverPath])
      .map(raw => {
        let torrentInfo = new TorrentInformation();
        torrentInfo.path = serverPath;
        torrentInfo.format = TorrentType.File;
        torrentInfo.unmarshall(raw);
        return torrentInfo;
      });
  }

  getTorrentInfoFromLink(link: string): Observable<TorrentInformation> {
    if (link.startsWith('magnet')) {
      // Magnet Link
      return this.rpc('web.get_magnet_info', [link])
        .map(raw => {
          if (!raw) {
            // Returns a bool false if request failed.
            throw new Error("Not a valid torrent.");
          }

          let torrentInfo = new TorrentInformation();
          torrentInfo.path = link;
          torrentInfo.format = TorrentType.Magnet;
          torrentInfo.unmarshall(raw);

          return torrentInfo;
        });
    } else {
      // Remote File, Fetch It
      return this.rpc('web.download_torrent_from_url', [link])
        .switchMap(serverPath => this.getTorrentInfo(serverPath));
    }
  }

  addTorrent(request: RawAddTorrentRequest): Observable<any> {
    return this.rpc('web.add_torrents', [[request]]);
  }

  getConfiguration(params: string[] = []): Observable<Configuration> {
    return (() => {
      if (params.length === 0) {
        return this.rpc('core.get_config', [])
      } else {
        return this.rpc('core.get_config_values', [params])
      }
    })().map(raw => {
      let conf = new Configuration();
      conf.unmarshall(raw);
      return conf;
    });
  }

  setConfiguration(c: Configuration): Observable<void> {
    return this.rpc('core.set_config', [c.marshall()]);
  }
}

export class DelugeError extends Error {
  code: number;

  constructor(rawError: Object) {
    super(rawError['message']);
    this.name = "DelugeError";
    this.message = rawError['message'];
    this.code = rawError['code'];
  }
}

// Continously poll, one response after another. Guarantees that request() will
// be called no more than once per interval.
export function poll<T>(request: () => Observable<T>, interval: number): Observable<T> {
  return request().expand(() =>
    Observable.combineLatest(
      request(),
      Observable.timer(interval),
      (resp, _) => resp,
  ));
}

export interface RawUploadsResponse {
  // Paths of files on the server.
  files: string[];

  // Whether or not the upload was sucessful.
  success: boolean;
}

