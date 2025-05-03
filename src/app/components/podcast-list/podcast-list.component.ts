import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PodcastService } from '../../services/podcast.service';
import { Podcast, Episode } from '../../models/podcast.model';
import { Router, ActivatedRoute } from '@angular/router';
import { AudioPlayerService } from '../../services/audio-player.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-podcast-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './podcast-list.component.html',
  styleUrls: ['./podcast-list.component.scss']
})
export class PodcastListComponent implements OnInit, OnDestroy {
  podcasts: Podcast[] = [];
  selectedPodcast: Podcast | null = null;
  episodes: Episode[] = [];
  isLoading = false;
  error: string | null = null;
  currentEpisode$: Observable<Episode | null>;
  isPlaying$: Observable<boolean>;
  private routeSubscription: Subscription | null = null;

  constructor(
    private podcastService: PodcastService,
    private audioPlayer: AudioPlayerService,
    private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) {
    this.currentEpisode$ = this.audioPlayer.currentEpisode$;
    this.isPlaying$ = this.audioPlayer.isPlaying$;
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe(async params => {
      const podcastId = params['id'];
      if (!this.podcasts.length) {
        await this.loadPodcasts();
      }
      if (podcastId) {
        await this.loadPodcastById(podcastId);
      } else {
        this.selectedPodcast = null;
        this.episodes = [];
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  async loadPodcasts(): Promise<void> {
    try {
      this.isLoading = true;
      this.error = null;
      this.podcasts = await this.podcastService.getPodcasts();
    } catch (err) {
      this.error = 'Failed to load podcasts. Please try again later.';
      console.error('Error loading podcasts:', err);
    } finally {
      this.isLoading = false;
    }
  }

  async loadPodcastById(podcastId: string): Promise<void> {
    try {
      this.isLoading = true;
      this.error = null;
      const podcast = this.podcasts.find(p => p.id === podcastId);
      if (podcast) {
        this.selectedPodcast = podcast;
        this.episodes = await this.podcastService.fetchEpisodes(podcast);
        console.log('Episodes loaded:', this.episodes);
        this.cdRef.detectChanges();
      } else {
        this.selectedPodcast = null;
        this.episodes = [];
        this.error = 'Podcast not found.';
        this.cdRef.detectChanges();
      }
    } catch (err) {
      this.error = 'Failed to load episodes. Please try again later.';
      console.error('Error loading episodes:', err);
      this.cdRef.detectChanges();
    } finally {
      this.isLoading = false;
    }
  }

  selectPodcast(podcast: Podcast): void {
    this.router.navigate(['/podcast', podcast.id]);
  }

  playEpisode(episode: Episode): void {
    this.audioPlayer.playEpisode(episode);
  }

  goBack(): void {
    this.selectedPodcast = null;
    this.episodes = [];
    this.router.navigate(['/']);
  }

  isCurrentlyPlaying(episode: Episode): Observable<boolean> {
    return new Observable(subscriber => {
      this.currentEpisode$.subscribe(current => {
        subscriber.next(current?.id === episode.id);
      });
    });
  }

  getImageUrl(episode: Episode): string {
    if (typeof episode.imageUrl === 'string' && episode.imageUrl) {
      return episode.imageUrl;
    }
    if (this.selectedPodcast && typeof this.selectedPodcast.imageUrl === 'string') {
      return this.selectedPodcast.imageUrl;
    }
    return 'https://via.placeholder.com/200x200?text=No+Image';
  }

  retryLoad(): void {
    if (this.selectedPodcast) {
      // Try to reload the episodes for the selected podcast
      this.loadPodcastById(this.selectedPodcast.id);
    } else {
      // Reload the podcast list
      this.loadPodcasts();
    }
  }
}

