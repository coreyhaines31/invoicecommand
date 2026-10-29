import {loadFont as loadPlexMono} from '@remotion/google-fonts/IBMPlexMono';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {InvoiceCard} from './InvoiceCard';

// The site asks for DM Sans but never loads it, so visitors see the system sans; match that.
export const SANS = '"Helvetica Neue", Helvetica, Arial, sans-serif';
export const MONO = loadPlexMono('normal', {weights: ['400', '500', '600'], subsets: ['latin']}).fontFamily;

// Cool Money theme (THEME.md, src/app/globals.css), resolved to sRGB.
export const BG = '#f0f8ff';
export const FG = '#374151';
export const MUTED = '#6b7280';
export const PRIMARY = '#22c55e';
export const PRIMARY_INK = '#16a34a';
export const BORDER = '#e5e7eb';
export const ACCENT = '#d1fae5';

export type OgVideoProps = {
  headline: string;
  chips: string[];
  sub: string;
  domain: string;
};

// The homepage: brand and H1 on the left, the editor's voice command and live preview on the right.
export const OgVideo = (props: OgVideoProps) => (
  <AbsoluteFill style={{background: BG, color: FG, fontFamily: SANS, WebkitFontSmoothing: 'antialiased'}}>
    <div style={{position: 'absolute', left: 72, top: 64, width: 470, height: 502, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: 32, fontWeight: 700, letterSpacing: '-0.01em'}}>
        <Img src={staticFile('invoicecommand-color-icon.svg')} style={{width: 36, height: 43}} />
        Invoice Command
      </div>
      <div>
        <div style={{fontSize: 64, lineHeight: 1.04, fontWeight: 700, letterSpacing: '-0.025em'}}>{props.headline}</div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 28}}>
          {props.chips.map((chip) => (
            <span key={chip} style={{fontSize: 17, color: PRIMARY_INK, background: 'rgba(34,197,94,0.12)', borderRadius: 8, padding: '6px 10px', whiteSpace: 'nowrap'}}>{chip}</span>
          ))}
        </div>
      </div>
      <div style={{fontSize: 22, color: MUTED, lineHeight: 1.35}}>
        {props.sub}
        <div style={{fontFamily: MONO, fontSize: 19, marginTop: 4, color: FG}}>{props.domain}</div>
      </div>
    </div>
    <div style={{position: 'absolute', left: 566, top: 56, width: 572, height: 518}}>
      <InvoiceCard />
    </div>
  </AbsoluteFill>
);
