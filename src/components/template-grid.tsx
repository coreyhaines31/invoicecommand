'use client'

import { useState, useMemo } from 'react';
import { ProfessionData } from '@/data/professions-expanded';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface TemplateGridProps {
  templates: ProfessionData[];
}

// Define categories for filtering
const CATEGORIES = {
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

export function TemplateGrid({ templates }: TemplateGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

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
        CATEGORIES[selectedCategory as keyof typeof CATEGORIES].includes(template.id);

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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search invoice templates..."
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
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                <Filter className="w-3 h-3 mr-1" />
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredTemplates.length} of {templates.length} invoice templates
          {searchTerm && ` for "${searchTerm}"`}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="group hover:shadow-lg transition-shadow duration-200">
            <div className="p-4">
              <div className="mb-3">
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {template.profession}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {template.description}
                </p>
              </div>

              {/* Rate badge */}
              {template.averageRates.hourly && (
                <Badge variant="secondary" className="mb-3">
                  {template.averageRates.hourly}
                </Badge>
              )}

              {/* Common services preview */}
              <div className="mb-4">
                <div className="text-xs text-muted-foreground mb-1">Common Services:</div>
                <div className="flex flex-wrap gap-1">
                  {template.commonServices.slice(0, 2).map((service, index) => (
                    <span key={index} className="text-xs bg-muted px-2 py-0.5 rounded">
                      {service}
                    </span>
                  ))}
                  {template.commonServices.length > 2 && (
                    <span className="text-xs text-muted-foreground">
                      +{template.commonServices.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              {/* CTA Button */}
              <Link href={`/invoice-templates/${template.id}`}>
                <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Use Template
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* No results state */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No templates found</h3>
            <p>Try adjusting your search terms or category filter.</p>
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