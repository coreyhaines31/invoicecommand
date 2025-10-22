const fs = require('fs');
const path = require('path');

// Define categories and their mapping
const professionCategories = {
  'Creative & Design': [
    '3d-printing-service', 'animation', 'art-director', 'audio-engineer', 'balloon-artist',
    'band', 'brand-designer', 'branding', 'cake-designer', 'cad-designer', 'colorist',
    'composer', 'costume-designer', 'creative-agency', 'creative-director', 'creative-services',
    'design-agency', 'fashion-designer', 'florist', 'food-photographer', 'graphic-designer',
    'illustration', 'interior-decorator', 'interior-designer', 'interior-stylist',
    'makeup-artist', 'motion-designer', 'music-producer', 'photographer', 'portrait-photographer',
    'product-designer', 'product-photographer', 'prop-stylist', 'set-designer', 'sign-maker',
    'sound-designer', 'tattoo-artist', 'ui-design', 'ux-ui-designer', 'video-editing',
    'video-producer', 'videographer', 'web-design'
  ],
  'Technology & Development': [
    'analytics-consultant', 'app-developer', 'cloud-consultant', 'crm-consultant',
    'cro-consultant', 'cybersecurity-consultant', 'data-analyst', 'data-scientist',
    'devops-consultant', 'email-marketing-specialist', 'facebook-ads-manager',
    'google-ads-specialist', 'hubspot-consultant', 'it-consultant', 'it-services',
    'marketo-consultant', 'ml-engineer', 'network-engineer', 'penetration-tester',
    'product-analyst', 'salesforce-consultant', 'seo-agency', 'seo-consultant',
    'shopify-developer', 'software-developer', 'software-development', 'squarespace-designer',
    'sysadmin', 'technical-writer', 'ui-ux-auditor', 'web-developer', 'webflow-developer',
    'wordpress-developer'
  ],
  'Business & Consulting': [
    'accounting', 'business-coach', 'business-consultant', 'business-development',
    'business-services', 'career-coach', 'career-consultant', 'consulting-firm',
    'executive-coach', 'financial-advisor', 'financial-consultant', 'financial-planner',
    'hr-consultant', 'hr-services', 'immigration-consultant', 'legal-consultant',
    'legal-services', 'life-coach', 'management-consultant', 'marketing-consultant',
    'marketing-automation-consultant', 'process-server', 'project-manager', 'real-estate-consultant',
    'research-consultant', 'security-consultant'
  ],
  'Health & Wellness': [
    'acupuncturist', 'chiropractor', 'cosmetic-nurse-injector', 'counselor', 'dental-hygienist',
    'dentist', 'dietitian', 'doctor', 'doula', 'esthetician', 'fitness-coach', 'herbalist',
    'massage-therapist', 'midwife', 'naturopath', 'nutritionist', 'occupational-therapist',
    'physical-therapist', 'speech-therapist', 'therapist'
  ],
  'Education & Training': [
    'act-tutor', 'bjj-coach', 'boxing-coach', 'college-counselor', 'dance-instructor',
    'dog-trainer', 'driving-instructor', 'esl-teacher', 'golf-coach', 'guitar-teacher',
    'horse-trainer', 'martial-arts-instructor', 'math-tutor', 'music-instructor',
    'music-teacher', 'piano-teacher', 'pilates-instructor', 'sat-tutor', 'soccer-coach',
    'swim-instructor', 'tennis-coach', 'test-prep-tutor', 'tutor', 'yoga-instructor'
  ],
  'Home Services': [
    'air-duct-cleaning', 'airbnb-cleaning', 'appliance-repair', 'asbestos-removal',
    'basement-waterproofing', 'cabinet-installer', 'carpet-cleaning', 'carpet-installer',
    'chimney-sweep', 'cleaning-service', 'commercial-cleaning', 'countertop-installer',
    'deck-builder', 'door-installer', 'dryer-vent-cleaning', 'drywall-installer',
    'electrician', 'electrical-contractor', 'fence-installer', 'flooring', 'furniture-assembly',
    'garage-door-repair', 'gardening', 'generator-installation', 'grout-cleaning',
    'gutter-cleaning', 'gutter-installer', 'handyman', 'hardscaping', 'holiday-lighting-installer',
    'home-inspector', 'home-organizer', 'home-repair', 'home-staging', 'house-cleaning',
    'hvac', 'industrial-cleaning', 'insulation-contractor', 'irrigation-installer',
    'janitorial-service', 'junk-removal', 'landscaper', 'landscape-design', 'lawn-care',
    'locksmith', 'maintenance', 'maintenance-services', 'masonry', 'mobile-car-wash',
    'mold-remediation', 'move-out-cleaning', 'office-cleaning', 'office-maintenance',
    'painter', 'pest-control', 'plumber', 'plumbing-and-heating', 'pool-cleaning',
    'post-construction-cleaning', 'pressure-washing', 'property-maintenance', 'property-management',
    'roofing', 'septic-service', 'short-term-rental-cleaning', 'siding-installer',
    'smart-home-installer', 'snow-removal', 'sod-installation', 'solar-installer',
    'solar-panel-cleaning', 'sprinkler-repair', 'stone-restoration', 'stump-removal',
    'tile-installer', 'tv-mounting', 'vinyl-wrap-installer', 'water-damage-restoration',
    'water-well-service', 'window-cleaning', 'window-installer', 'windshield-repair'
  ]
};

