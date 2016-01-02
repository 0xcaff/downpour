import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
  name: 'bytes',
})
export class BytesPipe implements PipeTransform {
  transform(value: number, args: number[] = [0]): any {
    if (value == 0) return '0 B';
    // Math.floor(Math.log(val, base = 1000))
    var pows = Math.floor(Math.log(value) / Math.log(1000));
    return +(value / Math.pow(1000, pows)).toFixed(<number> args[0]) + ' ' + suffix[pows];
  }
}

export var suffix: string[] = [
  'B',
  'KB',
  'MB',
  'GB',
  'TB',
];

