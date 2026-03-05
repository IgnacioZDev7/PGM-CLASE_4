import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Viewer360 } from './components/viewer-360/viewer-360';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Viewer360],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('PGM-CLASE_4');
}