// Function to convert slug to profession name
function slugToProfessionName(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Function to generate average rates based on profession type
function generateRates(slug) {
  const techRoles = ['app-developer', 'web-developer', 'software-developer', 'data-scientist', 'cybersecurity-consultant'];
  const consultingRoles = ['business-consultant', 'management-consultant', 'financial-advisor'];
  const creativeRoles = ['graphic-designer', 'photographer', 'videographer', 'web-design'];
  const healthRoles = ['doctor', 'dentist', 'chiropractor', 'therapist'];
  const serviceRoles = ['cleaning-service', 'handyman', 'lawn-care', 'painter'];

  if (techRoles.includes(slug)) {
    return { hourly: '$50-150', project: '$1000-50000' };
  } else if (consultingRoles.includes(slug)) {
    return { hourly: '$75-300', project: '$2000-100000' };
  } else if (creativeRoles.includes(slug)) {
    return { hourly: '$35-100', project: '$500-10000' };
  } else if (healthRoles.includes(slug)) {
    return { hourly: '$100-400', project: '$200-5000' };
  } else if (serviceRoles.includes(slug)) {
    return { hourly: '$25-75', project: '$100-5000' };
  } else {
    return { hourly: '$30-80', project: '$200-5000' };
  }
}

// Function to generate common services based on profession type
function generateCommonServices(slug, professionName) {
  // Define common patterns
  const servicePatterns = {
    'cleaning': ['Deep cleaning', 'Regular maintenance', 'Move-in/move-out cleaning', 'Post-construction cleanup'],
    'design': ['Logo design', 'Brand identity', 'Print design', 'Digital design'],
    'development': ['Website development', 'Custom applications', 'Bug fixes', 'Maintenance'],
    'consulting': ['Strategy consulting', 'Process improvement', 'Analysis and recommendations', 'Training'],
    'photography': ['Photo sessions', 'Photo editing', 'Digital delivery', 'Print packages'],
    'tutoring': ['One-on-one tutoring', 'Group sessions', 'Test preparation', 'Homework help'],
    'fitness': ['Personal training', 'Group classes', 'Nutrition coaching', 'Program design'],
    'repair': ['Diagnostics', 'Repairs', 'Maintenance', 'Emergency services']
  };

  // Return default services based on profession type
  if (slug.includes('clean')) return servicePatterns.cleaning;
  if (slug.includes('design') || slug.includes('graphic')) return servicePatterns.design;
  if (slug.includes('develop') || slug.includes('web')) return servicePatterns.development;
  if (slug.includes('consultant') || slug.includes('coach')) return servicePatterns.consulting;
  if (slug.includes('photo')) return servicePatterns.photography;
  if (slug.includes('tutor') || slug.includes('teacher')) return servicePatterns.tutoring;
  if (slug.includes('trainer') || slug.includes('fitness')) return servicePatterns.fitness;
  if (slug.includes('repair') || slug.includes('mechanic')) return servicePatterns.repair;

  // Default generic services
  return [
    'Service consultation',
    'Project planning',
    'Implementation',
    'Follow-up support'
  ];
}

// Read the CSV file
const csvPath = '/Users/coreyhaines/Desktop/invoicecommand_types_expanded.csv';
const csvContent = fs.readFileSync(csvPath, 'utf8');
const lines = csvContent.trim().split('\n');
const types = lines.slice(1).filter(line => line.trim() && !['basic', 'blank', 'commercial', 'detailed', 'estimate', 'hourly', 'inventory', 'order', 'packing-slip', 'partial-payment', 'professional', 'proforma', 'purchase-order', 'quote', 'recurring', 'rental', 'retainer', 'return', 'shipping', 'simple', 'tax', 'wholesale'].includes(line.trim()));

// Generate profession data
const professions = types.map(slug => {
  const professionName = slugToProfessionName(slug);
  const rates = generateRates(slug);
  const commonServices = generateCommonServices(slug, professionName);

  return {
    id: slug,
    name: professionName,
    profession: professionName,
    title: `${professionName} Invoice Template (Free)`,
    description: `Professional invoice template designed specifically for ${professionName.toLowerCase()}s and related ${slug.includes('service') ? 'service' : 'business'} professionals.`,
    keywords: [
      `${professionName.toLowerCase()} invoice template`,
      `invoice template for ${professionName.toLowerCase()}`,
      `${professionName.toLowerCase()} billing template`,
      `free ${professionName.toLowerCase()} invoice`,
      `${professionName.toLowerCase()} invoice format`
    ],
    commonServices: commonServices,
    averageRates: rates,
    industryInfo: `${professionName}s typically charge between ${rates.hourly} per hour depending on experience and project complexity.`,
    seoDescription: `Free ${professionName.toLowerCase()} invoice template. Professional billing format with customizable fields for ${professionName.toLowerCase()} services.`
  };
});

// Generate the TypeScript file
const tsContent = `export interface ProfessionData {
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

export const professions: ProfessionData[] = ${JSON.stringify(professions, null, 2)};

// Export profession slugs for static generation
export const professionSlugs = professions.map(p => p.id);
`;

// Write the file
const outputPath = path.join(__dirname, '../src/data/professions-expanded.ts');
fs.writeFileSync(outputPath, tsContent);

console.log(`✅ Generated ${professions.length} profession templates`);
console.log(`📝 Written to: ${outputPath}`);
console.log(`🎯 First few professions:`);
professions.slice(0, 5).forEach(p => {
  console.log(`   - ${p.title}`);
});