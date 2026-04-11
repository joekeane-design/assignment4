import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  template: '<app-navbar></app-navbar><router-outlet></router-outlet>',
  styleUrls: ['./app.css'],
})
export class App {
  protected readonly title = signal('assignment4');
}
