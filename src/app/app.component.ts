import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],     // <-- importa RouterOutlet
  template: `<router-outlet></router-outlet>`,   // <-- usa el outlet
})
export class AppComponent {}
