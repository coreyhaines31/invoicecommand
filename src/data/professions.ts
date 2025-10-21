export interface ProfessionData {
  id: string;
  name: string;
  title: string;
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
    title: 'Free Freelance Writer Invoice Template',
    description: 'Professional invoice template designed specifically for freelance writers, copywriters, and content creators.',
    keywords: [
      'freelance writer invoice template',
      'copywriter invoice',
      'content writer invoice',
      'writing services invoice',
      'freelance writing invoice'
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
    seoDescription: 'Create professional freelance writer invoices instantly. Free template with industry-standard formatting for copywriters, content creators, and writing services.'
  },
  {
    id: 'web-developer',
    name: 'Web Developer',
    title: 'Free Web Developer Invoice Template',
    description: 'Professional invoice template for web developers, programmers, and software engineers.',
    keywords: [
      'web developer invoice template',
      'programmer invoice',
      'software developer invoice',
      'coding services invoice',
      'web development invoice'
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
    seoDescription: 'Professional web developer invoice template. Free download for programmers, software engineers, and coding professionals with industry-standard billing formats.'
  },
  {
    id: 'graphic-designer',
    name: 'Graphic Designer',
    title: 'Free Graphic Designer Invoice Template',
    description: 'Creative invoice template perfect for graphic designers, visual artists, and design agencies.',
    keywords: [
      'graphic designer invoice template',
      'design services invoice',
      'creative invoice template',
      'visual designer invoice',
      'branding invoice template'
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
    seoDescription: 'Free graphic designer invoice template. Professional billing format for design services, branding projects, and creative work with customizable fields.'
  },
  {
    id: 'consultant',
    name: 'Business Consultant',
    title: 'Free Business Consultant Invoice Template',
    description: 'Professional consulting invoice template for business advisors, strategy consultants, and management consultants.',
    keywords: [
      'business consultant invoice template',
      'consulting services invoice',
      'management consultant invoice',
      'strategy consultant invoice',
      'advisory services invoice'
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
    seoDescription: 'Professional business consultant invoice template. Free download for strategy consultants, advisors, and consulting services with hourly and project billing options.'
  },
  {
    id: 'photographer',
    name: 'Photographer',
    title: 'Free Photographer Invoice Template',
    description: 'Professional photography invoice template for wedding photographers, portrait photographers, and commercial photography services.',
    keywords: [
      'photographer invoice template',
      'photography services invoice',
      'wedding photographer invoice',
      'portrait photographer invoice',
      'commercial photography invoice'
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
    seoDescription: 'Free photographer invoice template for wedding, portrait, and commercial photography. Professional billing format with package and hourly rate options.'
  }
];

// Export profession slugs for static generation
export const professionSlugs = professions.map(p => p.id);