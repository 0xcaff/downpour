export interface Torrent {
  hash: string;
  peers: number;
  ratio: number;
  label: string;
  state: string;
  progress: number;
  tracker: string;
  name: string;
};

export function marshall(hash: string, o: Object): Torrent {
  return {
    hash: hash,
    peers: o['num_peers'],
    ratio: o['ratio'],
    label: o['label'],
    state: o['state'],
    progress: o['progress'],
    tracker: o['tracker_host'],
    name: o['name']
  }
}

// TODO: Use this
// enum State {
//   Seeding,
//   Uploading,
//   Downloading,
//   Errored,
// }

