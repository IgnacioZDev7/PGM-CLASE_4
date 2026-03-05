import { Component, signal } from '@angular/core';
import { Visor360 } from './components/viewer-360/viewer-360';

@Component({
  selector: 'app-root',
  imports: [Visor360],
  template: `
    <app-visor-360></app-visor-360>
  `,
})
export class App {
  protected readonly title = signal('PGM-CLASE_4');
}
