const fs = require('fs');
const path = require('path');

// Read the CSV file to get all profession slugs
const csvPath = '/Users/coreyhaines/Desktop/invoicecommand_types_expanded.csv';
const csvContent = fs.readFileSync(csvPath, 'utf8');
const lines = csvContent.trim().split('\n');

// Filter out invoice types that aren't professions
const excludeTypes = [
  'basic', 'blank', 'commercial', 'detailed', 'estimate', 'hourly',
  'inventory', 'order', 'packing-slip', 'partial-payment', 'professional',
  'proforma', 'purchase-order', 'quote', 'recurring', 'rental', 'retainer',
  'return', 'shipping', 'simple', 'tax', 'wholesale'
];

const professionSlugs = lines
  .slice(1) // Remove header
  .map(line => line.trim())
  .filter(slug => slug && !excludeTypes.includes(slug));

console.log(`🔍 Found ${professionSlugs.length} profession templates`);

// Generate sitemap XML
const today = new Date().toISOString().split('T')[0];

let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://invoicecommand.com</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
`;

// Add all profession template URLs
professionSlugs.forEach(slug => {
  sitemapContent += `  <url>
    <loc>https://invoicecommand.com/invoice-templates/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
});

sitemapContent += `</urlset>`;

// Write the sitemap file
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(sitemapPath, sitemapContent);

console.log(`✅ Generated sitemap with ${professionSlugs.length + 1} URLs`);
console.log(`📝 Written to: ${sitemapPath}`);
console.log(`🎯 Sample URLs:`);
professionSlugs.slice(0, 5).forEach(slug => {
  console.log(`   - https://invoicecommand.com/invoice-templates/${slug}`);
});

// Also generate a sitemap index if needed (for very large sitemaps)
if (professionSlugs.length > 500) {
  console.log(`ℹ️  Note: With ${professionSlugs.length} URLs, consider implementing a sitemap index for better SEO`);
}