# Quran Radio Cairo FM

A modern, bilingual web radio player for streaming live Quran recitations from Cairo, Egypt. Built with Astro and featuring a beautiful glass-morphism design with smooth animations.

## Features

- **24/7 Live Streaming**: Continuous broadcast of Quran recitations from renowned reciters
- **Bilingual Support**: Full Arabic (RTL) and English language support
- **Modern UI**: Beautiful glass-morphism design with animated gradients and water effects
- **Audio Controls**: Play/pause, volume control, and real-time playback counter
- **Responsive Design**: Optimized for desktop and mobile devices
- **SEO Optimized**: Structured data, meta tags, and multi-language support
- **Performance**: Optimized build with CSS minification and Terser compression

## Tech Stack

- **[Astro](https://astro.build)** - Modern static site framework
- **[Howler.js](https://howlerjs.com)** - Audio library for web audio management
- **TypeScript** - Type-safe development
- **CSS3** - Custom animations and glass-morphism effects

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd quran-cairo-fm

# Install dependencies
npm install
```

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The development server will start at `http://localhost:4321`

## Project Structure

```
quran-cairo-fm/
├── public/
│   ├── css/
│   └── images/
├── src/
│   ├── components/
│   │   ├── Background.astro
│   │   ├── ControlButtons.astro
│   │   ├── LanguageSwitcher.astro
│   │   ├── RadioPlayer.astro
│   │   └── RadioPlayerComplete.astro
│   ├── config/
│   │   └── translations.ts
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── index.astro (Arabic)
│   │   ├── en.astro (English)
│   │   └── ar.astro (Arabic alt)
│   ├── styles/
│   │   └── global.css
│   └── types/
│       └── index.ts
├── astro.config.mjs
└── package.json
```

## Configuration

The site is configured for deployment at `https://qurancairofm.com` with:
- HTML compression enabled
- Automatic CSS inlining
- Console log removal in production
- Terser minification

## Deployment

The site is optimized for static hosting and can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

Production site: [https://qurancairofm.com](https://qurancairofm.com)

## Credits

Developed by [Ahmed Ali](https://engahmedali.dev/)

## License

This project is for educational and religious purposes.
