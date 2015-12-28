import {MockTree} from 'app/mock/tree';
import {SingleFileTorrentRequest, MultiFileTorrentRequest} from 'app/mock/torrent_request';
import {SingleFileTorrent, MultiFileTorrent} from 'app/mock/torrent';
import {Directory, File, fromFilesTree, fromFlatTree, getAllFiles} from 'app/models/tree';

describe('tree model', () => {
  var tree: Directory;

  beforeEach(() => {
    tree = new Directory(MockTree);
  });

  it('should traverse an object into a tree', () => {
    expect(tree).not.toBeNull();
    console.log(tree);
  });

  it('should have the same number of directories in the top level as the mock', () => {
    expect(tree.directories.length).toEqual(1);
  });

  it('should have the same number of files in the top level as the mock', () => {
    expect(tree.files.length).toEqual(14);
  });

  it('should have files in the subdirectories', () => {
    expect(tree.directories[0].files.length).toEqual(3);
  });

  it('should name files correctly', () => {
    expect(tree.files[0].name).toEqual('04. Wiegenlied.flac');
  });

  it('should name directories correctly', () => {
    expect(tree.directories[0].name).toEqual('Artwork');
  });

  it('should analyze download property correctly for directories', () => {
    expect(tree.directories[0].download).toEqual(true);
  });

  it('should analyze download property correctly for files', () => {
    expect(tree.files[0].download).toEqual(true);
  });

  it('should mark all children when an ancestor is marked', () => {
    tree.download = false;
    expect(tree.files[0].download).toEqual(false);
    expect(tree.directories[0].download).toEqual(false);
    expect(tree.directories[0].files[0].download).toEqual(false);
  });

  it('should be able to flatten to the correct length', () => {
    expect(tree.flatten().length).toEqual(17);
  });

  it('should be able to flatten a directory correctly', () => {
    var files = tree.flatten()
    for (var i = 0; i < files.length; i++) {
      expect(files[i].index).toEqual(i);
    }
  });

  it('should be able to get the length of its children', () => {
    expect(tree.len).toEqual(230566199);
    expect(tree.directories[0].len).toEqual(49940930);
  });

  it('should be able to calculate the length of its children', () => {
    tree.len = undefined;
    expect(tree.len).toEqual(230566199);
    expect(tree.directories[0].len).toEqual(49940930);
  });
});

describe('fileTree handling', () => {
  it('should be able to unmarshall fileTrees with multiple files', () => {
    var mftr = MultiFileTorrentRequest;
    var r = fromFilesTree(mftr['files_tree']);

    expect(r instanceof Directory).toEqual(true);
    expect(r.directories.length).toEqual(0);
    expect(r.files.length).toEqual(7);
  });

  it('should be able to unmarshall fileTrees with single files', () => {
    var sft = SingleFileTorrentRequest;
    var r = fromFilesTree(sft['files_tree']);

    expect(r instanceof File).toEqual(true);
    expect(r.name).toEqual('ubuntu-15.10-desktop-amd64.iso');
  });
});

describe('flatTree handling', () => {
  it('should be able to unmarshall single file flatTrees', () => {
    var fs = SingleFileTorrent['files'];
    var r = fromFlatTree(fs);

    expect(r instanceof File).toEqual(true);
    expect(r.name).toEqual(fs[0]['path']);
  });

  it('should be able to unmarshall multi file flatTrees', () => {
    var fs = MultiFileTorrent['files'];
    var r = fromFlatTree(fs);

    expect(r instanceof Directory).toEqual(true);
    expect(r.name).toEqual(fs[0]['path'].split('/')[0]);
  });
});

describe('getAllFiles', () => {
  it('should be able to get all files from a single file torrent', () => {
    var r = fromFlatTree(SingleFileTorrent['files']);
    var af = getAllFiles(r)

    expect(af.length).toEqual(1);
  });

  it('should be able to get all files from a multi file torrent', () => {
    var fs = MultiFileTorrent['files'];
    var r = getAllFiles(fromFlatTree(fs));

    expect(r.length).toEqual(fs.length);
  });
});
