import {prop, Serializable} from 'app/models/serializable';

class Test extends Serializable {
  @prop('special') t: number;
  @prop a: string;
  @prop('nested.data') data: string;

  constructor(o: Object);
  constructor(o: string);

  constructor(o: any) {
    if (typeof o == 'object') {
      super(o);
    } else if (typeof o == 'string') {
      this.a = o;
      this.t = 1;
    }
  }
}

describe('serializable model', () => {
  var test: Test;

  beforeEach(() => {
    test = new Test('st');
  });

  it('should have prototype data', () => {
    expect(test['__serialization__']).not.toBeNull();
    console.log(test);
  });

  it('should have explicit prototype data', () => {
    expect(test['__serialization__']['special']).toEqual('t');
  });

  it('should have implicit prototype data', () => {
    expect(test['__serialization__']['a']).toEqual('a');
  });

  it('should serialize correctly', () => {
    expect(test.marshall()).toEqual({special: 1, a: 'st'});
  });

  it('should deserialize correctly', () => {
    var t: Test = new Test({special: 1, a: 'st'});
    expect(t.t).toEqual(1);
    expect(t.a).toEqual('st');
  });

  it("shoudn't apply extra properties as undefined", () => {
    var t: Test = new Test({special: 1, extra: 'random'});
    expect(t.extra).not.toBeDefined();
  });

  it('should deserialize with dot properties', () => {
    var t: Test = new Test({special: 1, nested: {data: 'tesT'}});
    expect(t.data).toEqual('tesT');
  });

  xit('should serialize with dot properities', () => {
    test.data = 'testdata';
    var r = test.marshall();
    expect(r.nested.data).toEqual('testdata');
  });
});

