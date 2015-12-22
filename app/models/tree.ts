import {Serializable, prop} from './serializable';

export class File extends Serializable {
  // Used to store whether or not the file should be downloaded, when
  // downloading the torrent.
  @prop download: boolean;

  // Length of File in bytes
  @prop('length') len: number;

  // Unique index of file in the torrent. Used to identify the file.
  @prop index: number;

  // The path of the file relative to the download directory of the torrent.
  @prop path: string;

  // The name of the file with extension.
  name: string;

  constructor(o: any, name: string) {
    super(o);
    this.name = name;
  }
}

// TODO: Use serializable
export class Directory {
  files: File[] = new Array();
  directories: Directory[] = new Array();
  name: string;
  len: number;

  private _download: boolean;
  get download(): boolean {
    return this._download;
  }

  set download(d: boolean) {
    for (var i = 0; i < this.files.length; i++) {
      this.files[i]['download'] = d;
    }

    for (var i = 0; i < this.directories.length; i++) {
      this.directories[i]['download'] = d;
    }

    this._download = d;
  }

  constructor(name: string);
  constructor(o: Object);

  constructor(stringOrObject: any, len: any) {
    if (typeof stringOrObject == 'string') {
      this.name = stringOrObject;
      this.len = len;
    } else if (typeof stringOrObject == 'object') {
      var o: Object = stringOrObject;
      var rootDir: string = Object.keys(o)[0];

      this.name = rootDir;
      this.len = o[rootDir]['length'];

      this.download = o[rootDir]['download'];
      this.recurse(o[rootDir]['contents']);
    }
  }

  // Could be more efficient
  flatten(): File[] {
    var r = [];
    r.push(...this.files);
    for (var i = 0; i < this.directories.length; i++) {
      r.push(...this.directories[i].flatten());
    }
    return r.sort(function(a: File, b: File): number {
      if (a.index > b.index)
        return 1;
      else if (a.index < b.index)
        return -1;
      else
        return 0;
    });
  }

  private recurse(obj: any) {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      var key: string = keys[i];

      if (obj[key]['type'] == 'file') {
        var f = new File(obj[key], key);
        this.files.push(f);
      } else if (obj[key]['type'] == 'dir') {
        var d: Directory = new Directory(key, obj[key]['length']);
        d.recurse(obj[key]['contents']);
        d.download = obj[key]['download'];
        this.directories.push(d);
      }
    }
  }
}

