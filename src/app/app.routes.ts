import { Routes } from '@angular/router';
import { PodcastListComponent } from './components/podcast-list/podcast-list.component';

export const routes: Routes = [
  { path: '', component: PodcastListComponent },
  { path: 'podcast/:id', component: PodcastListComponent },
  { path: '**', redirectTo: '' }
];
