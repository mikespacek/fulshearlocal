# Converting SVG Graphics to Web-Ready Formats

This document explains how to convert the SVG source files to web-optimized formats for production use.

## Prerequisites

You'll need one of the following installed:

- **Inkscape** (free, open-source): https://inkscape.org/
- **SVGOMG** (online): https://jakearchibald.github.io/svgomg/
- **ImageMagick** (command line): https://imagemagick.org/
- Adobe Illustrator or similar vector graphics software

## Converting the OG Image

The social sharing image (OG image) needs to be converted to JPG format:

1. Open `/public/images/social/fulshear-local-og.svg` in your preferred tool
2. Export as JPG with the following settings:
   - Resolution: 1200×630px
   - Quality: 85-90% (good balance between quality and file size)
   - Output path: `/public/images/social/fulshear-local-og.jpg`

### Using ImageMagick (Command Line)

```bash
# Install ImageMagick
# macOS: brew install imagemagick
# Ubuntu/Debian: sudo apt-get install imagemagick

# Convert SVG to JPG
cd /path/to/your/project
magick convert public/images/social/fulshear-local-og.svg -quality 90 public/images/social/fulshear-local-og.jpg
```

## Optimizing the Favicon

The favicon.svg file should be optimized for web use:

1. Use SVGOMG (https://jakearchibald.github.io/svgomg/) to optimize the SVG
2. Replace the existing `/public/favicon.svg` with the optimized version

### Creating ICO Version (Optional)

For better compatibility with older browsers:

```bash
# Using ImageMagick
magick convert public/favicon.svg -background none -resize 32x32 public/favicon.ico
```

## Implementation Check

After converting, make sure:

1. The OG image appears correctly when sharing your site
2. The favicon displays correctly in browser tabs
3. The theme color matches the favicon background

## Next.js Configuration

The favicon and OG image references are already configured in `app/layout.tsx`. If you use different filenames or paths, update the configuration in that file. 