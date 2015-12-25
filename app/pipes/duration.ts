import {Pipe, PipeTransform} from 'angular2/core';
import moment from 'moment';

@Pipe({
  name: 'duration',
})
export class DurationPipe implements PipeTransform {
  transform(value: number, args: string[] = ['ms']): string {
    if (!Number.isInteger(value)) return '\u221E';
    return moment.duration(value, args[0]).humanize();
  }
}

