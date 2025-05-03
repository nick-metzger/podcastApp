import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Episode } from '../models/podcast.model';

@Injectable({
  providedIn: 'root'
})
export class AudioPlayerService {
  audio = new Audio();
  isPlayingSubject = new BehaviorSubject<boolean>(false);
  private currentEpisodeSubject = new BehaviorSubject<Episode | null>(null);
  private currentTimeSubject = new BehaviorSubject<number>(0);
  private durationSubject = new BehaviorSubject<number>(0);
  private volumeSubject = new BehaviorSubject<number>(1); // Default volume is 1 (100%)

  currentEpisode$ = this.currentEpisodeSubject.asObservable();
  isPlaying$ = this.isPlayingSubject.asObservable();
  currentTime$ = this.currentTimeSubject.asObservable();
  duration$ = this.durationSubject.asObservable();
  volume$ = this.volumeSubject.asObservable();

  constructor() {
    this.setupAudioListeners();
    // Load saved volume from localStorage if available
    const savedVolume = localStorage.getItem('podcastVolume');
    if (savedVolume) {
      this.setVolume(parseFloat(savedVolume));
    }
  }

  private setupAudioListeners(): void {
    this.audio.addEventListener('play', () => this.isPlayingSubject.next(true));
    this.audio.addEventListener('pause', () => this.isPlayingSubject.next(false));
    this.audio.addEventListener('ended', () => this.isPlayingSubject.next(false));
    this.audio.addEventListener('timeupdate', () => this.currentTimeSubject.next(this.audio.currentTime));
    this.audio.addEventListener('loadedmetadata', () => this.durationSubject.next(this.audio.duration));
  }

  playEpisode(episode: Episode): void {
    if (this.currentEpisodeSubject.value?.id === episode.id) {
      // If it's the same episode, just toggle play/pause
      if (this.isPlayingSubject.value) {
        this.pause();
      } else {
        this.audio.play();
      }
    } else {
      // If it's a different episode, load and play it
      this.currentEpisodeSubject.next(episode);
      this.audio.src = episode.audioUrl || '';
      this.audio.load();
      this.audio.play();
    }
  }

  pause(): void {
    this.audio.pause();
  }

  seekTo(time: number): void {
    if (!isNaN(time)) {
      this.audio.currentTime = time;
    }
  }

  setVolume(volume: number): void {
    // Ensure volume is between 0 and 1
    const normalizedVolume = Math.max(0, Math.min(1, volume));
    this.audio.volume = normalizedVolume;
    this.volumeSubject.next(normalizedVolume);
    // Save volume preference
    localStorage.setItem('podcastVolume', normalizedVolume.toString());
  }

  toggleMute(): void {
    this.audio.muted = !this.audio.muted;
  }

  formatTime(seconds: number): string {
    if (!seconds) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
} 