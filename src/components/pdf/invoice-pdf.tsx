import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { InvoiceData } from '@/stores/invoice-store'

interface InvoicePDFProps {
  invoice: InvoiceData
}

// Cool Money theme colors adapted for PDF
const colors = {
  primary: '#22C55E', // Emerald green from Cool Money theme
  secondary: '#F1F5F9',
  text: '#0F172A',
  muted: '#64748B',
  border: '#E2E8F0',
  white: '#FFFFFF',
  background: '#FEFFFE'
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: colors.background,
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
  },

  // Header Section
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 40,
    paddingBottom: 20,
    borderBottom: `1pt solid ${colors.border}`,
  },

  invoiceTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },

  invoiceNumber: {
    fontSize: 10,
    color: colors.muted,
    fontFamily: 'Courier',
  },

  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
    textAlign: 'right',
  },

  dueDate: {
    fontSize: 10,
    color: colors.muted,
    textAlign: 'right',
  },

  // Contact Information
  contactSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },

  contactBlock: {
    width: '45%',
  },

  contactLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },

  contactName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },

  contactDetails: {
    fontSize: 9,
    color: colors.muted,
    lineHeight: 1.4,
  },

  // Invoice Details
  invoiceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingBottom: 15,
    borderBottom: `1pt solid ${colors.border}`,
  },

  detailItem: {
    flexDirection: 'column',
  },

  detailLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.muted,
    marginBottom: 2,
  },

  detailValue: {
    fontSize: 10,
    color: colors.text,
  },

  // Line Items Table
  tableHeader: {
    flexDirection: 'row',
    borderBottom: `2pt solid ${colors.border}`,
    paddingBottom: 8,
    marginBottom: 8,
  },

  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottom: `1pt solid ${colors.secondary}`,
  },

  tableColDescription: {
    width: '50%',
    paddingRight: 10,
  },

  tableColQty: {
    width: '15%',
    textAlign: 'center',
  },

  tableColRate: {
    width: '17.5%',
    textAlign: 'right',
  },

  tableColAmount: {
    width: '17.5%',
    textAlign: 'right',
  },

  tableHeaderText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  tableCellText: {
    fontSize: 10,
    color: colors.text,
  },

  tableCellMono: {
    fontSize: 10,
    color: colors.text,
    fontFamily: 'Courier',
  },

  // Totals Section
  totalsSection: {
    marginTop: 20,
    marginLeft: '50%',
    width: '50%',
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },

  totalLabel: {
    fontSize: 10,
    color: colors.muted,
  },

  totalValue: {
    fontSize: 10,
    color: colors.text,
    fontFamily: 'Courier',
  },

  totalRowFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginTop: 8,
    borderTop: `1pt solid ${colors.border}`,
  },

  totalLabelFinal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
  },

  totalValueFinal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
    fontFamily: 'Courier',
  },

  // Notes Section
  notesSection: {
    marginTop: 30,
    paddingTop: 20,
    borderTop: `1pt solid ${colors.border}`,
  },

  notesTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },

  notesText: {
    fontSize: 9,
    color: colors.muted,
    lineHeight: 1.5,
    marginBottom: 15,
  },
})

