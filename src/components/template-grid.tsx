'use client'

import { useState, useMemo } from 'react';
import { ProfessionData } from '@/data/professions-expanded';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface TemplateGridProps {
  templates: ProfessionData[];
  basePath?: string; // Optional base path for links (defaults to /invoice-templates)
}

// Define categories for filtering
const CATEGORIES: Record<string, string[]> = {
  'All': [],
  'Creative & Design': [
    '3d-printing-service', 'animation', 'art-director', 'audio-engineer', 'brand-designer',
    'branding', 'cake-designer', 'cad-designer', 'colorist', 'composer', 'costume-designer',
    'creative-agency', 'creative-director', 'creative-services', 'design-agency', 'fashion-designer',
    'florist', 'food-photographer', 'graphic-designer', 'illustration', 'interior-decorator',
    'interior-designer', 'interior-stylist', 'makeup-artist', 'motion-designer', 'music-producer',
    'photographer', 'portrait-photographer', 'product-designer', 'product-photographer',
    'prop-stylist', 'set-designer', 'sign-maker', 'sound-designer', 'tattoo-artist',
    'ui-design', 'ux-ui-designer', 'video-editing', 'video-producer', 'videographer', 'web-design'
  ],
  'Technology': [
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

export function TemplateGrid({ templates, basePath = '/invoice-templates' }: TemplateGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Determine template type based on basePath
  const templateType = basePath.includes('estimate') ? 'estimate' : 'invoice';

  // Filter templates based on search and category
  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      // Search filter
      const matchesSearch = searchTerm === '' ||
        template.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));

      // Category filter
      const matchesCategory = selectedCategory === 'All' ||
        CATEGORIES[selectedCategory].includes(template.id);

      return matchesSearch && matchesCategory;
    });
  }, [templates, searchTerm, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="search"
              aria-label={`Search ${templateType} templates`}
              placeholder={`Search ${templateType} templates...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {Object.keys(CATEGORIES).map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                aria-pressed={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap max-sm:h-10"
              >
                <Filter aria-hidden="true" className="w-3 h-3 mr-1" />
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-muted-foreground tabular-nums" aria-live="polite">
          Showing {filteredTemplates.length} of {templates.length} {templateType} templates
          {searchTerm && ` for "${searchTerm}"`}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </div>
      </div>

      {/* Templates Grid */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map((template) => (
          <li key={template.id} className="flex">
            {/* The whole card is one link: a bigger target and no button nested in an anchor. */}
            <Link
              href={`${basePath}/${template.id}`}
              className="group relative flex w-full flex-col rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm outline-none transition-[translate,scale,border-color] duration-(--motion-base) ease-emphasized before:pointer-events-none before:absolute before:inset-0 before:rounded-xl before:opacity-0 before:shadow-lg before:transition-opacity before:duration-(--motion-base) hover:border-primary/40 hover:before:opacity-100 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.99]"
            >
              <h3 className="font-semibold text-lg transition-colors group-hover:text-primary">
                {template.profession}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {template.description}
              </p>

              {/* Rate badge */}
              {template.averageRates.hourly && (
                <Badge variant="secondary" className="mt-3 tabular-nums" title="Typical hourly rate">
                  {template.averageRates.hourly}<span className="text-muted-foreground">/hr</span>
                </Badge>
              )}

              {/* Common services preview */}
              <div className="mt-4 mb-5">
                <div className="text-xs text-muted-foreground mb-1">Common services</div>
                <div className="flex flex-wrap gap-1">
                  {template.commonServices.slice(0, 2).map((service, index) => (
                    <span key={index} className="text-xs bg-muted px-2 py-0.5 rounded">
                      {service}
                    </span>
                  ))}
                  {template.commonServices.length > 2 && (
                    <span className="text-xs text-muted-foreground px-1 py-0.5">
                      +{template.commonServices.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Use template
                <ArrowRight
                  aria-hidden="true"
                  className="w-4 h-4 transition-[translate] duration-(--motion-fast) ease-emphasized motion-safe:group-hover:translate-x-1"
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* No results state */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Search aria-hidden="true" className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No templates found</h3>
            <p>Try a broader word, like &quot;design&quot; or &quot;repair&quot;, or clear the filters.</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}