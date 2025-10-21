'use client'

import { ProfessionData } from '@/data/professions';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ProfessionInfoProps {
  profession: ProfessionData;
}

export function ProfessionInfo({ profession }: ProfessionInfoProps) {
  return (
    <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
      <div className="container mx-auto p-4">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Invoice Generator
          </Link>
        </div>

        {/* Profession Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {profession.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              {profession.description}
            </p>

            {/* Industry Info */}
            <Card className="p-4 bg-card/50">
              <h3 className="font-semibold mb-2">Industry Rates</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {profession.averageRates.hourly && (
                  <div>
                    <span className="text-muted-foreground">Hourly:</span>
                    <div className="font-semibold text-primary">{profession.averageRates.hourly}</div>
                  </div>
                )}
                {profession.averageRates.project && (
                  <div>
                    <span className="text-muted-foreground">Project:</span>
                    <div className="font-semibold text-primary">{profession.averageRates.project}</div>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                {profession.industryInfo}
              </p>
            </Card>
          </div>

          <div>
            {/* Common Services */}
            <h3 className="text-xl font-semibold mb-4">Common {profession.name} Services</h3>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {profession.commonServices.map((service, index) => (
                <Badge key={index} variant="secondary" className="justify-start">
                  {service}
                </Badge>
              ))}
            </div>

            {/* Quick Start */}
            <Card className="p-4 bg-primary/5 border-primary/20">
              <h3 className="font-semibold text-primary mb-2">Quick Start Guide</h3>
              <p className="text-sm text-muted-foreground mb-3">
                This template is pre-optimized for {profession.name.toLowerCase()} services.
                Simply fill in your details below and start creating professional invoices.
              </p>
              <Button
                onClick={() => {
                  document.getElementById('invoice-form')?.scrollIntoView({
                    behavior: 'smooth'
                  });
                }}
                className="w-full"
              >
                Start Creating Invoice
              </Button>
            </Card>
          </div>
        </div>

        {/* SEO Content */}
        <div className="border-t pt-6">
          <h2 className="text-2xl font-bold mb-4">
            Professional {profession.name} Invoice Template - Free Download
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
            <div>
              <p className="mb-3">
                Our free {profession.name.toLowerCase()} invoice template is specifically designed
                for professionals in the {profession.name.toLowerCase()} industry. Whether you're
                a freelancer or running an agency, this template includes all the essential
                elements needed for professional billing.
              </p>
              <p>
                The template supports both hourly and project-based billing, making it perfect
                for the diverse pricing models used in {profession.name.toLowerCase()} services.
              </p>
            </div>
            <div>
              <p className="mb-3">
                Features include automatic calculations, professional formatting, PDF export,
                and industry-specific service descriptions. Your clients will receive
                clear, detailed invoices that reflect your professional standards.
              </p>
              <p>
                Start creating professional {profession.name.toLowerCase()} invoices today -
                completely free with no registration required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}