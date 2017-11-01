import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'replaceLineBreaks'})
export class ReplacelinebreaksPipe implements PipeTransform {
  transform(value: string): string {
    const newValue = value.replace(/\n/g, ' ');
    return `${newValue}`;
  }
}
