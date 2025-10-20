# 🎨 Cool Money Theme Reference

**CRITICAL**: This project EXCLUSIVELY uses the "Cool Money" theme from tweakcn. Never deviate from this design system.

## Theme Identity
- **Name**: Cool Money
- **Source**: tweakcn
- **URL**: https://tweakcn.com/r/themes/cmgya34ad000604le4z2cf1l2
- **Purpose**: Professional, finance-focused interface perfect for InvoiceCommand

## Core Colors
```css
/* Primary Colors */
--primary: oklch(0.7227 0.1920 149.5793);           /* Emerald green */
--primary-foreground: oklch(1.0000 0 0);            /* White */

/* Background Colors */
--background: oklch(0.9751 0.0127 244.2507);        /* Light gray-blue */
--foreground: oklch(0.3729 0.0306 259.7328);        /* Dark blue-gray */

/* Secondary Colors */
--secondary: oklch(0.9514 0.0250 236.8242);         /* Light blue-gray */
--secondary-foreground: oklch(0.4461 0.0263 256.8018); /* Medium blue-gray */

/* Accent Colors */
--accent: oklch(0.9505 0.0507 163.0508);            /* Light mint */
--accent-foreground: oklch(0.3729 0.0306 259.7328); /* Dark blue-gray */
```

## Typography
- **Sans**: DM Sans, sans-serif (clean, professional)
- **Mono**: IBM Plex Mono, monospace (code/numbers)
- **Serif**: Lora, serif (elegant headings)

## Design Elements
- **Border Radius**: 0.5rem (8px) - rounded but not too soft
- **Shadows**: Enhanced depth with custom shadow system
- **Spacing**: 0.25rem base unit for consistent rhythm

## Usage Rules

### ✅ DO
- Use Cool Money theme colors exclusively
- Apply consistent typography hierarchy
- Leverage the custom shadow system
- Maintain 0.5rem border radius consistency
- Use DM Sans for all UI text
- Use IBM Plex Mono for invoice numbers, amounts, dates

### ❌ DON'T
- Override theme colors with custom values
- Use different fonts outside the theme system
- Apply inconsistent border radius values
- Ignore the established shadow patterns

## Installation Command
```bash
npx shadcn@latest add https://tweakcn.com/r/themes/cmgya34ad000604le4z2cf1l2
```

## Components Reference
When building invoice components, always reference the Cool Money theme:
- Use `bg-primary` for call-to-action buttons
- Use `text-muted-foreground` for secondary text
- Use `border-border` for subtle dividers
- Use `bg-card` for elevated content areas