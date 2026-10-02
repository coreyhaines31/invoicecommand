export interface ProfessionData {
  id: string;
  name: string;
  profession: string; // Clean profession name for titles (e.g., "Freelance Writer")
  title: string; // SEO title: "[Profession] Invoice Template (Free)"
  description: string;
  keywords: string[];
  commonServices: string[];
  averageRates: {
    hourly?: string;
    project?: string;
  };
  industryInfo: string;
  seoDescription: string;
}

export const professions: ProfessionData[] = [
  {
    id: 'freelance-writer',
    name: 'Freelance Writer',
    profession: 'Freelance Writer',
    title: 'Freelance Writer Invoice Template (Free)',
    description: 'Professional invoice template designed specifically for freelance writers, copywriters, and content creators.',
    keywords: [
      'freelance writer invoice template',
      'invoice template for freelance writer',
      'copywriter invoice template',
      'content writer invoice template',
      'writing services invoice template'
    ],
    commonServices: [
      'Blog post writing',
      'Article writing',
      'Copywriting',
      'Content strategy',
      'Editing and proofreading',
      'Social media content',
      'Email marketing copy',
      'Website copy'
    ],
    averageRates: {
      hourly: '$25-75',
      project: '$100-2000'
    },
    industryInfo: 'Freelance writers typically charge between $25-75 per hour or $0.10-1.00 per word depending on expertise and project complexity.',
    seoDescription: 'Free freelance writer invoice template. Professional billing format for copywriters, content creators, and writing services with customizable fields.'
  },
  {
    id: 'web-developer',
    name: 'Web Developer',
    profession: 'Web Developer',
    title: 'Web Developer Invoice Template (Free)',
    description: 'Professional invoice template for web developers, programmers, and software engineers.',
    keywords: [
      'web developer invoice template',
      'invoice template for web developer',
      'programmer invoice template',
      'software developer invoice template',
      'web development invoice template'
    ],
    commonServices: [
      'Website development',
      'Web application development',
      'Frontend development',
      'Backend development',
      'API development',
      'Database design',
      'Website maintenance',
      'Bug fixes and updates'
    ],
    averageRates: {
      hourly: '$50-150',
      project: '$1000-50000'
    },
    industryInfo: 'Web developers charge $50-150+ per hour depending on experience level and technology stack. Projects range from $1K-50K+.',
    seoDescription: 'Free web developer invoice template. Professional billing format for programmers, software engineers, and coding professionals.'
  },
  {
    id: 'graphic-designer',
    name: 'Graphic Designer',
    profession: 'Graphic Designer',
    title: 'Graphic Designer Invoice Template (Free)',
    description: 'Creative invoice template perfect for graphic designers, visual artists, and design agencies.',
    keywords: [
      'graphic designer invoice template',
      'invoice template for graphic designer',
      'design services invoice template',
      'creative invoice template',
      'visual designer invoice template'
    ],
    commonServices: [
      'Logo design',
      'Brand identity design',
      'Print design',
      'Digital design',
      'Website design',
      'Marketing materials',
      'Packaging design',
      'Illustration'
    ],
    averageRates: {
      hourly: '$35-100',
      project: '$500-10000'
    },
    industryInfo: 'Graphic designers typically charge $35-100 per hour or price projects based on scope, with logos ranging $300-3000.',
    seoDescription: 'Free graphic designer invoice template. Professional billing format for design services, branding projects, and creative work.'
  },
  {
    id: 'consultant',
    name: 'Business Consultant',
    profession: 'Consultant',
    title: 'Consultant Invoice Template (Free)',
    description: 'Professional consulting invoice template for business advisors, strategy consultants, and management consultants.',
    keywords: [
      'consultant invoice template',
      'invoice template for consultant',
      'business consultant invoice template',
      'consulting services invoice template',
      'management consultant invoice template'
    ],
    commonServices: [
      'Business strategy consulting',
      'Management consulting',
      'Operations consulting',
      'Financial consulting',
      'Marketing consulting',
      'Process improvement',
      'Market research',
      'Business planning'
    ],
    averageRates: {
      hourly: '$75-300',
      project: '$2000-100000'
    },
    industryInfo: 'Business consultants charge $75-300+ per hour depending on expertise and industry focus. Projects can range from $2K-100K+.',
    seoDescription: 'Free consultant invoice template. Professional billing format for business advisors, strategy consultants, and consulting services.'
  },
  {
    id: 'photographer',
    name: 'Photographer',
    profession: 'Photographer',
    title: 'Photographer Invoice Template (Free)',
    description: 'Professional photography invoice template for wedding photographers, portrait photographers, and commercial photography services.',
    keywords: [
      'photographer invoice template',
      'invoice template for photographer',
      'photography services invoice template',
      'wedding photographer invoice template',
      'portrait photographer invoice template'
    ],
    commonServices: [
      'Wedding photography',
      'Portrait photography',
      'Event photography',
      'Commercial photography',
      'Product photography',
      'Real estate photography',
      'Photo editing',
      'Photo retouching'
    ],
    averageRates: {
      hourly: '$100-500',
      project: '$500-10000'
    },
    industryInfo: 'Photographers charge $100-500+ per hour or package pricing. Wedding photographers typically charge $1500-8000 per event.',
    seoDescription: 'Free photographer invoice template for wedding, portrait, and commercial photography. Professional billing format with package and hourly rates.'
  }
];

// Export profession slugs for static generation
export const professionSlugs = professions.map(p => p.id);