import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nullPlaceholder'
})
export class NullPlaceholderPipe implements PipeTransform {
  transform(value: any): string {
    return value == null || value === '' ? '---' : value;
  }
}
