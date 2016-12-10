import { Serializable, prop } from './serializable';
import { ValueMap } from './map';
import { Torrent } from './torrent';

export class State extends Serializable {
  @prop('stats.upload_protocol_rate') protocolUploadSpeed: number;
  @prop('stats.download_protocol_rate') protocolDownloadSpeed: number;
  @prop('stats.download_rate') downloadSpeed: number;
  @prop('stats.upload_rate') uploadSpeed: number;
  @prop('stats.has_incoming_connections') sharing: boolean;
  @prop('stats.num_connections') connectionsCount: number;
  @prop('stats.free_space') freeSpace: number;
  @prop('stats.dht_nodes') dhtNodes: number;

  @prop('stats.max_upload') maxUploadSpeed: number;
  @prop('stats.max_download') maxDownloadSpeed: number;
  @prop('stats.max_num_connections') maximumConnectionsCount: number;

  // Whether the webui backend is connected to a deluged instance.
  @prop connected: boolean;
  torrents: ValueMap<Torrent> = new ValueMap<Torrent>((v, i) => v.hash);
  labels: string[];

  // TODO: Tests
  unmarshall(o: Object = {}) {
    super.unmarshall(o);

    if (o['torrents']) {
      var nk = Object.keys(o['torrents']);
      for (var i = 0; i < nk.length; i++) {
        var torrentHash = nk[i];

        if (Object.keys(o['torrents'][torrentHash]).length <= 0)
          // Assume All Torrents Are Empty
          break;

        if (this.torrents.has(torrentHash)) {
          // Interection of the Client Torrents and Server Torrents
          // Update Torrent
          var t = this.torrents.get(torrentHash);
          t.unmarshall(o['torrents'][torrentHash]);
          this.torrents.set(torrentHash, t);
        } else {
          // Torrents only on the Server
          // Add Torrent
          let torrent = new Torrent();
          torrent.hash = torrentHash;
          torrent.unmarshall(o['torrents'][torrentHash]);
          this.torrents.add(torrent);
        }
      }

      // Torrents only on the Client
      // Remove from Client
      this.torrents.each((k, v, i) => {
        if (nk.indexOf(k) == -1) {
          this.torrents.remove(k);
        }
      });
     }

    // Populate Labels
    if (!this.labels && o['filters'] && o['filters']['label']) {
      this.labels = o['filters']['label']
        .reduce((labels, labelObject) => {
          let [text, id] = labelObject;
          if (text == "") {
            text = "unlabeled";
          } else if (text == "All") {
            return labels;
          }

          labels.push(text);
          return labels;
        }, []);
    }
  }
}

