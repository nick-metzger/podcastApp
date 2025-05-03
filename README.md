# Kids' Podcast Library

A tablet-friendly web application for managing and playing educational podcasts for children. The interface is designed to be simple, intuitive, and easy to use on touch devices.

## Features

- Clean, tablet-optimized interface with large touch targets
- Responsive design that works on various screen sizes
- Educational podcasts for children:
  - Brains On! - Science podcast for curious kids
  - The Past and the Curious - History podcast for kids and families
  - Forever Ago - History show exploring the origins of everyday things
  - Dinosaur George - Paleontology and prehistoric animals
  - Eons: Surviving Deep Time - PBS Digital Studios production exploring natural history mysteries
- Simple podcast browsing and playback
- Automatic episode fetching from RSS feeds
- Beautiful UI with custom styling and animations

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   ng serve
   ```

3. Open your browser and navigate to `http://localhost:4200`

## Project Structure

- `src/app/components/` - Angular components
  - `podcast-list/` - Main podcast browsing interface
  - `podcast-player/` - Audio player component
  - `media-bar/` - Media controls component
- `src/app/services/` - Angular services
  - `podcast.service.ts` - Manages podcast data and RSS feed fetching
  - `audio-player.service.ts` - Handles audio playback
- `src/app/models/` - TypeScript interfaces
  - `podcast.model.ts` - Podcast and Episode interfaces

## Technologies Used

- Angular 19
- TypeScript
- SCSS
- HTML5 Audio API
- RSS Parser for podcast feed processing

## Development

- Run `ng serve` for a dev server
- Run `ng build` to build the project
- Run `ng test` to execute the unit tests

## Contributing

Feel free to submit issues and enhancement requests. Pull requests are welcome!

## License

This project is open source and available under the MIT License.
