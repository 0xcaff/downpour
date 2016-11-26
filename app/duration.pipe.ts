import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'duration',
})
export class DurationPipe implements PipeTransform {
  transform(value: number, units = 'ms'): string {
    if (!Number.isInteger(value)) return '\u221E';
    return moment.duration(value, units).humanize();
  }
}

