import type { TemplateCluster } from '@/types/templates'

export const purchaseOrderTemplates: TemplateCluster = {
  documentKind: 'purchase_order',
  basePath: '/purchase-order-template',

  hub: {
    metaTitle: 'Free Purchase Order Template — Generate POs Online | Invoice Command',
    h1: 'Free Purchase Order Template',
    metaDescription:
      'Create and send purchase orders in seconds with our free PO template. Download as PDF, Excel, or Word, or use our online generator. No signup required.',
    keywords: [
      'purchase order template',
      'free purchase order template',
      'purchase order',
      'po template',
      'purchase order form',
      'sample purchase order',
    ],
    intro:
      'A purchase order (PO) is a document a buyer sends to a vendor to formally request goods or services at agreed prices and terms. Use our free purchase order template to create professional POs in under a minute — fill out the form, preview it live, and download as PDF, Excel, or Word.',
    sections: [
      {
        heading: 'What is a purchase order?',
        body: 'A purchase order is a legally binding offer from a buyer to a seller. It specifies what is being ordered, in what quantity, at what price, and on what terms. Once accepted, it becomes a contract. POs help buyers control spending, document approvals, and match deliveries to orders. Sellers use them to reserve inventory and trigger fulfillment.',
      },
      {
        heading: 'What to include on a purchase order',
        body: 'Every purchase order should include: a unique PO number, the date issued, buyer and vendor names and addresses, line items with descriptions and quantities, unit prices and line totals, applicable taxes and shipping, payment terms (e.g. Net 30), requested delivery date, and ship-to address. Optional fields include billing address, special instructions, and approval signatures.',
      },
      {
        heading: 'Choose a format',
        body: 'Pick the format that matches how your team works. Use our online generator to create a PO and download as PDF for clean printing or emailing. Use Excel or Word templates if you prefer to edit offline or need to bulk-edit. Use Google Docs or Sheets to collaborate with teammates in real time.',
      },
    ],
    faq: [
      {
        question: 'Is the purchase order template really free?',
        answer:
          'Yes — completely free. No signup, no credit card, no watermark. You can generate unlimited purchase orders, download them, and send them to vendors at no cost.',
      },
      {
        question: 'What is the difference between a purchase order and an invoice?',
        answer:
          'A purchase order is sent by the buyer to the vendor before goods or services are delivered, requesting them. An invoice is sent by the vendor to the buyer after delivery, requesting payment. The PO precedes the invoice in the procurement workflow.',
      },
      {
        question: 'Do I need a purchase order number?',
        answer:
          'Yes. Every purchase order should have a unique number so the buyer, vendor, and accounts payable team can match the PO to its corresponding invoice and delivery. Our generator creates PO numbers automatically (e.g. PO-1001), and you can customize the prefix.',
      },
    ],
  },

  clusterVariants: [
    {
      slug: 'excel',
      type: 'format',
      metaTitle: 'Free Purchase Order Template (Excel) | Invoice Command',
      h1: 'Free Purchase Order Template (Excel)',
      metaDescription:
        'Download a free purchase order template in Excel (.xlsx) with built-in formulas for line totals, tax, and grand total. Editable, printable, no signup.',
      keywords: [
        'purchase order template excel',
        'po template excel',
        'purchase order format in excel',
        'po form excel',
        'free purchase order template excel',
      ],
      intro:
        'Download our free purchase order template in Excel format. The .xlsx file includes built-in formulas for line totals, tax, and grand total — just fill in the line items and the math takes care of itself.',
      sections: [
        {
          heading: 'What you get in the Excel template',
          body: 'A pre-styled Excel workbook with header fields for buyer and vendor info, a line item table that auto-calculates subtotals and totals, and dedicated cells for tax rate, shipping, and grand total. Print-ready layout that fits on one page when filled out.',
        },
        {
          heading: 'How to use the Excel template',
          body: 'Click the download button to save the .xlsx file. Open it in Excel, Numbers, or any spreadsheet app that supports Excel files. Fill in your business info once, save it as a master template, then duplicate the file for each new PO. Edit the line items — totals update automatically.',
        },
      ],
      faq: [
        {
          question: 'Will the formulas work in Google Sheets or Numbers?',
          answer:
            'Yes. The formulas use standard SUM and arithmetic functions that work identically in Excel, Google Sheets, Apple Numbers, and LibreOffice Calc.',
        },
        {
          question: 'Can I customize the template?',
          answer:
            'Absolutely. The Excel file is fully unlocked — change the colors, add your logo, rename columns, or add new rows. It is yours to modify.',
        },
        {
          question: 'Is there an online version?',
          answer:
            'Yes. If you prefer to skip Excel entirely, use our online purchase order generator to fill out a PO in your browser and download as PDF.',
        },
      ],
    },
    {
      slug: 'word',
      type: 'format',
      metaTitle: 'Free Purchase Order Template (Word) | Invoice Command',
      h1: 'Free Purchase Order Template (Word)',
      metaDescription:
        'Download a free purchase order template in Microsoft Word (.docx). Editable, printable, professional layout. No signup required.',
      keywords: [
        'purchase order template word',
        'po template word',
        'free purchase order template word',
        'purchase order word template free',
        'po sample word',
      ],
      intro:
        'Download our free purchase order template in Microsoft Word format (.docx). Edit the buyer info, vendor info, and line items right in Word — the layout adapts automatically.',
      sections: [
        {
          heading: 'What you get in the Word template',
          body: 'A clean .docx file with structured tables for header info, line items, and totals. Designed to print cleanly on Letter and A4 paper. Compatible with Microsoft Word, Google Docs, Apple Pages, and LibreOffice Writer.',
        },
        {
          heading: 'When to use the Word template',
          body: 'Word is the right choice when your purchase orders include long descriptions, custom terms, attached scopes of work, or paragraphs of conditions. If your POs are mostly tabular line items with calculations, the Excel template will save you more time.',
        },
      ],
      faq: [
        {
          question: 'Does it open in Google Docs?',
          answer:
            'Yes. Upload the .docx file to Google Drive and open it with Google Docs. Formatting is preserved.',
        },
        {
          question: 'Can I add my company logo?',
          answer:
            'Yes. The header section has a placeholder where you can insert your logo image. Replace the placeholder using Insert → Picture in Word.',
        },
        {
          question: 'Should I use Word or Excel?',
          answer:
            'Use Word for narrative POs with custom terms and clauses. Use Excel for line-item-heavy POs where you need automatic calculations. Both are free.',
        },
      ],
    },
    {
      slug: 'pdf',
      type: 'format',
      metaTitle: 'Free Purchase Order Template (PDF) | Invoice Command',
      h1: 'Free Purchase Order Template (PDF)',
      metaDescription:
        'Generate and download professional purchase orders as PDF. Fill out the online form, preview, and download instantly. Free, no signup.',
      keywords: [
        'purchase order template pdf',
        'purchase order pdf',
        'po format in pdf',
        'po template pdf',
      ],
      intro:
        'Create a purchase order online and download it as a PDF in under a minute. Our generator produces clean, print-ready PDFs that look professional in any inbox.',
      sections: [
        {
          heading: 'Why PDF?',
          body: 'PDF is the universal format for finished business documents. Vendors can open the file on any device without installing software, the layout never breaks, and the document cannot be edited accidentally in transit. PDFs are the right format for sending to vendors, archiving, and printing.',
        },
        {
          heading: 'How the PDF generator works',
          body: 'Fill out the buyer info, vendor info, and line items in the online form. Watch the live preview update as you type. When the PO looks right, click download — your PDF is ready instantly. No signup, no watermark, no cost.',
        },
      ],
      faq: [
        {
          question: 'Is the PDF editable after download?',
          answer:
            'No — PDFs are fixed-layout by design, which is exactly what you want when sending a PO to a vendor. If you need to change something, edit the form online and re-download the PDF.',
        },
        {
          question: 'Can I save the PO and edit it later?',
          answer:
            'If you create an account, your POs are saved and editable. Anonymous users can use localStorage to persist their data on the same device.',
        },
        {
          question: 'Are there any limits?',
          answer:
            'No. Generate and download as many PDF purchase orders as you want — there is no limit and no cost.',
        },
      ],
    },
    {
      slug: 'google-docs',
      type: 'format',
      metaTitle: 'Free Purchase Order Template (Google Docs) | Invoice Command',
      h1: 'Free Purchase Order Template (Google Docs)',
      metaDescription:
        'Free purchase order template for Google Docs. Click "Make a copy" and start editing in your browser. No download required.',
      keywords: [
        'purchase order template google docs',
        'google docs purchase order template',
        'po template google docs',
      ],
      intro:
        'Use our purchase order template directly in Google Docs. Click the "Make a copy" link below to add it to your Google Drive and start editing — no download required.',
      sections: [
        {
          heading: 'When to use Google Docs',
          body: 'Google Docs is the right choice when multiple teammates need to view or edit the same purchase order, when you want version history without managing files, or when you need to share a PO with a vendor for comments before finalizing.',
        },
        {
          heading: 'How to use the template',
          body: 'Click the "Make a copy" button. Google will copy the template to your Drive and open it for editing. Replace the placeholder text with your buyer info, vendor info, and line items. Use File → Download → PDF when ready to send.',
        },
      ],
      faq: [
        {
          question: 'Do I need a Google account?',
          answer: 'Yes — you need a Google account to copy the template to your Drive. Google accounts are free.',
        },
        {
          question: 'Can I share the PO with my team?',
          answer:
            'Yes. Use the Share button in Google Docs to give teammates view, comment, or edit access. Standard Google Docs permissions apply.',
        },
        {
          question: 'How do I send the PO to a vendor?',
          answer:
            'Use File → Download → PDF to export, then attach the PDF to your email. Avoid sharing the live Google Doc with vendors unless you want them to see future edits.',
        },
      ],
    },
    {
      slug: 'google-sheets',
      type: 'format',
      metaTitle: 'Free Purchase Order Template (Google Sheets) | Invoice Command',
      h1: 'Free Purchase Order Template (Google Sheets)',
      metaDescription:
        'Free purchase order template for Google Sheets with auto-calculating line totals. Click "Make a copy" to start.',
      keywords: [
        'purchase order template google sheets',
        'google sheets purchase order template',
        'po template google sheets',
      ],
      intro:
        'Use our purchase order template in Google Sheets with built-in formulas for line totals, tax, and grand total. Click "Make a copy" to add it to your Google Drive.',
      sections: [
        {
          heading: 'What you get',
          body: 'A pre-built Google Sheet with header cells for buyer and vendor info, a line item table with SUM formulas for line totals and grand total, and dedicated cells for tax rate and shipping. Same structure as the Excel template, but cloud-native.',
        },
        {
          heading: 'Best for',
          body: 'Teams that already use Google Workspace, anyone who wants automatic version history, and buyers who manage multiple POs in a single workbook (just duplicate the sheet tab for each new PO).',
        },
      ],
      faq: [
        {
          question: 'Will it work in Excel?',
          answer:
            'Yes — File → Download → Excel will export the sheet to a .xlsx file with formulas intact.',
        },
        {
          question: 'Can I track multiple POs in one workbook?',
          answer:
            'Yes. Duplicate the sheet tab for each new PO, or build a summary tab that pulls totals from each PO sheet using cross-sheet references.',
        },
        {
          question: 'How do I export as PDF?',
          answer:
            'File → Download → PDF lets you export the current sheet as a print-ready PDF before sending to a vendor.',
        },
      ],
    },
    {
      slug: 'automotive',
      type: 'profession',
      metaTitle: 'Automotive Dealer Purchase Order Template (Free) | Invoice Command',
      h1: 'Automotive Dealer Purchase Order Template',
      metaDescription:
        'Free B2B automotive purchase order template for dealer-to-dealer trades, fleet acquisitions, and auto parts orders. VIN and wholesale terms included.',
      keywords: [
        'automotive purchase order',
        'auto dealer purchase order',
        'dealer to dealer po',
        'fleet purchase order template',
        'auto parts purchase order',
      ],
      intro:
        'Create B2B automotive purchase orders for dealer-to-dealer trades, fleet acquisitions, and wholesale auto parts. This template is for dealerships, fleet managers, and auto shops — for single retail buyer agreements, use the vehicle buyers order template instead.',
      sections: [
        {
          heading: 'B2B automotive PO scenarios',
          body: 'Inter-dealer inventory trades, auction purchases, fleet acquisitions (commercial vans, service trucks, rental cars), and wholesale parts orders from OEM suppliers and distributors. Captures VIN, stock number, wholesale price, and delivery coordination across dealership locations.',
        },
        {
          heading: 'Wholesale auto PO terms',
          body: 'Dealer POs typically reference wholesale (vs. MSRP) pricing, title assignment and reassignment responsibilities, floorplan financing references, auction fees (if applicable), and transport coordination. Payment timing often follows net terms tied to title delivery.',
        },
      ],
      faq: [
        {
          question: 'Is this the same as a retail buyers order?',
          answer:
            'No — this template is for B2B automotive transactions. If you are selling a vehicle to an individual customer, use our vehicle buyers order template, which captures trade-ins, taxes, and out-the-door pricing.',
        },
        {
          question: 'Can I use it for parts orders?',
          answer:
            'Yes. Use the line items section for wholesale parts with SKUs, quantities, and unit prices. Vehicle-specific fields (VIN) are optional for parts-only POs.',
        },
        {
          question: 'Does it handle fleet acquisitions?',
          answer:
            'Yes. Add each vehicle as a separate line item with VIN or list them in an attached spec sheet referenced from the PO. Include delivery location and required-by date in the terms section for each unit.',
        },
      ],
      sampleLineItems: [
        { description: '2024 Toyota Camry SE — VIN to follow', quantity: 1, price: 28500 },
        { description: 'Extended warranty (5 yr / 60k mi)', quantity: 1, price: 1850 },
        { description: 'All-weather floor mats', quantity: 1, price: 220 },
      ],
      sampleTerms:
        'Delivery within 14 days of PO issuance. Title to transfer at delivery. Vehicle to be inspected by buyer prior to acceptance. Payment due Net 10 from delivery date.',
    },
    {
      slug: 'construction',
      type: 'profession',
      metaTitle: 'Construction Purchase Order Template (Free) | Invoice Command',
      h1: 'Construction Purchase Order Template',
      metaDescription:
        'Free construction purchase order template for materials, subcontractors, and equipment. Job site and project number fields included.',
      keywords: [
        'construction purchase order',
        'construction purchase order template',
        'purchase order for construction materials',
        'construction po',
        'subcontractor purchase order template',
      ],
      intro:
        'Create purchase orders for construction materials, subcontractor services, and equipment rentals. Includes job site, project number, and lien-related fields specific to construction work.',
      sections: [
        {
          heading: 'When to use a construction PO',
          body: 'Use construction POs for any material purchase from a supplier (lumber, concrete, fixtures, electrical), subcontractor scopes (framing, plumbing, electrical, drywall), and equipment rentals. The PO documents the agreed price, job assignment, and delivery requirements before work or material flows.',
        },
        {
          heading: 'Construction-specific fields',
          body: 'Construction POs benefit from a job site address (separate from the contractor billing address), a project or job number that ties the PO to a specific build, scope language for subcontractor POs, and references to lien waivers and retainage in the terms section.',
        },
      ],
      faq: [
        {
          question: 'How is a construction PO different from a regular PO?',
          answer:
            'Construction POs typically include a job site address, project or job number, and references to construction-specific terms like retainage, lien waivers, and progress billing. Otherwise the structure is the same.',
        },
        {
          question: 'Can I use this for subcontractors?',
          answer:
            'Yes. Use the line items section to describe the scope of work and the agreed amount. Include scope details, completion criteria, and payment milestones in the terms section.',
        },
        {
          question: 'What about retainage?',
          answer:
            'Note any retainage percentage and release terms in the PO terms section. Most construction POs withhold a percentage of payment until project completion to ensure satisfactory delivery.',
        },
      ],
      sampleLineItems: [
        { description: 'Framing lumber package — Job 2024-117', quantity: 1, price: 8400 },
        { description: 'Concrete delivery — 12 yards', quantity: 12, price: 165 },
        { description: 'Subcontractor: rough electrical', quantity: 1, price: 6500 },
      ],
      sampleTerms:
        'Delivery to job site address above by date specified. 10% retainage held until project completion and lien waiver received. Net 30 from delivery or completion of scope.',
    },
    {
      slug: 'vehicle',
      type: 'profession',
      metaTitle: 'Vehicle Buyers Order Template (Retail Car Purchase) | Invoice Command',
      h1: 'Vehicle Buyers Order Template',
      metaDescription:
        'Free vehicle buyers order template for retail car, truck, RV, and motorcycle purchases. Trade-in, tax, and out-the-door pricing included.',
      keywords: [
        'vehicle buyers order',
        'vehicle buyers order template',
        'car buyers order',
        'retail vehicle purchase order',
        'used car purchase agreement',
      ],
      intro:
        'A buyers order is the retail, consumer-facing counterpart to a dealer PO. Use this template to document a single vehicle sale to an individual customer — private-party sales, dealer-to-consumer transactions, RV or motorcycle purchases — with trade-in, taxes, and out-the-door pricing in one view.',
      sections: [
        {
          heading: 'Retail buyers order vs dealer PO',
          body: 'A dealer PO documents a wholesale transaction between dealerships or auto businesses. A buyers order documents a retail transaction between a seller and an individual customer — it includes tax lines, title and registration fees, and trade-in credits that a wholesale PO usually omits. Use this template for the retail side; use the automotive dealer PO for B2B.',
        },
        {
          heading: 'Trade-in, taxes, and out-the-door math',
          body: 'List the trade-in as a negative line item at the agreed allowance. Add sales tax, title transfer, and registration fees as separate line items so the subtotal shows agreed vehicle price, the total shows out-the-door cost, and both buyer and seller can see the math without a calculator.',
        },
      ],
      faq: [
        {
          question: 'Is a buyers order legally binding?',
          answer:
            'Once signed by both parties, a buyers order is generally a binding sales contract. It documents the agreed price, vehicle description, and terms — consult an attorney in your state for high-value sales or unusual terms.',
        },
        {
          question: 'Do I need to note the title status?',
          answer:
            'Yes. Record whether the vehicle has a clean, salvage, or rebuilt title in the terms section. This disclosure is legally required in most US states for used vehicle sales and protects both parties.',
        },
        {
          question: 'What about as-is sales?',
          answer:
            'Add explicit "as-is, no warranty" language to the terms section when applicable. Private-party used car sales are typically as-is by default, but written confirmation protects the seller against later disputes.',
        },
      ],
      sampleLineItems: [
        { description: '2022 Honda Civic LX — VIN: 2HGFE2F58NH123456', quantity: 1, price: 22500 },
        { description: 'Trade-in allowance: 2018 Hyundai Elantra', quantity: 1, price: -8500 },
        { description: 'Title and registration fees', quantity: 1, price: 285 },
      ],
      sampleTerms:
        'Vehicle sold with clean title. Buyer responsible for registration in their state. Delivery at dealership. Trade-in vehicle to be inspected before final allowance is confirmed.',
    },
    {
      slug: 'quickbooks',
      type: 'integration',
      metaTitle: 'QuickBooks Purchase Order Template (Free Alternative) | Invoice Command',
      h1: 'QuickBooks Purchase Order Template',
      metaDescription:
        'Free purchase order template for QuickBooks users. Generate POs online and export to PDF. No QuickBooks subscription required.',
      keywords: [
        'quickbooks purchase order',
        'quickbooks online purchase order',
        'quickbooks purchase order template',
      ],
      intro:
        'Need a purchase order but do not want to upgrade your QuickBooks plan? Our free PO generator produces clean, professional purchase orders you can send to vendors and reference back to QuickBooks for AP matching.',
      sections: [
        {
          heading: 'Why use this instead of (or alongside) QuickBooks',
          body: 'QuickBooks Online includes purchase orders only on Plus and Advanced plans. If you are on Simple Start or Essentials, our free PO generator gives you the same document without an upgrade. If you already have Plus or Advanced, our generator is faster for one-off POs and produces cleaner PDFs for vendor email.',
        },
        {
          heading: 'How to match POs to QuickBooks bills',
          body: 'Use a consistent PO numbering scheme (e.g. PO-1001, PO-1002) and reference the PO number in the bill memo when you enter the vendor invoice in QuickBooks. This creates a manual three-way match between PO, receiving, and bill — the same process QuickBooks uses internally.',
        },
      ],
      faq: [
        {
          question: 'Can I import POs from this generator into QuickBooks?',
          answer:
            'Direct import is not supported today. You can download the PO as a PDF for vendor email and reference the PO number when you enter the matching bill in QuickBooks.',
        },
        {
          question: 'Will this work with QuickBooks Desktop?',
          answer:
            'Yes — the PDF output works with any AP workflow, whether you use QuickBooks Desktop, QuickBooks Online, or any other accounting software.',
        },
        {
          question: 'Is there a way to track PO status?',
          answer:
            'Today our app saves POs so you can retrieve and edit them later. Dedicated open/received/closed statuses live in QuickBooks — close the PO in QB once the matching bill is recorded. Built-in PO status tracking is on our roadmap.',
        },
      ],
      integrationName: 'QuickBooks',
    },
  ],

  standalonePages: [
    {
      slug: 'purchase-order-generator',
      type: 'intent',
      metaTitle: 'Free Purchase Order Generator — Live Preview + PDF | Invoice Command',
      h1: 'Free Purchase Order Generator',
      metaDescription:
        'Fill in a form, watch the PO render live, download a print-ready PDF. Built for accuracy: auto-math, clean typography, and a WYSIWYG preview beside the form.',
      keywords: [
        'purchase order generator',
        'po generator',
        'free purchase order generator',
        'online purchase order generator',
        'purchase order generator with preview',
      ],
      intro:
        'The generator is the tool at the heart of Invoice Command — a two-pane editor where the form on the left drives a live, WYSIWYG preview on the right. Every keystroke updates the rendered PO, so what you see is exactly what the vendor receives as a PDF.',
      sections: [
        {
          heading: 'Why the live preview matters',
          body: 'Traditional PO templates force you to fill in a form, export, open the file, spot a mistake, go back, edit, re-export. The generator collapses that loop: the preview is the final document. Typos, layout issues, and math errors surface as you type instead of after you send.',
        },
        {
          heading: 'Under the hood',
          body: 'Line totals, subtotals, tax, and grand total recalculate on every edit. Currency is consistent across the document. Logos are embedded at vector resolution when possible. The PDF exporter uses the same renderer as the preview, so no "it looked different in the browser" surprises.',
        },
      ],
      faq: [
        {
          question: 'Does the preview exactly match the PDF?',
          answer:
            'Yes — the preview and the PDF use the same renderer. Fonts, spacing, logo placement, and line item alignment are identical. If it looks right in the preview, it will look right in the vendor\'s inbox.',
        },
        {
          question: 'Can I undo an edit?',
          answer:
            'Browser undo (Cmd/Ctrl+Z) works inside text fields. For line item changes, remove the item with the × button or overwrite the value — the preview updates immediately so you can see the correction before saving.',
        },
        {
          question: 'Can I use my logo?',
          answer:
            'Yes. Upload PNG or SVG in the buyer info section and the logo appears in the PO header and downloaded PDF. SVG is recommended for crisp printing at any size.',
        },
      ],
    },
    {
      slug: 'purchase-order-maker',
      type: 'intent',
      metaTitle: 'Free Purchase Order Maker — Create POs Online | Invoice Command',
      h1: 'Purchase Order Maker',
      metaDescription:
        'Make purchase orders online in under a minute. Fill out the form, preview live, and download a clean PDF. Free, no signup, no watermark.',
      keywords: [
        'purchase order maker',
        'po maker',
        'purchase order maker free',
        'make purchase order online',
        'po maker for contractors',
      ],
      intro:
        'Make a purchase order without opening Word, Excel, or a template file. The PO maker is a single online form: fill in vendor, ship-to, and line items; watch the PDF preview update as you type; download when it looks right.',
      sections: [
        {
          heading: 'Faster than editing a template',
          body: 'Desktop templates mean opening the file, saving-as, editing each cell, formatting totals, re-exporting to PDF, then attaching to an email. The PO maker skips every step after "fill in the fields" — totals calculate automatically and the PDF is one click away.',
        },
        {
          heading: 'What goes in a PO',
          body: 'Buyer info (your company and contact), vendor info, PO number and date, ship-to address, line items with description, quantity, and unit price, plus subtotal, tax, shipping, and grand total. Add payment terms and delivery instructions in the notes field.',
        },
      ],
      faq: [
        {
          question: 'Do I need an account?',
          answer:
            'No. You can generate and download a PO without signing up. Creating a free account lets you save POs to edit later, but it is never required to produce a PDF.',
        },
        {
          question: 'Can I add my logo?',
          answer:
            'Yes. Upload a PNG or JPG in the branding section and it appears in the PDF header. Logo changes preview instantly alongside the rest of the document.',
        },
        {
          question: 'Is there a limit on POs?',
          answer:
            'No. Generate as many POs as you need — no daily quota, no monthly cap, no cooldown between downloads.',
        },
      ],
    },
    {
      slug: 'purchase-order-software',
      type: 'intent',
      metaTitle: 'Free Purchase Order Software for Small Business | Invoice Command',
      h1: 'Purchase Order Software for Small Business',
      metaDescription:
        'Free, simple purchase order software for small businesses: generate clean PO PDFs, reuse vendor and company info, and skip the spreadsheet shuffle.',
      keywords: [
        'purchase order software',
        'po software',
        'purchase order software free',
        'purchase order software for small business',
        'purchase order management software',
      ],
      intro:
        'A one-off PO download does not need software. A steady flow of POs does. This page is about the layer above the single document: a consistent PO format, your company info saved once, and a generator that produces print-ready PDFs in under a minute — without the price tag of a full procurement platform.',
      sections: [
        {
          heading: 'What small businesses actually need',
          body: 'Most teams under 50 people do not need approval workflows, budget holds, or three-way matching. They need a fast way to produce a professional-looking PO, a consistent PO number scheme, and a PDF that vendors recognize. That is exactly what this tool provides — the same document an ERP would print, without the ERP price tag.',
        },
        {
          heading: 'Where we stop (and where ERPs start)',
          body: 'We deliberately do not ship approval workflows, multi-entity GL coding, three-way matching, or budget holds. If those are requirements, look at NetSuite, Procurify, or Coupa. Most businesses under 50 people do not need them and save real money by using lighter software.',
        },
      ],
      faq: [
        {
          question: 'Is this really free?',
          answer:
            'Yes. Unlimited PO PDFs, no watermark, no trial countdown, no signup required to download. Paid features exist for invoicing and payments, but the PO tool is free.',
        },
        {
          question: 'Does it integrate with QuickBooks?',
          answer:
            'Direct integration is on the roadmap. Today we recommend matching POs to QuickBooks bills manually using consistent PO numbers — see our QuickBooks PO template page for the workflow.',
        },
        {
          question: 'What if I outgrow it?',
          answer:
            'If you hit a point where you need approval workflows, budget controls, or procurement analytics, that is the signal to move to NetSuite, Procurify, or Coupa. Until then, you are not missing anything by keeping it simple.',
        },
      ],
    },
    {
      slug: 'free-purchase-order',
      type: 'intent',
      metaTitle: 'Free Purchase Order — No Trial, No Watermark, No Limit | Invoice Command',
      h1: 'Free Purchase Order',
      metaDescription:
        'Most "free" PO tools gate something. This one does not — unlimited POs, no watermark, no trial countdown, and PDF download before signup. Here is the business model.',
      keywords: [
        'free purchase order',
        'free purchase order no signup',
        'unlimited free purchase order',
        'purchase order no watermark',
      ],
      intro:
        'Most tools calling themselves "free" gate something: a watermark, a 14-day trial, a limit of 3 POs, or a signup wall before you can download. Invoice Command\'s PO tool does none of those. This page explains exactly what is free, what is paid, and why the split makes sense as a business.',
      sections: [
        {
          heading: 'Exactly what is free',
          body: 'Unlimited POs. Unlimited downloads. No watermark on the PDF. No usage counter. No signup required to generate and download. No email capture. No credit card. If you want to save POs to your account so you can edit them later, account creation is also free.',
        },
        {
          heading: 'What costs money (and why)',
          body: 'We charge for features that mid-size businesses and high-volume senders value: online payment collection via Stripe, recurring invoices and subscription billing, team analytics, and priority support. If you only need the document, you never touch the paid layer.',
        },
        {
          heading: 'Why the business model works',
          body: 'Giving the document tool away attracts a wide top of funnel. A small percentage of those users grow into paid customers as their billing needs expand. That conversion is enough to sustain the free tier indefinitely — we are not loss-leading a trial, we are funding free users with paid ones.',
        },
      ],
      faq: [
        {
          question: 'Is there a PO limit per day or per month?',
          answer:
            'No. Generate 1 PO or 1,000 — the tool treats them the same. There is no rate limit, quota, or cooldown.',
        },
        {
          question: 'Will I be asked to pay later?',
          answer:
            'Not for the document tools. The PO generator, PDF download, and blank template stay in the free tier. Paid plans unlock adjacent features (online payment collection, recurring billing, team analytics) but the core PO document remains free.',
        },
        {
          question: 'Do I need to create an account to download?',
          answer:
            'No. The PDF download works without signup. Creating an account only matters if you want to save POs for later editing, search across your history, or share access with a teammate.',
        },
      ],
    },
    {
      slug: 'blank-purchase-order',
      type: 'intent',
      metaTitle: 'Blank Purchase Order Template (Free Download) | Invoice Command',
      h1: 'Blank Purchase Order Template',
      metaDescription:
        'Download a blank purchase order template — print-ready PDF, Excel, and Word. Free, no signup. Fill out by hand or in your computer.',
      keywords: [
        'blank purchase order',
        'blank purchase order template',
        'blank purchase order template word',
        'blank po template',
      ],
      intro:
        'Download a blank purchase order template you can fill out by hand or on your computer. Available as print-ready PDF, editable Excel, or editable Word.',
      sections: [
        {
          heading: 'When you want a blank template',
          body: 'A blank PO template is the right choice when you need a stack of pre-printed forms for the field, when your AP process requires handwritten signatures, or when you simply prefer pen and paper for one-off orders. Print as many copies as you need.',
        },
        {
          heading: 'What the blank template includes',
          body: 'All standard PO fields with empty lines: PO number, date, buyer info, vendor info, ship-to, line items table (10 rows), subtotal, tax, shipping, total, terms, and signature lines. Print on standard letter or A4 paper.',
        },
      ],
      faq: [
        {
          question: 'Can I print this on carbon copy paper?',
          answer:
            'Yes — the layout is designed to fit standard 2-part or 3-part carbonless forms if you have them. Otherwise, print two copies on plain paper.',
        },
        {
          question: 'Is the Word file editable?',
          answer:
            'Yes. Open in Word and add your company name, logo, and standard terms once, then save as a master template you reuse for all future POs.',
        },
        {
          question: 'Should I use blank or generated POs?',
          answer:
            'Use blank templates if you prefer paper or need handwritten signatures. Use the online generator if you want to skip the math, get a clean PDF, and email POs directly to vendors.',
        },
      ],
    },
  ],
}

