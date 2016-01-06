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

  // A number between zero and ten describing the priority of the file in the
  // torrent. If the priority is zero, there file will not be downloaded.
  @prop priority: number;

  // The progress of the file which has been downloaded as a number between 0-1.
  @prop progress: number;

  constructor(o: any, name?: string) {
    super(o);
    if (name) {
      this.name = name;
    } else if (o['path']) {
      var p = this.path.split('/');
      this.name = p[p.length - 1];
    }
  }

  unmarshall(o: Object) {
    super.unmarshall(o);
    if (o['size'] && !this.len)
      this.len = o['size'];
  }
}

export class Directory {
  files: File[] = new Array();
  directories: Directory[] = new Array();
  name: string;
  len: number;

  private _download: boolean;
  get download(): boolean {
    if (this._download === undefined)
      this._download = (
        !this.files.some((f) => !f.download)
          &&
        !this.directories.some((d) => !d.download)
      );
    return this._download;
  }

  set download(d: boolean) {
    if (d == this._download) return;
    for (var i = 0; i < this.files.length; i++) {
      this.files[i]['download'] = d;
    }

    for (var i = 0; i < this.directories.length; i++) {
      this.directories[i]['download'] = d;
    }

    this._download = d;
  }

  private _len: number;
  get len(): number {
    if (this._len) return this._len;
    this._len = this.getAllFiles().reduce((pv, cv) => pv + cv.len, 0);
    return this._len;
  }

  set len(l: number) {
    this._len = l;
  }

  constructor(name: string)
  constructor(fileTree: Object, name?: string)
  constructor(fileTree: Object|string, name?: string) {
    if (typeof fileTree === 'object') {
      var children = Object.keys(fileTree);
      if (name !== undefined) {
        this.name = name;
      } else {
        this.name = children[0];
        fileTree = fileTree[this.name]['contents'];
        children = Object.keys(fileTree);
      }

      for (var i = 0; i < children.length; i++) {
        var childName = children[i];
        var child = fileTree[childName];
        if (child['type'] == 'file') {
          this.files.push(new File(child));
        } else if (child['type'] == 'dir') {
          this.directories.push(new Directory(child['contents'], childName));
        }
      }
    } else if (typeof fileTree === 'string') {
      this.name = fileTree;
    }
  }

  // Returns all files contained by this directory and its siblings.
  getAllFiles(): File[] {
    var r = [];
    r.push(...this.files);
    for (var i = 0; i < this.directories.length; i++)
      r.push(...this.directories[i].getAllFiles());
    return r;
  }

  // A convienience method to get an array of all files sorted by their index property.
  flatten(): File[] {
    return this.getAllFiles().sort((a: File, b: File) => a.index - b.index);
  }
}

export function fromFilesTree(ft: Object, name?: string): File|Directory {
  if (ft['type'] == 'dir') {
    var children = Object.keys(ft['contents']);
    var childName = children[0];
    var child = ft['contents'][childName];

    if (name === undefined && children.length == 1) {
      return fromFilesTree(child, childName);
    } else {
      return new Directory(ft['contents'], name);
    }
  } else {
    if (name === undefined) {
      var k = Object.keys(ft['contents'])[0];
      var o = ft['contents'][k];
      return fromFilesTree(o, k);
    } else {
      return new File(ft, name);
    }
  }
};

export function fromFlatTree(flat: Object[]): File|Directory {
  var t = new Directory('');
  for (var i = 0; i < flat.length; i++) {
    var f = flat[i];

    var p = f['path'].split('/');
    recurse(t, p, 0, f);
  }

  if (t.files.length == 1) {
    return t.files[0];
  } else if (t.directories.length == 1) {
    return t.directories[0];
  }

  function recurse(tree: Directory, pathArray: string[], index: number, fo: Object) {
    if (index == pathArray.length - 1)
      tree.files.push(new File(fo));
    else {
      var n = pathArray[index];
      var t = tree.directories.filter((v, i, a) => v.name == n)[0];
      if (!t) {
        t = new Directory(n);
        tree.directories.push(t);
      }

      recurse(t, pathArray, index+1, fo);
    }
  }
}

export function getAllFiles(tree: File|Directory): File[] {
  if (tree instanceof File)
    return [tree];
  else if (tree instanceof Directory)
    return tree.getAllFiles();
}
