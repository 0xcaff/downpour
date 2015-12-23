export class ValueMap<T> {
  values: T[] = [];
  accessor: (o: T, index: number) => string;

  constructor(public accessor) { }

  has(key: string): boolean {
    return this.values.some((v, i, a) => key == this.accessor.apply(a, [v, i]));
  }

  remove(key: string): void {
    this.runKey(key, function(v, i) {
      this.splice(i, 1);
    });
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

  private runKey(key: string, doSomething: Function): boolean {
    return this.each((k, v, i) => {
      if (key == k) {
        doSomething.apply(this.values, [v, i]);      
        return true;
      }
    });
  }
}

