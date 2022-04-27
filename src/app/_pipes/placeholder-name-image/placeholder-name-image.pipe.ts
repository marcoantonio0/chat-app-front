import { Pipe, PipeTransform, Sanitizer, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'placeholderNameImage'
})
export class PlaceholderNameImage implements PipeTransform {
  constructor(
    private sanitizer: DomSanitizer
  ){}
  transform(value: string, ...args: unknown[]): string {
    let nameParse = value.toLowerCase().replace(/\s/g, '%20');
    return nameParse;
  }

}
