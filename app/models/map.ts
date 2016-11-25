// This data structure pretends to be a map and an array while being neither and
// having terrible complexity. JavaScript array's are implemented as hashmaps so
// this basically is an array pretending to be a map pretending to be a map +
// array.
export class ValueMap<T> {
  values: T[] = [];
  accessor: accessorFunction;

  constructor(accessor: accessorFunction) {
    this.accessor = accessor;
  }

  // TODO: O(n)
  has(key: string): boolean {
    return this.values.some((v, i, a) => key == this.accessor.apply(a, [v, i]));
  }

  remove(key: string|number): void {
    if (typeof key == 'string') {
      this.runKey(<string>key, function(v, i) {
        this.splice(i, 1);
      });
    } else if (typeof key == 'number') {
      this.values.splice(<number>key, 1);
    }
  }

  // TODO: O(n)
  set(key: string, value: T) {
    var r = this.runKey(key, function(v, i) {
      this[i] = value;
    });

    if (!r)
      this.add(value);
  }

  add(value: T) {
    this.values.push(value);
  }

  // TODO: O(n)
  get(key: string): T {
    var r;
    this.runKey(key, (v, i) => {
      r = v;
    });
    return r;
  }

  each(doSomething: Function): boolean {
    for (var i = 0; i < this.values.length; i++) {
      var k = this.accessor.apply(this.values, [this.values[i], i]);
      var v = this.values[i];

      var r = doSomething.apply(this.values, [k, v, i]);
      if (r)
        return true;
    }
  }

  // Loops over array a, using objectAccesor to get each element's key using the
  // information to bring this into the state of a. To use this function, T must
  // be serializable.
  // TODO: Tests
  updateFromArray(a: Object[], objectAccessor: (value: Object, index: number) => T, createObject: (value: Object) => T) {
    for (var i = 0; i < a.length; i++) {
      var v = a[i];
      var k = objectAccessor.apply(a, [v, i]);

      if (this.has(k)) {
        var c = this.get(k);
        c.unmarshall(v);
      } else {
        this.add(createObject(v));
      }
    }

    this.each((k, v, i) => {
      if (!a.some((iv, ii, ia) => objectAccessor.apply(ia, [iv, ii]) == k))
        this.remove(i);
    });
  }

  // TODO: O(n)
  private runKey(key: string, doSomething: (value: Object, index: number) => void): boolean {
    return this.each((k, v, i) => {
      if (key == k) {
        doSomething.apply(this.values, [v, i]);      
        return true;
      }
    });
  }
}

interface accessorFunction {
  (o: T, index: number): string;
}
