import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import { EnhancedErrorBoundary } from "@/components/error-boundary-enhanced";
import { PrivacyControls } from "@/components/privacy/privacy-controls";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://invoicecommand.com'),
  title: "Free Invoice Template Generator | Invoice Command",
  description: "Create professional invoices instantly with our free invoice template generator. AI-powered voice commands, real-time preview, and PDF export. Perfect for freelancers, consultants, and small businesses.",
  keywords: [
    "free invoice template",
    "invoice generator",
    "invoice maker free",
    "professional invoice template",
    "invoice builder",
    "free invoice creator",
    "invoice template generator",
    "business invoice template"
  ],
  authors: [{ name: "Invoice Command" }],
  creator: "Invoice Command",
  publisher: "Invoice Command",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://invoicecommand.com',
    siteName: 'Invoice Command',
    title: 'Free Invoice Template Generator | Professional Invoice Builder',
    description: 'Create professional invoices instantly with our free invoice template generator. AI-powered voice commands, real-time preview, and PDF export.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Invoice Command - Free Invoice Template Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Invoice Template Generator | Invoice Command',
    description: 'Create professional invoices instantly with our free invoice template generator. AI-powered voice commands and PDF export.',
    images: ['/og-image.png'],
    creator: '@invoicecommand',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  alternates: {
    canonical: 'https://invoicecommand.com',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#10b981',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://invoicecommand.com/#webapp",
        "name": "Invoice Command",
        "url": "https://invoicecommand.com",
        "description": "Free invoice template generator with AI voice commands. Create professional invoices instantly with real-time preview and PDF export.",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Free invoice template generator",
          "AI voice commands",
          "Real-time preview",
          "PDF export",
          "Privacy protection",
          "Mobile responsive"
        ],
        "screenshot": "https://invoicecommand.com/og-image.png"
      },
      {
        "@type": "Organization",
        "@id": "https://invoicecommand.com/#organization",
        "name": "Invoice Command",
        "url": "https://invoicecommand.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://invoicecommand.com/icon-512.png"
        },
        "sameAs": []
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://invoicecommand.com/#software",
        "name": "Invoice Command",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "127"
        }
      },
      {
        "@type": "HowTo",
        "name": "How to Create a Professional Invoice",
        "description": "Learn how to create professional invoices quickly and easily using our free invoice template generator.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Fill Invoice Details",
            "text": "Enter your business information, client details, and invoice items using our intuitive form or AI voice commands.",
            "position": 1
          },
          {
            "@type": "HowToStep",
            "name": "Preview & Customize",
            "text": "See your professional invoice preview in real-time. Adjust formatting, add notes, and set payment terms.",
            "position": 2
          },
          {
            "@type": "HowToStep",
            "name": "Download PDF",
            "text": "Export your finished invoice as a professional PDF ready to send to clients or print for your records.",
            "position": 3
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Is this invoice template generator really free?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! Our invoice maker is completely free with no hidden costs, subscriptions, or limits. Create unlimited professional invoices without paying anything."
            }
          },
          {
            "@type": "Question",
            "name": "Can I use this for my business invoices?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Absolutely! Our professional invoice templates are designed for businesses of all sizes - freelancers, consultants, small businesses, and contractors. The invoices include all required business elements."
            }
          },
          {
            "@type": "Question",
            "name": "How does the AI voice feature work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Simply click the voice button and speak naturally about your invoice details. Our AI understands commands like 'Add 5 hours of consulting at $150 per hour' and automatically populates your invoice."
            }
          },
          {
            "@type": "Question",
            "name": "Is my data secure and private?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Your privacy is our priority. All data is stored locally in your browser only. We never store your business or client information on our servers. You have complete control over your data."
            }
          }
        ]
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PostHogProvider />
        <EnhancedErrorBoundary>
          {children}
          <PrivacyControls />
        </EnhancedErrorBoundary>
      </body>
    </html>
  );
}
