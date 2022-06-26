import { Byte } from '@angular/compiler/src/util';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'photo'
})
export class PhotoPipe implements PipeTransform {

  transform(photo: any): any {
    var base64 = atob(photo);
    return base64;
  }
}
