import type { TemplateCluster } from '@/types/templates'

export const salesOrderTemplates: TemplateCluster = {
  documentKind: 'sales_order',
  basePath: '/sales-order-template',

  hub: {
    metaTitle: 'Free Sales Order Template — Generate Sales Orders Online | Invoice Command',
    h1: 'Free Sales Order Template',
    metaDescription:
      'Create sales orders in seconds with our free template. Confirm customer orders, lock in pricing, and trigger fulfillment. Download as PDF, Excel, or Word.',
    keywords: [
      'sales order template',
      'free sales order template',
      'sales order',
      'sales order form',
      'sales order generator',
    ],
    intro:
      'A sales order (SO) is a document a seller issues to confirm a customer order before fulfillment. It captures the agreed items, prices, and delivery terms — the seller-side counterpart to a purchase order. Use our free sales order template to confirm customer orders quickly and trigger your fulfillment workflow.',
    sections: [
      {
        heading: 'What is a sales order?',
        body: 'A sales order is internal-facing in many companies and customer-facing in others. It documents that the seller has accepted a customer order, locks in agreed pricing and quantities, and serves as the source of truth for the picking, packing, and shipping process. In businesses without ERP software, the sales order doubles as an order acknowledgment to the customer.',
      },
      {
        heading: 'Sales order vs invoice vs purchase order',
        body: 'A purchase order (PO) is sent by the buyer to the seller. A sales order (SO) is created by the seller to confirm and track that order internally. An invoice is sent by the seller to the buyer after delivery, requesting payment. SO sits in the middle of the flow: PO in → SO created → goods shipped → invoice sent.',
      },
      {
        heading: 'When to use a sales order',
        body: 'Use sales orders when you need to confirm customer orders before invoicing, reserve inventory, document agreed pricing for orders that ship later, or formalize complex orders with multiple line items and ship dates. For simple service businesses that invoice immediately, an invoice alone may be enough.',
      },
    ],
    faq: [
      {
        question: 'Is the sales order template free?',
        answer:
          'Yes. The sales order template, generator, and downloads are all free with no signup required and no usage limits.',
      },
      {
        question: 'What is the difference between a sales order and an invoice?',
        answer:
          'A sales order confirms what the customer ordered before fulfillment. An invoice requests payment after delivery. The sales order comes first; the invoice comes later. For some businesses, both documents are sent to the customer; for others, the SO is purely internal.',
      },
      {
        question: 'Do I need a sales order if I already send invoices?',
        answer:
          'Not always. If you fulfill and invoice in the same step (e.g. a service business or instant-shipment retailer), invoices alone are usually enough. Sales orders shine when there is a delay between order acceptance and fulfillment.',
      },
    ],
  },

  clusterVariants: [
    {
      slug: 'pdf',
      type: 'format',
      metaTitle: 'Free Sales Order Template (PDF) | Invoice Command',
      h1: 'Free Sales Order Template (PDF)',
      metaDescription:
        'Generate and download professional sales orders as PDF. Fill out the online form, preview live, download instantly. Free, no signup.',
      keywords: [
        'sales order template pdf',
        'sales order pdf',
        'sales order format pdf',
        'so template pdf',
      ],
      intro:
        'Create a sales order online and download it as a PDF in under a minute. Our generator produces clean, print-ready PDFs you can attach to an order confirmation email or hand to the fulfillment team.',
      sections: [
        {
          heading: 'Why PDF?',
          body: 'PDF is the right format for finished order documents. The customer receives the exact layout you created — no font substitutions, no broken page breaks, no editable fields to worry about. Archives cleanly, prints identically on any printer, and opens on any device without extra software.',
        },
        {
          heading: 'How the PDF generator works',
          body: 'Fill in customer info, line items, and requested ship date. Watch the live preview update as you type. Click download — your PDF is ready instantly. No watermark, no account required.',
        },
      ],
      faq: [
        {
          question: 'Can I edit the PDF after download?',
          answer:
            'No — PDFs are fixed by design, which is what you want when confirming a customer order. To change something, edit the form online and re-download.',
        },
        {
          question: 'Can I save the SO to edit later?',
          answer:
            'Yes, if you create a free account. Anonymous users can rely on localStorage to persist data on the same device, but account signup makes SOs accessible across devices.',
        },
        {
          question: 'Any limits on downloads?',
          answer:
            'No. Generate and download unlimited sales order PDFs — there is no cap and no cost.',
        },
      ],
    },
    {
      slug: 'word',
      type: 'format',
      metaTitle: 'Free Sales Order Template (Word) | Invoice Command',
      h1: 'Free Sales Order Template (Word)',
      metaDescription:
        'Download a free sales order template in Microsoft Word (.docx). Editable layout with customer info, line items, and ship date fields.',
      keywords: [
        'sales order template word',
        'sales order template word free',
        'sales order form template word',
      ],
      intro:
        'Download our free sales order template in Microsoft Word. Editable, printable, and ready to use — fill in the customer info, line items, and ship date, then save as a master template for future orders.',
      sections: [
        {
          heading: 'What you get',
          body: 'A clean .docx template with structured sections for customer info, line items, totals, ship date, and order terms. Compatible with Word, Google Docs, Pages, and LibreOffice.',
        },
        {
          heading: 'How to customize',
          body: 'Open in Word, replace the placeholder company name with yours, add your logo to the header, and save the file as your master template. Duplicate the file for each new order.',
        },
      ],
      faq: [
        {
          question: 'Will it open in Google Docs?',
          answer: 'Yes. Upload the .docx file to Google Drive and open it with Google Docs. Formatting is preserved.',
        },
        {
          question: 'Is there an Excel version?',
          answer: 'Yes — see the sales order template for Excel for a version with auto-calculating line totals.',
        },
        {
          question: 'Should I use Word or the online generator?',
          answer:
            'Use Word when your SOs include narrative scopes, custom clauses, or need to be edited by people who do not have access to our app. Use the online generator when you want the math handled automatically and a clean PDF in one step.',
        },
      ],
    },
    {
      slug: 'excel',
      type: 'format',
      metaTitle: 'Free Sales Order Template (Excel) | Invoice Command',
      h1: 'Free Sales Order Template (Excel)',
      metaDescription:
        'Download a free sales order template in Excel (.xlsx) with auto-calculating line totals and grand total. Editable and printable.',
      keywords: [
        'sales order template excel',
        'sales order excel template',
        'sales order format in excel',
      ],
      intro:
        'Download our free sales order template in Excel. Built-in formulas calculate line totals, tax, and grand total automatically — just enter your line items.',
      sections: [
        {
          heading: 'What you get',
          body: 'A pre-styled Excel workbook with header fields for customer info, an auto-calculating line items table, and dedicated cells for tax, shipping, and grand total.',
        },
        {
          heading: 'When to use Excel',
          body: 'Excel is the right choice when your sales orders are line-item heavy, when you need to track multiple SOs in a single workbook, or when you want to reuse formulas for inventory math.',
        },
      ],
      faq: [
        {
          question: 'Will the formulas work in Google Sheets?',
          answer: 'Yes. The template uses standard SUM and arithmetic functions that work identically in Sheets.',
        },
        {
          question: 'Is there a Word version?',
          answer:
            'Yes — see the sales order template for Word if your orders are more narrative than tabular.',
        },
        {
          question: 'Can I track multiple SOs in one workbook?',
          answer:
            'Yes. Duplicate the sheet tab for each new SO, or build a summary tab that pulls totals from each SO sheet using cross-sheet references.',
        },
      ],
    },
  ],

  standalonePages: [
    {
      slug: 'sales-order-form',
      type: 'intent',
      metaTitle: 'Free Sales Order Form | Invoice Command',
      h1: 'Free Sales Order Form',
      metaDescription:
        'Free sales order form template. Capture customer orders with all the fields you need: customer info, items, ship date, terms. Download as PDF.',
      keywords: [
        'sales order form',
        'sales order form template',
        'sales order form sample',
        'sample sales order form',
      ],
      intro:
        'Use our free sales order form to capture and confirm customer orders. The form includes every field you need to document an order: customer info, line items with quantities, requested ship date, and standard terms.',
      sections: [
        {
          heading: 'What a sales order form captures',
          body: 'Customer name, billing and shipping addresses, customer PO number reference (if any), order date, requested ship date, line items with descriptions and quantities, unit prices, subtotal, taxes, shipping, and grand total. Plus a notes section for special instructions.',
        },
        {
          heading: 'Print or send digitally',
          body: 'Print blank copies for in-person order taking, or use the online form to capture orders digitally and email confirmations to customers as PDFs. Both flows work with the same template.',
        },
      ],
      faq: [
        {
          question: 'Can I use this for phone orders?',
          answer:
            'Yes. Print blank copies and fill them out by hand while taking orders by phone, then enter into your system later. Or use the online form on a tablet during the call.',
        },
        {
          question: 'Should the customer sign the sales order?',
          answer:
            'Customer signatures are optional but useful for high-value or custom orders. They add legal weight and document acceptance of pricing and terms.',
        },
      ],
    },
    {
      slug: 'sales-order-generator',
      type: 'intent',
      metaTitle: 'Free Sales Order Generator — Create Sales Orders Online | Invoice Command',
      h1: 'Free Sales Order Generator',
      metaDescription:
        'Generate sales orders online for free. Capture customer orders, lock in pricing, and download as PDF. No signup required.',
      keywords: [
        'sales order generator',
        'free sales order generator',
        'create sales order',
        'online sales order generator',
      ],
      intro:
        'Generate sales orders in seconds with our free SO generator. Confirm customer orders, lock in pricing, and download a clean PDF to send back to the customer or hand to your fulfillment team.',
      sections: [
        {
          heading: 'How it works',
          body: 'Type the customer info, add line items, set the requested ship date, and watch the live preview update. When the SO looks right, download the PDF or save it to your account for later editing.',
        },
        {
          heading: 'When to send the SO to the customer',
          body: 'Sending a copy of the sales order back to the customer doubles as an order acknowledgment — it confirms what they ordered, at what price, and when to expect it. This catches errors before fulfillment, when fixes are still cheap.',
        },
      ],
      faq: [
        {
          question: 'Is it free?',
          answer:
            'Yes. The sales order generator is free for unlimited use, with no signup or watermark.',
        },
        {
          question: 'How is this different from the invoice generator?',
          answer:
            'Sales orders confirm what was ordered before fulfillment. Invoices request payment after fulfillment. The forms have different fields (ship date vs due date) and different default terms.',
        },
        {
          question: 'Can I convert a sales order to an invoice?',
          answer:
            'Conversion is on the roadmap. Today, you can copy the line items from an SO to a new invoice in seconds using the same generator.',
        },
      ],
    },
  ],
}
