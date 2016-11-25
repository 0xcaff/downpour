import {Serializable, prop} from './serializable';
import {Directory, File, fromFilesTree} from './tree';
import {Configuration} from './configuration';

export class TorrentRequest extends Serializable {
  // The name of the torrent as returned from the server. For magnet links, this
  // name is the name supplied as a parameter of the magnet link. If a name
  // cannot be determined, the hash is returned as the name.
  @prop name: string;

  // The SHA-1 hash used to identify the torrent.
  @prop('info_hash') hash: string;

  // The file tree of the torrent. For magnet links, this is blank.
  tree: File|Directory;

  // The path of the file on the server which the torrent client will download.
  // For magnet links, this is the magnet URL.
  path: string;

  format: TorrentType;

  constructor() { super() }

  // TODO: move file type discovery into here
  unmarshall(d: Object) {
    super.unmarshall(d);

    if (this.format == TorrentType.File) {
      this.tree = fromFilesTree(d['files_tree']);
    }
  }

  // Returns the data for a request to start a torrent.
  marshall(config: Configuration): Object {
    var r = {};
    var p;
    if (this.format == TorrentType.Magnet) {
      p = [];
    } else if (this.tree instanceof Directory) {
      p = this.tree.flatten().map(d => +d.download);
    } else if (this.tree instanceof File) {
      p = [+this.tree.download];
    }
    r['path'] = this.path;
    r['options'] = config.marshall();
    r['options']['file_priorities'] = p;

    return r;
  }
}

export enum TorrentType {
  Magnet,
  File,
}

