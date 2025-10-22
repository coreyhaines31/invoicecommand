# 📋 Invoice Types Management

## Overview
This document tracks all invoice types (professions, services, and use cases) available in the Invoice Command programmatic SEO system.

**Current Count**: 405 invoice types
**URL Pattern**: `invoicecommand.com/invoice-templates/[type]`
**Title Pattern**: `"[Type Name] Invoice Template (Free)"`

## Files & Structure

### Core Files
- **`/data/invoice-types.csv`** - Master list of all invoice types (source of truth)
- **`/src/data/professions-expanded.ts`** - Generated TypeScript data for all types
- **`/public/sitemap.xml`** - Generated sitemap with all URLs
- **`/src/app/invoice-templates/[profession]/page.tsx`** - Dynamic route handler

### Management Scripts
- **`/scripts/add-invoice-type.js`** - Add new types and regenerate data
- **`/scripts/generate-professions.js`** - Generate TypeScript data from CSV
- **`/scripts/generate-sitemap.js`** - Generate comprehensive sitemap

## Adding New Invoice Types

### Quick Add Workflow
```bash
# Add a single new type
node scripts/add-invoice-type.js ai-consultant

# Regenerate all data files
node scripts/add-invoice-type.js --regenerate

# View all current types
node scripts/add-invoice-type.js --list
```

### What Happens When You Add a Type
1. ✅ Added to `/data/invoice-types.csv` (alphabetically sorted)
2. ✅ Generates TypeScript interface in `/src/data/professions-expanded.ts`
3. ✅ Creates URL endpoint at `/invoice-templates/[new-type]`
4. ✅ Adds SEO-optimized title: `"[Type Name] Invoice Template (Free)"`
5. ✅ Includes in comprehensive sitemap
6. ✅ Auto-generates appropriate services and rate ranges

### Example New Types to Consider
```bash
# AI & Modern Tech
node scripts/add-invoice-type.js ai-consultant
node scripts/add-invoice-type.js prompt-engineer
node scripts/add-invoice-type.js blockchain-developer

# Digital Economy
node scripts/add-invoice-type.js twitch-streamer
node scripts/add-invoice-type.js onlyfans-creator
node scripts/add-invoice-type.js crypto-trader

# Specialized Services
node scripts/add-invoice-type.js drone-pilot
node scripts/add-invoice-type.js escape-room-designer
node scripts/add-invoice-type.js sustainability-consultant
```

## Current Categories

### 🎨 Creative & Design (40+ types)
Animation, Art Direction, Brand Design, Fashion Design, Graphic Design, Interior Design, Motion Design, Photography, UI/UX Design, Video Production, Web Design

### 💻 Technology & Development (35+ types)
AI/ML Engineering, App Development, Cloud Consulting, Cybersecurity, Data Science, DevOps, IT Services, SEO, Software Development, Web Development

### 🏢 Business & Consulting (25+ types)
Business Coaching, Financial Advisory, HR Consulting, Legal Services, Management Consulting, Marketing, Project Management, Real Estate

### 🏥 Health & Wellness (20+ types)
Chiropractic, Dental, Fitness Coaching, Massage Therapy, Mental Health, Nutrition, Physical Therapy, Wellness Coaching

### 📚 Education & Training (25+ types)
Academic Tutoring, Dance Instruction, Driving Instruction, Language Teaching, Music Lessons, Personal Training, Sports Coaching

### 🏠 Home Services (150+ types)
Cleaning, Construction, Electrical, HVAC, Landscaping, Maintenance, Painting, Plumbing, Repairs, Restoration

### 🎭 Entertainment & Events (15+ types)
DJ Services, Event Planning, Music Production, Photography, Videography, Wedding Services

### 🚚 Transportation & Logistics (10+ types)
Delivery, Freight, Moving, Rideshare, Taxi, Towing, Transportation

## SEO Impact

### Current Coverage
- **405 invoice types** = 1,200+ target keywords
- **Primary keywords**: `"[type] invoice template"`
- **Secondary keywords**: `"invoice template for [type]"`
- **Long-tail keywords**: `"free [type] invoice template"`

### Traffic Projections
- **Target monthly searches**: 50K-150K combined
- **Projected organic traffic**: 15K-45K visitors/month (6-12 months)
- **Conversion potential**: 5-10% to invoice creation

## Maintenance

### Monthly Tasks
- [ ] Review search trends for new professions/services
- [ ] Add 5-10 new trending invoice types
- [ ] Update service lists for existing types
- [ ] Monitor keyword rankings and traffic

### Quarterly Tasks
- [ ] Comprehensive keyword research
- [ ] Competitor analysis for missing types
- [ ] Content quality review
- [ ] Performance optimization

---

**Last Updated**: October 21, 2025
**Next Review**: November 21, 2025