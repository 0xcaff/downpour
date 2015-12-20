export class File {
  download: boolean,

  // Length of File in bytes
  len: number,
  index: number,
  path?: string,
  name: string,

  constructor(o: any, public name: string) {
    this.download = o['download'];
    this.len = o['length'];
    this.index = o['index'];
  }
}

export class Directory {
  files: Files[] = new Array();
  directories: Directory[] = new Array();
  name: string;

  constructor(name: string);
  constructor(o: Object);

  constructor(stringOrObject: any) {
    if (typeof stringOrObject == 'string') {
      this.name = stringOrObject;
    } else if (typeof stringOrObject == 'object') {
      var o: Object = stringOrObject;
      var rootDir: string = Object.keys(o)[0];
      this.name = rootDir;
      this.recurse(o[rootDir]['contents']);
    }
  }

  private recurse(obj: any) {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      var key: string = keys[i];

      if (obj[key]['type'] == 'file') {
        var f = new File(obj[key], key);
        this.files.push(f);
      } else if (obj[key]['type'] == 'dir') {
        var d: Directory = new Directory(key);
        d.recurse(obj[key]['contents']);
        this.directories.push(d);
      }
    }
  }
}

