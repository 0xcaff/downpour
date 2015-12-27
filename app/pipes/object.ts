import {Pipe, PipeTransform} from 'angular2/core';
import fuzzy from 'fuzzy';

@Pipe({
  name: 'object',
})
export class ObjectFilterPipe implements PipeTransform {
  transform(value: any[], args: any[]): any {
    if (!args[0]) return value;

    var s = args[0];
    var r = [];
    for (var i = 0; i < toFilterBy.length; i++) {
      var re = new RegExp(`${toFilterBy[i]}: (\\S+)`);

      s = s.replace(re, (match, p1) => {
        if (p1) r[i] = p1;
        return '';
      });
    }

    return value.filter((v, i) => {
      for (var j = 0; j < r.length; j++) {
        if (r[j] && r[j] != v[toFilterBy[j]]) return false;
      }
      v.sortIndex = match(s, v.name);
      return v.sortIndex != -1;
    }).sort((a, b) => b.sortIndex - a.sortIndex);
  }
}

var toFilterBy = [
  'label',
  'state',
  'tracker',
];

// TODO: Prefix weight and comparion operators
export function match(query: string, record: string): number {
  var q = query.toLowerCase().replace(/ /g, '');
  var r = record.toLowerCase();
  var s = 0;
  var cs = 0;

  var lastMatchIndex = 0;
  for (var i = 0; i < q.length; i++) {
    var c = q[i];

    var x = r.indexOf(c, lastMatchIndex);
    if (x == -1) {
      return -1;
    } else {
      if (lastMatchIndex == x - 1)
        cs += cs + 1;
      else
        cs = 0;

      lastMatchIndex = x;
      s += cs;
    }
  }
  return s;
}

