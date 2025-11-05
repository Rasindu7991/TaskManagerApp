import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone :true,
  imports: [CommonModule,RouterOutlet,RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #f3f4f6; /* Light gray background */
      font-family: ui-sans-serif, system-ui, sans-serif;
    }
  `]
})


export class App {
  protected readonly title = signal('TaskManagerUi');
}
