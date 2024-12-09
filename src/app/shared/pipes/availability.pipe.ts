import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'availability',
  standalone: true,
})
export class AvailabilityPipe implements PipeTransform {
  transform(value: "INSTOCK" | "LOWSTOCK" | "OUTOFSTOCK"): string {
    return {
        INSTOCK: 'En stock',
        LOWSTOCK: 'Limité',
        OUTOFSTOCK: 'En rupture de stock',
    }[value];
  }
}