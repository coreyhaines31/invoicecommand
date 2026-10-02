#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Helper function to convert slug to display name
function slugToDisplayName(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Add a new invoice type
function addInvoiceType(newType) {
  const csvPath = path.join(__dirname, '../data/invoice-types.csv');

  // Read existing types
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const lines = csvContent.trim().split('\n');
  const existingTypes = lines.slice(1).map(line => line.trim());

  // Check if type already exists
  if (existingTypes.includes(newType)) {
    console.log(`❌ Type "${newType}" already exists`);
    return false;
  }

  // Add new type and sort alphabetically
  const allTypes = [...existingTypes, newType].sort();

  // Write back to CSV
  const newCsvContent = 'type\n' + allTypes.join('\n') + '\n';
  fs.writeFileSync(csvPath, newCsvContent);

  console.log(`✅ Added "${newType}" (${slugToDisplayName(newType)})`);
  console.log(`📊 Total types: ${allTypes.length}`);

  return true;
}

// Regenerate all data files
function regenerateData() {
  console.log('🔄 Regenerating profession data...');

  // Run the generation script
  require('./generate-professions.js');

  console.log('🔄 Regenerating sitemap...');

  // Run sitemap generation
  require('./generate-sitemap.js');

  console.log('✅ All data files regenerated!');
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
📋 Invoice Type Manager

Usage:
  node add-invoice-type.js <type-slug>         Add a new invoice type
  node add-invoice-type.js --regenerate        Regenerate all data files
  node add-invoice-type.js --list             Show all current types

Examples:
  node add-invoice-type.js drone-pilot
  node add-invoice-type.js ai-consultant
  node add-invoice-type.js podcast-editor
`);
    process.exit(1);
  }

  if (args[0] === '--regenerate') {
    regenerateData();
  } else if (args[0] === '--list') {
    const csvPath = path.join(__dirname, '../data/invoice-types.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const types = csvContent.trim().split('\n').slice(1);

    console.log(`📊 Current invoice types (${types.length}):`);
    types.forEach((type, index) => {
      console.log(`  ${(index + 1).toString().padStart(3)}: ${type} (${slugToDisplayName(type)})`);
    });
  } else {
    const newType = args[0];

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(newType)) {
      console.log('❌ Type must be lowercase with dashes only (e.g., "ai-consultant")');
      process.exit(1);
    }

    if (addInvoiceType(newType)) {
      console.log('\n🚀 To apply changes:');
      console.log('  node add-invoice-type.js --regenerate');
    }
  }
}

module.exports = { addInvoiceType, regenerateData };