import {Composition} from 'remotion';
import {OgVideo, type OgVideoProps} from './OgVideo';

// 6 s at 60 fps. Frame 225 (3.75 s) is the resting frame, rendered as the og:image still.
export const Root = () => (
  <Composition
    id="OgVideo"
    component={OgVideo}
    durationInFrames={360}
    fps={60}
    width={1200}
    height={630}
    defaultProps={
      {
        headline: 'Free Invoice Template Generator',
        chips: ['AI Voice Commands', 'PDF Export', 'Real-time Preview'],
        sub: 'Free and open source.',
        domain: 'invoicecommand.com',
      } satisfies OgVideoProps
    }
  />
);
