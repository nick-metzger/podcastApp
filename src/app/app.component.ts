import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { MediaBarComponent } from './components/media-bar/media-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MediaBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Lincoln\'s Podcast Library';

  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }
}
