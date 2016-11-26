import { ObjectPipe, match } from './object.pipe';

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
  var op = new ObjectPipe();
  var ta = [
    {
      hash: 'abc',
      label: 'debian',
      name: 'kali linux',
      state: 'paused',
      active: false,
      size: 1000 * 10
    },
    {
      hash: 'dec',
      label: 'debian',
      name: 'debian vanilla linux',
      state: 'seeding',
      active: true,
      size: 1000 * 100
    },
    {
      hash: 'uniq',
      label: 'arch',
      name: 'arch linux',
      state: 'seeding',
      active: false,
      size: 1000 * 15
    },
    {
      hash: 'sda',
      label: 'arch',
      name: 'my custom linux',
      state: 'downloading',
      active: true,
      size: 1000 * 5
    },
  ];

  it('should match with tags', () => {
    var r = op.transform(ta, 'label: debian');
    expect(r.length).toEqual(2);

    r = op.transform(ta, 'label: arch');
    expect(r.length).toEqual(2);
  });

  it('should fuzzy search', () => {
    var r = op.transform(ta, 'custom');
    expect(r[0]).toBe(ta[3]);
  });

  it('should match with tags and fuzzy searching', () => {
    var r = op.transform(ta, 'k lnx label: debian');
    expect(r[0]).toBe(ta[0]);
  });

  it('should filter with size', () => {
    var r = op.transform(ta, 'size > 5kb');
    expect(r.length).toEqual(3);
  });

  it('should filter with multiple sizes', () => {
    var r = op.transform(ta, 'size > 10kb size < 20kb');
    expect(r.length).toEqual(1);
  });

  it('should filter by size and label', () => {
    var r = op.transform(ta, 'label:debian size > 10kb');
    expect(r.length).toEqual(1);
  });

  it('should filter by label caseless', () => {
    var r = op.transform(ta, 'label:DebIAN');
    expect(r.length).toEqual(2);
  });

  it('should be able to sort', () => {
    var r = op.transform(ta, '', 'name');
    expect(r[0]).toBe(ta[2]);
  });

  it('should be able to reverse sort', () => {
    var r = op.transform(ta, '', 'size', true);
    expect(r[0]).toBe(ta[1]);
  });

  it('should sort and fuzzy', () => {
    var r = op.transform(ta, 'custom', 'size');
    expect(r[0]).toBe(ta[3]);
  });

  it('should sort and filter', () => {
    var r = op.transform(ta, 'label: arch', 'size', true);
    expect(r.length).toEqual(2);
    expect(r[0]).toBe(ta[2]);
    expect(r[1]).toBe(ta[3]);
  });

  it('should sort filter and fuzzy', () => {
    var r = op.transform(ta, 'label: arch arch', 'size', true);
    expect(r[0]).toBe(ta[2]);
  });
});

