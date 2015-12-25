import {ValueMap} from 'app/models/map';
import {Serializable, prop} from 'app/models/serializable';

class X extends Serializable {
  @prop('key') hash: string;
  @prop('some_value') information: string;
}

describe('valuemap model', () => {
  var t, d;

  beforeEach(() => {
    t = new ValueMap((v, i) => v.hash);
    d = {hash: '123', information: "America"};
    t.add(d);
  });

  it('should add values', () => {
    expect(t.values[0]).toBe(d);
  });

  it('should be able to add values by setting', () => {
    var a = {hash: '54', information: 'top secret'};
    t.set('54', a)
    expect(t.get('54')).toBe(a);
  });

  it('should get values', () => {
    expect(t.get('123')).toBe(d);
  });

  it('should delete values', () => {
    t.remove('123');
    expect(t.values.length).toEqual(0);
  });

  it('should delete values by index', () => {
    t.remove(0);
    expect(t.values.length).toEqual(0);
  });

  it('should overwrite values', () => {
    var s = {hash: '123', information: "ISIS"};
    t.set('123', s);
    expect(t.get('123')).toBe(s);
  });

  it('should be able to check whether it has a value', () => {
    expect(t.has('123')).toEqual(true);
    expect(t.has('1')).toEqual(false);
  });

  it('should be loopable', () => {
    d = {hash: '123', information: "America"};
    t.add(d);

    t.each((k, v, i) => {
      expect(v).toBe(t.values[i]);
      expect(k).toBe(t.values[i].hash);
    });
  });

  it('should be able to update from an array of objects', () => {
    var m = new ValueMap<X>(d => d.hash);
    var y = [
      {key: 'lsdkaj', some_value: 'daskdjal'},
      {key: 'special', some_value: 'honeypot'},
    ];

    m.updateFromArray(y, (v, i) => v.key, v => new X(v));
    console.log(m);

    expect(m.values.length).toBe(2);
  });
});

