# og:video link preview

Remotion source for the homepage link preview: `public/og-video.mp4` (the `og:video` that iMessage and Discord autoplay) and `public/og-video.png` (frame 225 of the 6-second, 60 fps loop, used as the homepage `og:image`). Needs Node and ffmpeg.

```sh
cd og && npm install && npm run render
```

`npm run studio` opens a live preview. `OgVideo.tsx` is the Cool Money shell (logo, H1, feature chips) and `InvoiceCard.tsx` is the animated voice command and live preview. The loop ends on its first frame, so keep the first and last frames identical when changing the timing.

This folder is excluded from the typecheck, lint, Jest and Tailwind scanning and listed in `.vercelignore`, so none of it is built or deployed.
