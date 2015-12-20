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
});

