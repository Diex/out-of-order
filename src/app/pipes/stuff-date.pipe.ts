import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'stuffDate'
})
export class StuffDatePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    let date = moment(value).format("MM.DD.YY HH:MM");
    return date;
  }

}
