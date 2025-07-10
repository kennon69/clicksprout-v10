# Custom Favicon Directory

Place your custom favicon files in this directory to replace the default browser tab icon.

## Supported Files
- **favicon.ico** (16x16, 32x32, 48x48 multi-size ICO file)
- **favicon-16x16.png** (16x16px PNG)
- **favicon-32x32.png** (32x32px PNG)
- **apple-touch-icon.png** (180x180px PNG for iOS)
- **android-chrome-192x192.png** (192x192px PNG for Android)
- **android-chrome-512x512.png** (512x512px PNG for Android)

## Usage
1. Place your favicon files in this directory with the exact names listed above
2. Update the HTML head section in your layout to reference these files
3. The favicon will appear in browser tabs, bookmarks, and mobile home screens

## Current Setup
The Next.js app currently uses the default favicon. To implement custom favicons:

1. Add your favicon files to this directory
2. Update `src/app/layout.tsx` to include favicon links:

```tsx
<link rel="icon" href="/favicons/favicon.ico" sizes="any" />
<link rel="icon" href="/favicons/favicon-32x32.png" type="image/png" sizes="32x32" />
<link rel="icon" href="/favicons/favicon-16x16.png" type="image/png" sizes="16x16" />
<link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" />
<link rel="manifest" href="/manifest.json" />
```

## Tools
You can generate favicon files from a single image using:
- https://favicon.io/
- https://realfavicongenerator.net/
- Adobe Photoshop/GIMP for manual creation
