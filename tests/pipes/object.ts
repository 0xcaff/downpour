import {ObjectFilterPipe, match} from 'app/pipes/object';

describe('string matcher function', () => {
  it('should match multiple words', () => {
    expect(match('Mark Roson', 'Mark Roson xakdjslkd jaskldj sla')).toBeGreaterThan(-1);
  });

  it('should match fuzzy', () => {
    expect(match('idgaf', 'I dont get a ferrari')).toBeGreaterThan(-1);
  });

  it('should sort matches', () => {
    var a = match('fetty', 'Fetty Wap, my way');
    var b = match('fetty', 'the festive cat opened a tty');
    expect(a).toBeGreaterThan(b);
  });
});

describe('object filter pipe', () => {
  var op = new ObjectFilterPipe();
  var ta = [
    {hash: 'abc', label: 'debian', name: 'kali linux', state: 'paused', active: false},
    {hash: 'dec', label: 'debian', name: 'debian vanilla linux', state: 'seeding', active: true},
    {hash: 'uniq', label: 'arch', name: 'arch linux', state: 'seeding', active: false},
    {hash: 'sda', label: 'arch', name: 'my custom linux', state: 'downloading', active: true},
  ];

  it('should match with tags', () => {
    var r = op.transform(ta, ['label: debian']);
    expect(r.length).toEqual(2);

    r = op.transform(ta, ['label: arch']);
    expect(r.length).toEqual(2);
  });

  it('should fuzzy search', () => {
    var r = op.transform(ta, ['custom']);
    expect(r[0]).toBe(ta[3]);
  });

  it('should match with tags and fuzzy searching', () => {
    var r = op.transform(ta, ['k lnx label: debian']);
    expect(r[0]).toBe(ta[0]);
  });
});

