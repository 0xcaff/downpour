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
    var serial = this['__serialization__'];
    var keys = Object.keys(serial);

    for (var i = 0; i < keys.length; i++) {
      var serializedKey = keys[i];
      var prettyKey = serial[serializedKey];

      var lo = o;
      var keySegments = serializedKey.split('.');
      for (var j = 0; j < keySegments.length && lo !== undefined; j++) {
        var lo = lo[keySegments[j]];
      }

      if (lo !== undefined)
        this[prettyKey] = lo;
    }
  }

  marshall(): Object {
    var result = {};
    var serial = this['__serialization__'];
    var keys = Object.keys(serial);

    for (var i = 0; i < keys.length; i++) {
      var serializedKey = keys[i];
      var prettyKey = serial[serializedKey];
      var value = this[prettyKey];

      if (value !== undefined)
        result[serializedKey] = this[prettyKey];
    }
    return result;
  }
}

