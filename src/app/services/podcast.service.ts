import { Injectable } from '@angular/core';
import { Podcast, Episode } from '../models/podcast.model';
import Parser from 'rss-parser';

interface ItunesImage {
  $?: {
    href: string;
  };
}

interface Feed {
  itunes?: {
    image?: ItunesImage;
  };
  image?: {
    url: string;
  };
  items: any[];
}

interface FeedItem {
  guid?: string;
  link?: string;
  title?: string;
  content?: string;
  description?: string;
  pubDate?: string;
  enclosure?: {
    url?: string;
  };
  imageUrl?: string;
  duration?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PodcastService {
  private parser = new Parser<FeedItem>({
    customFields: {
      item: [
        ['itunes:image', 'imageUrl', { keepArray: false }],
        ['itunes:duration', 'duration', { keepArray: false }],
        ['enclosure', 'enclosure', { keepArray: false }]
      ]
    }
  });
  private corsProxy = 'https://api.allorigins.win/raw?url=';
  
  private podcasts: Podcast[] = [
    {
      id: '1',
      title: 'The Past and the Curious',
      description: 'A history podcast for kids and families! Each episode explores stories from history that you won\'t hear in school.',
      imageUrl: 'https://megaphone.imgix.net/podcasts/d24d44da-0684-11ee-b249-13e17f60109e/image/avatars-000270934730-efgg91-original.jpg?ixlib=rails-4.3.1&max-w=3000&max-h=3000&fit=crop&auto=format,compress',
      feedUrl: 'https://feeds.megaphone.fm/ARML5717012507',
      episodes: []
    },
    {
      id: '2',
      title: 'Forever Ago',
      description: 'A history show for the whole family that explores the surprising and fascinating history of things we think are ordinary.',
      imageUrl: 'https://img.apmcdn.org/4232da9d4515afaeb4f62f7e33887e051a2cde2d/square/5bb898-20230203-forever-ago-podcast-art-bou-1400.jpg',
      feedUrl: 'https://feeds.publicradio.org/public_feeds/forever-ago',
      episodes: []
    },
    {
      id: '3',
      title: 'Dinosaur George',
      description: 'A show for kids who love dinosaurs, paleontology, and other cool science stuff. It\'s a fun, family-friendly place where children learn about dinosaurs and prehistoric animals.',
      imageUrl: 'https://storage.buzzsprout.com/m9j8htxnwht4454gsgyncl6gg24d?.jpg',
      feedUrl: 'https://feeds.buzzsprout.com/1492420.rss',
      episodes: []
    },
    {
      id: '4',
      title: 'Brains On!',
      description: 'A science podcast for kids and curious adults from American Public Media. Each week, a different kid co-host joins Molly Bloom to find answers to fascinating questions about the world.',
      imageUrl: 'https://img.apmcdn.org/45d17222acd5858012c2bbbc9e7a64da43e4d0fc/square/d5bfea-20230203-brains-on-podcast-art-bou-1400.jpg',
      feedUrl: 'https://feeds.publicradio.org/public_feeds/brains-on',
      episodes: []
    }
  ];

  async getPodcasts(): Promise<Podcast[]> {
    return this.podcasts;
  }

  async getPodcastById(id: string): Promise<Podcast | undefined> {
    console.log(`Getting podcast by ID: ${id}`);
    const podcast = this.podcasts.find(p => p.id === id);
    if (podcast && podcast.episodes.length === 0) {
      console.log(`Fetching episodes for podcast: ${podcast.title}`);
      await this.fetchEpisodes(podcast);
    }
    return podcast;
  }

  async fetchEpisodes(podcast: Podcast): Promise<Episode[]> {
    try {
      console.log(`Fetching feed from: ${podcast.feedUrl}`);
      const feedUrl = encodeURIComponent(podcast.feedUrl);
      const response = await fetch(`${this.corsProxy}${feedUrl}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const feedText = await response.text();
      const feed = await this.parser.parseString(feedText);
      
      const episodes = feed.items.map(item => {
        // Get the best available image URL
        const imageUrl = item['itunes:image']?.['$']?.href || 
                        item['imageUrl'] || 
                        podcast.imageUrl;

        // Clean up the description by removing HTML tags
        const description = this.stripHtmlTags(item['content'] || item['description'] || '');

        return {
          id: item.guid || item.link || '',
          title: item.title || '',
          description: description,
          pubDate: item.pubDate || '',
          audioUrl: item.enclosure?.url || '',
          imageUrl: imageUrl,
          duration: item['duration'] || ''
        };
      });
      
      // Update the podcast's episodes array
      podcast.episodes = episodes;
      
      return episodes;
    } catch (error) {
      console.error('Error fetching episodes:', error);
      throw new Error('Failed to fetch episodes');
    }
  }

  private formatDuration(length: number): string {
    if (!length) return '00:00';
    
    const minutes = Math.floor(length / 60);
    const seconds = length % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  private stripHtmlTags(html: string): string {
    if (!html) return '';
    // Create a temporary div element
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    // Get the text content and clean up whitespace
    return tmp.textContent || tmp.innerText || ''
      .replace(/\s+/g, ' ')
      .trim();
  }
}
