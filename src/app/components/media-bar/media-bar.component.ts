import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioPlayerService } from '../../services/audio-player.service';
import { Episode } from '../../models/podcast.model';
import { Observable } from 'rxjs';
import { FormatTimePipe } from '../../pipes/format-time.pipe';

@Component({
  selector: 'app-media-bar',
  standalone: true,
  imports: [CommonModule, FormatTimePipe],
  templateUrl: './media-bar.component.html',
  styleUrls: ['./media-bar.component.scss']
})
export class MediaBarComponent implements OnInit {
  currentEpisode$: Observable<Episode | null>;
  isPlaying$: Observable<boolean>;
  currentTime$: Observable<number>;
  duration$: Observable<number>;

  constructor(private audioPlayer: AudioPlayerService) {
    this.currentEpisode$ = this.audioPlayer.currentEpisode$;
    this.isPlaying$ = this.audioPlayer.isPlaying$;
    this.currentTime$ = this.audioPlayer.currentTime$;
    this.duration$ = this.audioPlayer.duration$;
  }

  ngOnInit(): void {}

  togglePlayPause() {
    if (this.audioPlayer.isPlayingSubject.value) {
      this.audioPlayer.pause();
    } else {
      this.audioPlayer.audio.play();
    }
  }

  seekTo(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.audioPlayer.seekTo(Number(input.value));
    }
  }
} 