export interface Podcast {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  feedUrl: string;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  imageUrl?: string;
  pubDate: string;
  duration: string;
} 