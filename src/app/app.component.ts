import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MediaBarComponent } from './components/media-bar/media-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MediaBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'podcast-library';
}
