import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'rut', standalone: true })
export class RutPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    let v = value.replace(/\./g, '').replace(/-/g, '').toUpperCase();
    const dv = v.slice(-1);
    v = v.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${v}-${dv}`;
  }
}
