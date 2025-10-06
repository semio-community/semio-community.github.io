# UR-RAD Symposium Website

This repository contains the website for the UR-RAD (Unifying Representations for Robot Application Development) symposium series, built with [Astro](https://astro.build/) and deployed on GitHub Pages.

## About UR-RAD

UR-RAD is an annual symposium held as part of the AAAI Fall Symposium Series, focused on unifying representations for robot application development. The symposium brings together researchers from robotics, AI, and related fields to discuss representational techniques and their applications in robotics.

## Current Site

The current live site hosts **UR-RAD 2025**, the 3rd iteration of the symposium:
- **Date**: November 6-8, 2025
- **Location**: Westin Arlington Gateway, Arlington, VA, USA
- **Website**: [ur-rad.github.io](https://ur-rad.github.io)

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm, pnpm, or yarn

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/ur-rad/ur-rad.github.io.git
cd ur-rad.github.io

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:4321`

## Commands

| Command          | Action                                                         |
| :--------------- | :------------------------------------------------------------- |
| `npm install`    | Installs dependencies                                          |
| `npm run dev`    | Starts local dev server at `localhost:4321`                   |
| `npm run build`  | Build your production site to `./dist/`                       |
| `npm run preview`| Preview your build locally, before deploying                  |
| `npm run sync`   | Generate types based on your config in `src/content/config.ts`|

## Site Configuration

- **Main config**: `src/site.config.ts` - Site metadata, navigation, and basic settings
- **Astro config**: `astro.config.ts` - Build settings, integrations, and deployment config
- **Styling**: `src/styles/global.css` - Global styles and CSS variables
- **Content**: Page content is in `src/pages/` with components in `src/components/`

## Key Features

- 🚀 **Astro v5** - Fast, modern static site generation
- 🎨 **Tailwind CSS** - Utility-first styling with custom design system
- 📱 **Responsive Design** - Mobile-first approach with accessibility in mind
- 🌓 **Dark/Light Mode** - Automatic theme switching
- 📄 **SEO Optimized** - Meta tags, sitemap, and social sharing
- 📊 **Performance Focused** - Optimized builds and fast loading

## Current Architecture

The site is currently built as a single conference website for UR-RAD 2025, with:
- Static pages for main content (Home, Call for Papers, Speakers, etc.)
- Component-based architecture for reusable UI elements
- Asset management for images and media
- GitHub Pages deployment

## Future Multi-Conference Architecture

This repository is being designed to support multiple conference years and venues. See `CONFERENCE_ARCHITECTURE.md` for detailed plans on scaling to support:
- Multiple conference years (e.g., `/fss_2025`, `/icra_2026`)
- Shared components and layouts
- Conference-specific content and theming
- Central hub for all UR-RAD events

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the main branch. The deployment process:

1. GitHub Actions builds the site using `npm run build`
2. Generated files in `./dist/` are deployed to the `gh-pages` branch
3. GitHub Pages serves the site from `gh-pages` branch

## Content Management

### Adding New Pages
Create new `.astro` files in `src/pages/` directory. Pages automatically become routes based on file structure.

### Updating Site Information
- **Conference details**: Update `src/site.config.ts`
- **Navigation**: Modify `menuLinks` in `src/site.config.ts`
- **Speakers**: Add images to `src/assets/images/speakers/` and update component
- **Organizers**: Add images to `src/assets/images/organizers/` and update component

### Styling
- **Global styles**: `src/styles/global.css`
- **Component styles**: Use Tailwind classes in `.astro` files
- **Theme colors**: Defined in CSS variables in global styles

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## Previous Conferences

- **UR-RAD 2024**: [View archived site](https://sites.google.com/view/aaai-ur-rad-24-symposium)
- **UR-RAD 2023**: [View archived site](https://sites.google.com/view/aaai-ur-rad-23-symposium)

## Contact

For questions about the website or technical issues:
- **Email**: [urrad.symposium@gmail.com](mailto:urrad.symposium@gmail.com)
- **Issues**: [GitHub Issues](https://github.com/ur-rad/ur-rad.github.io/issues)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Note**: This site is based on the [Astro Citrus](https://github.com/artemkutsan/astro-citrus) template by [Artem Kutsan](https://github.com/artemkutsan). Thank you for the excellent foundation!