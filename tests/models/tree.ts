import {MockTree} from 'app/mock/tree.js';
import {Directory} from 'app/models/tree.js';

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

});