export function InvoicePDF({ invoice }: InvoicePDFProps) {
  const formatCurrency = (amount: number) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: invoice.currency || 'USD',
      }).format(amount || 0)
    } catch {
      return `$${(amount || 0).toFixed(2)}`
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  // Filter out empty line items for PDF
  const validItems = invoice.items.filter(
    item => item.description?.trim() || item.quantity > 0 || item.price > 0
  )

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>#{invoice.invoiceNumber}</Text>
          </View>
          <View>
            <Text style={styles.totalAmount}>{formatCurrency(invoice.total)}</Text>
            <Text style={styles.dueDate}>Due: {formatDate(invoice.dueDate)}</Text>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.contactSection}>
          {/* From */}
          <View style={styles.contactBlock}>
            <Text style={styles.contactLabel}>From</Text>
            <Text style={styles.contactName}>
              {invoice.senderName || 'Your Business Name'}
            </Text>
            {invoice.senderEmail && (
              <Text style={styles.contactDetails}>{invoice.senderEmail}</Text>
            )}
            {invoice.senderAddress && (
              <Text style={styles.contactDetails}>{invoice.senderAddress}</Text>
            )}
            <Text style={styles.contactDetails}>
              {[invoice.senderCity, invoice.senderState, invoice.senderZip]
                .filter(Boolean)
                .join(', ')}
            </Text>
            {invoice.senderPhone && (
              <Text style={styles.contactDetails}>{invoice.senderPhone}</Text>
            )}
          </View>

          {/* To */}
          <View style={styles.contactBlock}>
            <Text style={styles.contactLabel}>Bill To</Text>
            <Text style={styles.contactName}>
              {invoice.clientName || 'Client Name'}
            </Text>
            {invoice.clientEmail && (
              <Text style={styles.contactDetails}>{invoice.clientEmail}</Text>
            )}
            {invoice.clientAddress && (
              <Text style={styles.contactDetails}>{invoice.clientAddress}</Text>
            )}
            <Text style={styles.contactDetails}>
              {[invoice.clientCity, invoice.clientState, invoice.clientZip]
                .filter(Boolean)
                .join(', ')}
            </Text>
          </View>
        </View>

        {/* Invoice Details */}
        <View style={styles.invoiceDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Invoice Date</Text>
            <Text style={styles.detailValue}>{formatDate(invoice.invoiceDate)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Due Date</Text>
            <Text style={styles.detailValue}>{formatDate(invoice.dueDate)}</Text>
          </View>
        </View>

        {/* Line Items */}
        <View>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <View style={styles.tableColDescription}>
              <Text style={styles.tableHeaderText}>Description</Text>
            </View>
            <View style={styles.tableColQty}>
              <Text style={styles.tableHeaderText}>Qty</Text>
            </View>
            <View style={styles.tableColRate}>
              <Text style={styles.tableHeaderText}>Rate</Text>
            </View>
            <View style={styles.tableColAmount}>
              <Text style={styles.tableHeaderText}>Amount</Text>
            </View>
          </View>

          {/* Table Rows */}
          {validItems.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableColDescription}>
                <Text style={styles.tableCellText}>
                  {item.description || 'Description'}
                </Text>
              </View>
              <View style={styles.tableColQty}>
                <Text style={styles.tableCellMono}>{item.quantity}</Text>
              </View>
              <View style={styles.tableColRate}>
                <Text style={styles.tableCellMono}>
                  {formatCurrency(Number(item.price))}
                </Text>
              </View>
              <View style={styles.tableColAmount}>
                <Text style={styles.tableCellMono}>
                  {formatCurrency(Number(item.quantity) * Number(item.price))}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>{formatCurrency(invoice.subtotal)}</Text>
          </View>

          {invoice.discountRate > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Discount ({invoice.discountRate}%):
              </Text>
              <Text style={styles.totalValue}>
                -{formatCurrency(invoice.discountAmount)}
              </Text>
            </View>
          )}

          {invoice.taxRate > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax ({invoice.taxRate}%):</Text>
              <Text style={styles.totalValue}>{formatCurrency(invoice.taxAmount)}</Text>
            </View>
          )}

          <View style={styles.totalRowFinal}>
            <Text style={styles.totalLabelFinal}>Total:</Text>
            <Text style={styles.totalValueFinal}>{formatCurrency(invoice.total)}</Text>
          </View>
        </View>

        {/* Notes & Terms */}
        {(invoice.notes || invoice.terms) && (
          <View style={styles.notesSection}>
            {invoice.notes && (
              <View>
                <Text style={styles.notesTitle}>Notes</Text>
                <Text style={styles.notesText}>{invoice.notes}</Text>
              </View>
            )}

            {invoice.terms && (
              <View>
                <Text style={styles.notesTitle}>Terms & Conditions</Text>
                <Text style={styles.notesText}>{invoice.terms}</Text>
              </View>
            )}
          </View>
        )}
      </Page>
    </Document>
  )
}