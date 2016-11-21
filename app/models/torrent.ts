import {Serializable, prop} from './serializable';
import {Directory, File, fromFlatTree, getAllFiles} from './tree';
import {ValueMap} from './map';
import {Tracker} from './tracker';
import {Peer} from './peer';

export class Torrent extends Serializable {
  // The SHA-1 has of the torrent's bencoded information section. Commonly used
  // to refer to the torrent.
  hash: string;

  // The total number of peers deluge is aware exists. A peer is a client who
  // is has not completed downloading the whole torrent. They may or may not be
  // sharing pieces.
  @prop('total_peers') peersCount: number;

  // The ratio is the ratio of the amount of data uploaded to the amount of
  // data downloaded.
  @prop ratio: number;

  // A number between 0 and 100 representing the percentage downloaded of the
  // requested files.
  @prop progress: number;

  // This property is supplied by the label plugin.
  @prop label: string;

  // The state of the torrent. One of Downloading, Seeding, Paused, Queued or
  // Error.
  @prop state: string;

  // The main domain of the tracker, obtained from the tracker url.
  @prop('tracker_host') tracker: string;

  // The human readable name used to refer to the torrent in the interfaces.
  @prop name: string;

  // Whether or not the torrent is private. A private torrent will only use
  // trackers to find peers. Peering mechanisms like DHT, PeX, or LSD are
  // disabled for these torrents.
  @prop('private') priv: boolean;

  // Weather or not the client is a seeder. The client becomes a seeder when it
  // has downloaded all parts of the torrent.
  @prop('is_seed') seeding: boolean;

  // The amount of time in seconds the torrent has been active for.
  @prop('active_time') timeActive: number;

  // The estimated amount of time in seconds until the torrent is complete.
  @prop('eta') timeRemaining: number;

  // The time the torrent was added to the client represented in Unix Epoch
  // format.
  @prop('time_added') timeAdded: number;

  // The number of bytes downloaded.
  @prop('all_time_download') totalDownloaded: number;

  // The number of bytes uploaded.
  @prop('total_uploaded') totalUploaded: number;

  @prop('download_payload_rate') downloadSpeed: number;
  @prop('upload_payload_rate') uploadSpeed: number;

  // The total number of bytes that the torrent has information about.
  @prop('total_size') size: number;

  // The optional comment added to the torrent at the time of creation.
  @prop comment: string;

  // The files or directories available for download in the torrent.
  tree: Directory|File;

  // The trackers connected to.
  trackers: ValueMap<Tracker>;

  // The peers connected to.
  peers: ValueMap<Peer>;

  configuration: TorrentConfiguration;

  constructor(o: Object, hash: string)
  constructor(hash: string)
  constructor(o: string|Object, hash?: string) {
    if (typeof o === 'string') {
      hash = o;
      super();
    } else if (typeof o === 'object') {
      super(o);
    }

    this.trackers = new ValueMap<Tracker>((d, i) => d.url);
    this.peers = new ValueMap<Peer>((d, i) => d.ip);

    if (hash) {
      this.hash = hash;
    }
  }

  unmarshall(o: Object) {
    if (o === undefined)
      return;

    super.unmarshall(o);

    if (o['peers']) {
      this.peers.updateFromArray(o['peers'], v => v.ip, v => new Peer(v));
    }

    if (o['trackers']) {
      this.trackers.updateFromArray(o['trackers'], v => v.url, v => new Tracker(v));
    }

    if (o['files'] && !this.tree) {
      var t = fromFlatTree(o['files']);
      apply(t);
      // TODO: Fix this
      this.files = getAllFiles(t);
      this.tree = t;

      function apply(t: Directory|File) {
        if (t instanceof File) {
          var i = t.index;
          t.priority = o['file_priorities'][i];
          t.progress = o['file_progress'][i];
        } else if (t instanceof Directory) {
          t.getAllFiles().forEach(apply);
        }
      }
    }

    if (!this.configuration)
      this.configuration = new TorrentConfiguration(o);
  }
};

export class TorrentConfiguration extends Serializable {
  @prop("max_download_speed") maximumDownloadSpeed: number;
  @prop("max_upload_speed") maximumUploadSpeed: number;
  @prop("max_connections") maximumConnections: number;
  @prop("max_upload_slots") maximumUploadSlots: number;

  @prop("prioritize_first_last") prioritized: boolean;
  @prop("is_auto_managed") managed: boolean;

  @prop("stop_ratio") stopRatio: number;
  @prop("stop_at_ratio") stopAtRatio: boolean;
  @prop("remove_at_ratio") removeAtRatio: boolean;

  @prop("move_completed") moveCompleted: boolean;
  @prop("move_completed_path") completedPath: string;
}

