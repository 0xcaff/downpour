export class ValueMap<T> {
  values: T[] = [];
  accessor: accessorFunction;

  constructor(accessor: accessorFunction) {
    this.accessor = accessor;
  }

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
  updateFromArray(a: Object[], objectAccessor: Function, createObject: Function) {
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

  private runKey(key: string, doSomething: Function): boolean {
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
