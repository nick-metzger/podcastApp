# Kids' Podcast Library

A tablet-friendly web application for managing and playing podcasts for children. The interface is designed to be simple, intuitive, and easy to use on touch devices.

## Features

- Clean, tablet-optimized interface
- Large touch targets for easy navigation
- Simple podcast browsing and playback
- Responsive design that works on various screen sizes
- Configurable podcast feeds

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure your podcast feeds:
   - Edit `src/assets/podcast-config.json` to add your podcast feeds
   - Add podcast cover images to `src/assets/images/`

3. Start the development server:
   ```bash
   ng serve
   ```

4. Open your browser and navigate to `http://localhost:4200`

## Configuration

The podcast feeds are configured in `src/assets/podcast-config.json`. Each podcast entry should include:

- `id`: Unique identifier for the podcast
- `title`: Podcast title
- `description`: Brief description of the podcast
- `imageUrl`: Path to the podcast cover image
- `feedUrl`: URL of the podcast RSS feed
- `episodes`: Array of episodes (will be populated from the feed)

## Development

- Run `ng serve` for a dev server
- Run `ng build` to build the project
- Run `ng test` to execute the unit tests

## Technologies Used

- Angular
- TypeScript
- SCSS
- HTML5 Audio API 
