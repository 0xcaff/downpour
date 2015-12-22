import {BytesPipe} from 'app/pipes/bytes';

describe('bytes pipe', () => {
  var bp = new BytesPipe();

  it('should format bytes', () => {
    expect(bp.transform(1000)).toEqual('1 KB');
    expect(bp.transform(1831982)).toEqual('2 MB');
  });

  it('should work with 0', () => {
    expect(bp.transform(0)).toEqual('0 B');
  });

  it('should work with small numbers', () => {
    expect(bp.transform(78)).toEqual('78 B');
  });

  it('should format with precision', () => {
    expect(bp.transform(1831982, [1])).toEqual('1.8 MB');
  });
});

