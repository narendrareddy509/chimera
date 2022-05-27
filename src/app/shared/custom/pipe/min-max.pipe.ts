import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minMax',
})
export class MinMaxPipe implements PipeTransform {
  transform(arrInteger: number[], separator: string = '-'): string {
    let minMax = '';

    try {
      if (Array.isArray(arrInteger) && typeof arrInteger[0] == 'number') {
        const max = Math.max(...arrInteger);
        const min = Math.min(...arrInteger);

        if (min != max) {
          minMax = `${min} ${separator} ${max}`;
        } else {
          minMax = `${min}`;
        }

      } else {
        minMax = arrInteger.join(', ');
      }
    } catch (err) {
      console.log('[MinMaxPipe.transform] Error: ', err);
    }

    return minMax;
  }
}
