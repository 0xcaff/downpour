import {Injectable} from 'angular2/core';

import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import {Torrent} from '../models/torrent';
import {ValueMap} from '../models/map';
import {TorrentRequest, TorrentType} from '../models/torrent_request';

@Injectable()
export class DelugeService {
  // Do we have an authenticated session with the server.
  authenticated: boolean;

  // The URL at which the JSON endpoint of the server is located at.
  serverURL: string;

  // Not really used, but required for a uniq val in rpc request.
  id: number = 0;

  // Calls a method on the remote using the rpc protocol over json.
  // TODO: Support Sockets for Native App
  // TODO: Use Fetch for CORS?
  rpc(method: string, payload: any, serverURL?: string): Promise<string|Object> {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return fetch(
      (serverURL ? serverURL : this.serverURL),
      {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          method: method,
          params: payload,
          id: this.id++,
        }),
        credentials: 'include',
      }
    )
      .then(r => {
        if (r.ok)
          return Promise.resolve(r)
        else
          return Promise.reject(r)
      })
      .catch(_ => Promise.reject('Request Failed'))

      .then(d => d.json())
      .catch(d => {
        if (d)
          return Promise.reject(d);
        else
          Promise.reject("Failed to parse JSON")
      })

      .then(d => {
        if (d.error)
          return Promise.reject(d.error)
        else
          return Promise.resolve(d.result)
      });
  }

  // Authenticates the client with the server, configuring the session.
  auth(serverURL: string, password: string): Promise<string|void> {
    return this.rpc('auth.login', [password], serverURL)
      .then(
        d => {
          if (!d) {
            return Promise.reject("Authentication Failed")
          } else {
            this.serverURL = serverURL;
            this.authenticated = true;
            return Promise.resolve()
          }
        }
      )
  }

  // The information requested about each torrent every time sync is called.
  // These are the values requested by default by the official deluge web client.
  information: string[] = [
    "queue",
    "name",
    "total_wanted",
    "state",
    "progress",
    "num_seeds",
    "total_seeds",
    "num_peers",
    "total_peers",
    "download_payload_rate",
    "upload_payload_rate",
    "eta",
    "ratio",
    "distributed_copies",
    "is_auto_managed",
    "time_added",
    "tracker_host",
    "save_path",
    "total_done",
    "total_uploaded",
    "max_download_speed",
    "max_upload_speed",
    "seeds_peers_ratio",
    "label"
  ];

  torrents: ValueMap<Torrent> = new ValueMap((v, i) => v.hash);

  // Brings the service's state in sync with the remote's state.
  // TODO: Immutable or Observer?
  // TODO: Sync rest of state
  sync(): Promise<void> {
    return this.rpc('web.update_ui', [this.information, {}])
      .then(d => {
        // Update Local State
        var nk = Object.keys(d['torrents']);
        for (var i = 0; i < nk.length; i++) {
          var torrentHash = nk[i];
          if (this.torrents.has(torrentHash)) {
            // Interection of the Client Torrents and Server Torrents
            // Update Torrent
            var t = this.torrents.get(torrentHash);
            t.unmarshall(d['torrents'][torrentHash]);
            this.torrents.set(torrentHash, t);
          } else {
            // Torrents only on the Server
            // Add Torrent
            this.torrents.add(new Torrent(d['torrents'][torrentHash], torrentHash));
          }
        }

        // Torrents only on the Client
        // Remove from Client
        this.torrents.each((k, v, i) => {
          if (nk.indexOf(k) == -1) {
            this.torrents.remove(k);
          }
        });
      });
  }

  pause(hashes: string[]): Promise<any> {
    return this.rpc('core.pause_torrent', [hashes])
  }

  resume(hashes: string[]): Promise<any> {
    return this.rpc('core.resume_torrent', [hashes]);
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
}

