import type {CSSProperties, ReactNode} from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BORDER, FG, MONO, MUTED, PRIMARY, PRIMARY_INK} from './OgVideo';

// One spoken line becomes an invoice: the transcript types in, Acme Co fills Bill To, two line items slide in,
// the total counts up to 32 × $125 + $800 = $4,800, and the sent toast lands. Then everything eases back to the
// blank invoice, so the last frame matches the first.
const STANDARD = Easing.bezier(0.4, 0, 0.2, 1);
const IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
const OUT_EASE = Easing.bezier(0, 0, 0.2, 1);

const TRANSCRIPT = 'Invoice Acme Co for 32 hours of design at $125, plus $800 for hosting setup.';
const ITEMS = [
  {description: 'Design', qty: 32, rate: 125, at: 1.8},
  {description: 'Hosting setup', qty: 1, rate: 800, at: 2.1},
];
const TOTAL = ITEMS.reduce((sum, item) => sum + item.qty * item.rate, 0);
const PARSED_AT = 1.62;
const SENT_AT = 2.9;
const RESET_AT = 4.6;

const money = (n: number) => `$${Math.round(n).toLocaleString('en-US')}.00`;

type Span = [number, number];

export const InvoiceCard = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const ease = (input: number[], output: number[], easing: (n: number) => number) =>
    interpolate(t, input, output, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});

  // A label is shown for each [on, off] span: it rises in after the outgoing label has mostly gone, and fades out on off.
  const shown = (spans: Span[]) =>
    Math.max(
      0,
      ...spans.map(([on, off]) => {
        const fadeIn = on === -Infinity ? 1 : ease([on + 0.12, on + 0.32], [0, 1], OUT_EASE);
        const fadeOut = off === Infinity ? 1 : ease([off, off + 0.16], [1, 0], STANDARD);
        return fadeIn * fadeOut;
      }),
    );
  const rise = (spans: Span[]) =>
    Math.min(1, ...spans.map(([on]) => (on === -Infinity ? 0 : 1 - ease([on + 0.12, on + 0.32], [0, 1], OUT_EASE)))) * 6;
  const swap = (spans: Span[], style: CSSProperties, children: ReactNode) => (
    <div style={{position: 'absolute', ...style, opacity: shown(spans), transform: `translateY(${rise(spans)}px)`}}>{children}</div>
  );

  // Typing: each character fades in over a few characters' time, and the whole line resets while hidden.
  const typed = ease([0.3, 1.45], [0, TRANSCRIPT.length + 4], STANDARD) * ease([4.95, 5.0], [1, 0], STANDARD);
  const transcriptOpacity = ease([RESET_AT + 0.1, RESET_AT + 0.35], [1, 0], STANDARD);

  const recording = ease([0.08, 0.3], [0, 1], STANDARD) * ease([1.5, 1.75], [1, 0], STANDARD);
  const phase = (((t - 0.08) / 0.7) % 1 + 1) % 1;

  // Totals count up while visible, then fade out, reset, and fade back in as $0.00.
  const valueReset = ease([4.92, 5.0], [1, 0], STANDARD);
  const total = ITEMS.reduce(
    (sum, item) => sum + item.qty * item.rate * ease([item.at + 0.05, item.at + 0.55], [0, 1], IN_OUT),
    0,
  ) * valueReset;
  const totalOpacity = 1 - ease([RESET_AT + 0.1, RESET_AT + 0.26], [0, 1], STANDARD) + ease([5.05, 5.3], [0, 1], OUT_EASE);

  // The voice card's contents clear before the toast covers it, so the two never show through each other.
  const voiceOpacity = 1 - ease([SENT_AT - 0.15, SENT_AT + 0.05], [0, 1], STANDARD) + ease([RESET_AT + 0.5, RESET_AT + 0.75], [0, 1], OUT_EASE);
  const toastIn = ease([SENT_AT, SENT_AT + 0.4], [0, 1], OUT_EASE);
  const toastOut = ease([RESET_AT - 0.05, RESET_AT + 0.2], [1, 0], STANDARD);

  const card: CSSProperties = {
    position: 'absolute', left: 0, right: 0, background: '#fff', border: `1.5px solid ${BORDER}`, borderRadius: 14, boxSizing: 'border-box',
    boxShadow: '0 1px 2px rgba(15,23,42,0.05), 0 8px 24px -6px rgba(15,23,42,0.10)',
  };
  const caps: CSSProperties = {fontSize: 14, fontWeight: 700, letterSpacing: '0.06em', color: MUTED};
  const cols = (desc: ReactNode, qty: ReactNode, rate: ReactNode, amount: ReactNode, style: CSSProperties) => (
    <div style={{display: 'flex', alignItems: 'center', ...style}}>
      <div style={{flex: 1}}>{desc}</div>
      <div style={{width: 60, textAlign: 'right'}}>{qty}</div>
      <div style={{width: 120, textAlign: 'right'}}>{rate}</div>
      <div style={{width: 130, textAlign: 'right'}}>{amount}</div>
    </div>
  );

  return (
    <div style={{position: 'relative', width: '100%', height: '100%', fontVariantNumeric: 'tabular-nums'}}>
      <div style={{...card, top: 0, height: 112, display: 'flex', alignItems: 'center', gap: 20, padding: '0 24px'}}>
        <div style={{position: 'relative', width: 56, height: 56, flexShrink: 0, opacity: voiceOpacity}}>
          <div style={{position: 'absolute', inset: 0, borderRadius: 28, background: PRIMARY, opacity: 0.4 * recording * (1 - phase), transform: `scale(${1 + 0.55 * phase})`}} />
          <div style={{position: 'absolute', inset: 0, borderRadius: 28, background: PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="2" width="6" height="12" rx="3" />
              <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
              <path d="M12 18v4" />
            </svg>
          </div>
        </div>
        <div style={{position: 'relative', flex: 1, height: 80, opacity: voiceOpacity}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
            <span style={{fontSize: 19, fontWeight: 700}}>Voice Commands</span>
            <div style={{position: 'relative', width: 200, height: 20}}>
              {swap([[-Infinity, 0.08], [RESET_AT + 0.2, Infinity]], {right: 0, top: 0}, <span style={{fontFamily: MONO, fontSize: 15, color: MUTED, whiteSpace: 'nowrap'}}>ready</span>)}
              {swap([[0.08, PARSED_AT]], {right: 0, top: 0}, <span style={{fontFamily: MONO, fontSize: 15, color: PRIMARY_INK, whiteSpace: 'nowrap'}}>listening…</span>)}
              {swap([[PARSED_AT, RESET_AT + 0.2]], {right: 0, top: 0}, <span style={{fontFamily: MONO, fontSize: 15, color: PRIMARY_INK, whiteSpace: 'nowrap'}}>2 items added</span>)}
            </div>
          </div>
          <div style={{position: 'relative', marginTop: 6, fontSize: 18, lineHeight: 1.35}}>
            {swap([[-Infinity, 0.12], [5.0, Infinity]], {left: 0, top: 0, right: 0},
              <span style={{color: MUTED}}>Use voice commands to quickly update your invoice</span>)}
            <div style={{position: 'absolute', left: 0, top: 0, right: 0, opacity: transcriptOpacity}}>
              {TRANSCRIPT.split('').map((ch, i) => (
                <span key={i} style={{opacity: Math.min(1, Math.max(0, (typed - i) / 4))}}>{ch}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{...card, top: 128, bottom: 0, padding: '26px 30px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
          <div>
            <div style={{fontSize: 36, fontWeight: 700, color: PRIMARY, lineHeight: 1}}>INVOICE</div>
            <div style={{fontFamily: MONO, fontSize: 16, color: MUTED, marginTop: 10}}>#INV-1042</div>
          </div>
          <div style={{textAlign: 'right'}}>
            <div style={{fontSize: 42, fontWeight: 700, color: PRIMARY, lineHeight: 1, opacity: totalOpacity}}>{money(total)}</div>
            <div style={{fontSize: 15, color: MUTED, marginTop: 10}}>Due: November 28, 2026</div>
          </div>
        </div>

        <div style={{marginTop: 22}}>
          <div style={caps}>BILL TO</div>
          <div style={{position: 'relative', height: 28, marginTop: 6, fontSize: 21, fontWeight: 700}}>
            {swap([[-Infinity, PARSED_AT], [RESET_AT + 0.15, Infinity]], {left: 0, top: 0}, <span style={{color: '#9ca3af'}}>Client Name</span>)}
            {swap([[PARSED_AT, RESET_AT + 0.15]], {left: 0, top: 0}, <span>Acme Co</span>)}
          </div>
        </div>

        {cols('DESCRIPTION', 'QTY', 'RATE', 'AMOUNT', {...caps, marginTop: 20, paddingBottom: 10, borderBottom: `1.5px solid ${BORDER}`})}
        <div style={{height: 92}}>
          {ITEMS.map((item) => {
            const enter = ease([item.at, item.at + 0.4], [0, 1], OUT_EASE);
            const leave = ease([RESET_AT + 0.1, RESET_AT + 0.4], [0, 1], STANDARD);
            return (
              <div key={item.description} style={{opacity: enter * (1 - leave), transform: `translateY(${(1 - enter) * 16 - leave * 6}px)`}}>
                {cols(
                  item.description,
                  item.qty,
                  <span style={{fontFamily: MONO}}>{money(item.rate)}</span>,
                  <span style={{fontFamily: MONO, fontWeight: 600}}>{money(item.qty * item.rate)}</span>,
                  {fontSize: 19, height: 46, borderBottom: `1.5px solid ${BORDER}`},
                )}
              </div>
            );
          })}
        </div>
        <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline', gap: 28, marginTop: 14, opacity: totalOpacity}}>
          <span style={{fontSize: 20, fontWeight: 700}}>Total:</span>
          <span style={{fontFamily: MONO, fontSize: 22, fontWeight: 600, width: 130, textAlign: 'right'}}>{money(total)}</span>
        </div>
      </div>

      <div
        style={{...card, left: 16, right: 16, top: 14, padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 16,
          boxShadow: '0 2px 4px rgba(15,23,42,0.06), 0 18px 40px -8px rgba(15,23,42,0.22)',
          opacity: toastIn * toastOut, transform: `translateY(${(toastIn - 1) * 22 - (1 - toastOut) * 8}px)`}}
      >
        <div style={{width: 44, height: 44, borderRadius: 22, background: PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </div>
        <div>
          <div style={{fontSize: 30, fontWeight: 700, color: FG, letterSpacing: '-0.01em', lineHeight: 1.1}}>Invoice #INV-1042 sent</div>
          <div style={{fontSize: 18, color: MUTED, marginTop: 4}}>{money(TOTAL)} to Acme Co</div>
        </div>
      </div>
    </div>
  );
};
