import { Serializable, prop } from './serializable';
import { Directory, File, fromFilesTree } from './tree';
import { Configuration } from './configuration';

// Holds information about a torrent file before it is added.
export class TorrentInformation extends Serializable {
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

  unmarshall(d: Object) {
    super.unmarshall(d);

    if (this.format == TorrentType.File) {
      this.tree = fromFilesTree(d['files_tree']);
    }
  }

  // Returns the data for a request to start a torrent.
  marshallWithConfig(config: Configuration): RawAddTorrentRequest {
    let priorities: number[];

    if (this.format == TorrentType.Magnet) {
      priorities = [];
    } else if (this.tree instanceof Directory) {
      priorities = this.tree.flatten().map(d => +d.download);
    } else if (this.tree instanceof File) {
      priorities = [+this.tree.download];
    }

    let options = config.marshall();
    options['file_priorities'] = priorities;

    return {
      path: this.path,
      options: options,
    }
  }
}

export interface RawAddTorrentRequest {
    // The path of the torrent file on the server.
    path: string;

    // Configuration Options
    options: Object;
}

export enum TorrentType {
  Magnet,
  File,
}

