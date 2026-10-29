import type { Metadata } from 'next'
import { HomeBuilder } from './home-builder'

// Homepage only: an animated link preview (iMessage/Discord autoplay og:video) with its
// resting frame as the still. This replaces the layout's openGraph and twitter objects
// wholesale, so their other fields are repeated here.
export const metadata: Metadata = {
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://invoicecommand.com',
    siteName: 'Invoice Command',
    title: 'Free Invoice Template Generator | Professional Invoice Builder',
    description: 'Create professional invoices instantly with our free invoice template generator. AI-powered voice commands, real-time preview, and PDF export.',
    images: [
      {
        url: '/og-video.png',
        width: 1200,
        height: 630,
        alt: 'Invoice Command - an invoice built from one voice command and sent',
      },
    ],
    videos: [
      {
        url: 'https://invoicecommand.com/og-video.mp4',
        secureUrl: 'https://invoicecommand.com/og-video.mp4',
        type: 'video/mp4',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Invoice Template Generator | Invoice Command',
    description: 'Create professional invoices instantly with our free invoice template generator. AI-powered voice commands and PDF export.',
    images: ['/og-video.png'],
    creator: '@invoicecommand',
  },
}

export default function Home() {
  return <HomeBuilder />
}
