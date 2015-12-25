export function prop(serializedkey: string): PropertyDecorator;
export function prop(target: Object, propertykey: string): void;

export function prop(one: string|Object, two: string|void): PropertyDecorator|void {
  if (typeof one == 'string') {
    var serializedkey: string = <string>one;

    return (target: Object, propertykey: string) => {
      serialize(target, serializedkey, propertykey);
    }
  } else if (typeof one == 'object') {
    var target: Object = <Object>one;
    var propertykey: string = <string>two;

    serialize(target, propertykey, propertykey);
  }
}

// TODO: Fix that this breaks object prototype.
function serialize(target: Object, serializedkey: string, propertykey: string): void {
  if (!target.hasOwnProperty('__serialization__'))
    target['__serialization__'] = {};

  target['__serialization__'][serializedkey] = propertykey;
}

export class Serializable {
  __serialization__: Object;

  constructor(o: Object) {
    this.unmarshall(o);
  }

  unmarshall(o: Object = {}) {
    var ks = Object.keys(o);
    for (var i = 0; i < ks.length; i++) {
      var k = ks[i];
      if (this['__serialization__'].hasOwnProperty(k)) {
        var v = o[k];
        this[this['__serialization__'][k]] = v;
      }
    }
  }

  marshall(): Object {
    var r = {};
    var s = this.__serialization__;
    var ks = Object.keys(s);

    for (var i = 0; i < ks.length; i++) {
      var k = ks[i];
      var v = s[k];

      r[k] = this[v];
    }
    return r;
  }
}

