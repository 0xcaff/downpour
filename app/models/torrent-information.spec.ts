import { TorrentInformation, TorrentType } from './torrent-information';
import { SingleFileTorrentRequest, MultiFileTorrentRequest, MagnetTorrentRequest, FileFolderTorrentRequest } from './torrent-information.mock';
import { Configuration } from './configuration';
import { File, Directory } from './tree';

describe('torrent request', () => {
  var tr;
  var cfg = new Configuration();

  it('should unmarshall single file torrents', () => {
    tr = new TorrentInformation();
    var sftr = SingleFileTorrentRequest;
    tr.format = TorrentType.File;
    tr.unmarshall(sftr);

    expect(tr.tree instanceof File).toEqual(true);
    expect(tr.tree.name).toEqual(sftr.name);
    expect(tr.hash).toEqual(sftr.info_hash);
    expect(tr.name).toEqual(sftr.name);
  });

  it('should unmarshall strange single file torrents', () => {
    var tr = new TorrentInformation();
    var fftr = FileFolderTorrentRequest;
    tr.format = TorrentType.File;
    tr.unmarshall(fftr);

    expect(tr.tree instanceof File).toEqual(true);
    expect(tr.tree.name).toEqual("Test.file");
  });

  it('should marshall a single file torrent', () => {
    var r = tr.marshallWithConfig(cfg);

    expect(r['options']['file_priorities'].length).toEqual(1);
  });

  it('should unmarshall multi file torrents', () => {
    tr = new TorrentInformation();
    var mftr = MultiFileTorrentRequest;
    tr.format = TorrentType.File;
    tr.unmarshall(mftr);

    expect(tr.tree instanceof Directory).toEqual(true);
    expect(tr.tree.directories.length).toEqual(1);
    expect(tr.tree.files.length).toEqual(7);
    expect(tr.name).toEqual(mftr.name);
  });

  it('should marshall multi file torrents', () => {
    var r = tr.marshallWithConfig(cfg);

    expect(r['options']['file_priorities'].length).toEqual(8);
  });

  it('should unmarshall magnet links', () => {
    tr = new TorrentInformation();
    var mtr = MagnetTorrentRequest;
    tr.format = TorrentType.Magnet;
    tr.unmarshall(mtr);

    expect(tr.tree).not.toBeDefined();
  });

  it('should marshall magnet links', () => {
    var r = tr.marshallWithConfig(cfg);

    expect(r['options']['file_priorities'].length).toEqual(0);
  });
});

