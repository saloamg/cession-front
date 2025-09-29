import { AbstractControl, ValidationErrors } from '@angular/forms';

export function rutValidator(control: AbstractControl): ValidationErrors | null {
  const raw = (control.value || '').toString().replace(/\./g, '').replace(/-/g, '').toUpperCase();
  if (!raw) return null;
  if (!/^\d{7,8}[0-9K]$/.test(raw)) return { rut: 'Formato inv\u00e1lido' };
  const cuerpo = raw.slice(0, -1);
  const dv = raw.slice(-1);
  let suma = 0, multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }
  const calc = 11 - (suma % 11);
  const dvCalc = calc === 11 ? '0' : calc === 10 ? 'K' : String(calc);
  return dvCalc === dv ? null : { rut: 'D\u00edgito verificador incorrecto' };
}
