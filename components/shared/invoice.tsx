'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { Download, Printer, FileText, Building2, Phone, Mail, Globe } from 'lucide-react'
import jsPDF from 'jspdf'

interface InvoiceData {
  invoiceNumber: string
  invoiceDate: string
  orderId: string
  orderDate: string
  paymentStatus: 'PAID' | 'NOT PAID'
  paymentMethod: string
  company: {
    name: string
    address: string
    email: string
    phone: string
    gst: string
    website: string
  }
  customer: {
    name: string
    email: string
    address: any
  }
  items: Array<{
    name: string
    slug: string
    qty: number
    price: number
    image: string
    product: any
    lineTotal: number
  }>
  summary: {
    subtotal: number
    shipping: number
    tax: number
    total: number
  }
}

interface InvoiceProps {
  orderId: string
}

export default function Invoice({ orderId }: InvoiceProps) {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchInvoiceData()
  }, [orderId])

  const fetchInvoiceData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/invoice/${orderId}`)
      const data = await response.json()

      if (response.ok) {
        // Set default company info for Nitesh Handicraft
        const enhancedData = {
          ...data,
          company: {
            name: 'Nitesh Handicraft',
            address: data.company?.address || '123 Handicraft Street, Artisan District, Craft City, CC 12345',
            email: data.company?.email || 'info@niteshhandicraft.com',
            phone: data.company?.phone || '+1 (555) 123-4567',
            gst: data.company?.gst || 'GST: 12ABCDE1234F1Z5',
            website: data.company?.website || 'www.niteshhandicraft.com',
          }
        }
        setInvoiceData(enhancedData)
      } else {
        setError(data.error || 'Failed to load invoice')
      }
    } catch (error) {
      setError('Failed to load invoice')
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = () => {
    if (!invoiceData) return

    const doc = new jsPDF()
    
    // Header with Nitesh Handicraft branding
    doc.setFontSize(28)
    doc.setTextColor(255, 140, 0) // Orange color
    doc.text('Nitesh Handicraft', 105, 20, { align: 'center' })
    
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text('INVOICE', 105, 35, { align: 'center' })
    
    // Company details
    doc.setFontSize(12)
    doc.text(invoiceData.company.name, 20, 50)
    doc.setFontSize(10)
    doc.text(invoiceData.company.address, 20, 60)
    doc.text(`Email: ${invoiceData.company.email}`, 20, 70)
    doc.text(`Phone: ${invoiceData.company.phone}`, 20, 80)
    doc.text(invoiceData.company.gst, 20, 90)
    doc.text(`Website: ${invoiceData.company.website}`, 20, 100)
    
    // Invoice details
    doc.setFontSize(12)
    doc.text(`Invoice #: ${invoiceData.invoiceNumber}`, 120, 50)
    doc.text(`Date: ${formatDateTime(new Date(invoiceData.invoiceDate)).dateOnly}`, 120, 60)
    doc.text(`Order #: ${invoiceData.orderId}`, 120, 70)
    doc.text(`Payment: ${invoiceData.paymentStatus}`, 120, 80)
    
    // Customer details
    doc.setFontSize(12)
    doc.text('Bill To:', 20, 120)
    doc.setFontSize(10)
    doc.text(invoiceData.customer.name, 20, 130)
    doc.text(invoiceData.customer.email, 20, 140)
    
    if (invoiceData.customer.address) {
      doc.text(`${invoiceData.customer.address.fullName}`, 20, 150)
      doc.text(`${invoiceData.customer.address.streetAddress}`, 20, 160)
      doc.text(`${invoiceData.customer.address.city}, ${invoiceData.customer.address.postalCode}`, 20, 170)
      doc.text(invoiceData.customer.address.country, 20, 180)
    }
    
    // Items table
    let y = 200
    doc.setFontSize(12)
    doc.text('Items', 20, y)
    y += 10
    
    doc.setFontSize(10)
    doc.text('Item', 20, y)
    doc.text('Qty', 100, y)
    doc.text('Price', 130, y)
    doc.text('Total', 170, y)
    y += 10
    
    invoiceData.items.forEach((item) => {
      doc.text(item.name, 20, y)
      doc.text(item.qty.toString(), 100, y)
      doc.text(formatCurrency(item.price), 130, y)
      doc.text(formatCurrency(item.lineTotal), 170, y)
      y += 8
    })
    
    // Summary
    y += 10
    doc.setFontSize(12)
    doc.text('Subtotal:', 130, y)
    doc.text(formatCurrency(invoiceData.summary.subtotal), 170, y)
    y += 8
    
    doc.text('Shipping:', 130, y)
    doc.text(formatCurrency(invoiceData.summary.shipping), 170, y)
    y += 8
    
    doc.text('Tax:', 130, y)
    doc.text(formatCurrency(invoiceData.summary.tax), 170, y)
    y += 8
    
    doc.setFontSize(14)
    doc.text('Total:', 130, y)
    doc.text(formatCurrency(invoiceData.summary.total), 170, y)
    
    // Footer
    y += 20
    doc.setFontSize(10)
    doc.text('Thank you for choosing Nitesh Handicraft!', 105, y, { align: 'center' })
    y += 8
    doc.text(`For support: ${invoiceData.company.email}`, 105, y, { align: 'center' })
    
    doc.save(`nitesh-handicraft-invoice-${invoiceData.invoiceNumber}.pdf`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <FileText className="h-8 w-8 animate-pulse mx-auto mb-2" />
          <p>Loading invoice...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (!invoiceData) {
    return (
      <div className="text-center p-8">
        <p>No invoice data available</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto bg-white">
      {/* Print Actions */}
      <div className="flex justify-end gap-2 mb-6 print:hidden">
        <Button onClick={handlePrint} variant="outline">
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button onClick={handleDownloadPDF} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* Invoice Content */}
      <Card className="print:shadow-none">
        <CardContent className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-orange-600 mb-2">
                Nitesh Handicraft
              </h1>
              <div className="text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <p>{invoiceData.company.address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <p>{invoiceData.company.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <p>{invoiceData.company.phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <p>{invoiceData.company.website}</p>
                </div>
                <p className="text-sm">{invoiceData.company.gst}</p>
              </div>
            </div>
            
            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">INVOICE</h2>
              <div className="space-y-1 text-sm">
                <p><span className="font-semibold">Invoice #:</span> {invoiceData.invoiceNumber}</p>
                <p><span className="font-semibold">Date:</span> {formatDateTime(new Date(invoiceData.invoiceDate)).dateOnly}</p>
                <p><span className="font-semibold">Order #:</span> {invoiceData.orderId}</p>
                <p><span className="font-semibold">Payment Method:</span> {invoiceData.paymentMethod}</p>
                <div className="mt-2">
                  <Badge 
                    variant={invoiceData.paymentStatus === 'PAID' ? 'default' : 'destructive'}
                    className="text-sm"
                  >
                    {invoiceData.paymentStatus}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">Bill To:</h3>
              <div className="space-y-1">
                <p className="font-medium">{invoiceData.customer.name}</p>
                <p className="text-gray-600">{invoiceData.customer.email}</p>
                {invoiceData.customer.address && (
                  <>
                    <p className="text-gray-600">{invoiceData.customer.address.fullName}</p>
                    <p className="text-gray-600">{invoiceData.customer.address.streetAddress}</p>
                    <p className="text-gray-600">
                      {invoiceData.customer.address.city}, {invoiceData.customer.address.postalCode}
                    </p>
                    <p className="text-gray-600">{invoiceData.customer.address.country}</p>
                    <p className="text-gray-600">Phone: {invoiceData.customer.address.phone}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Order Items</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-orange-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Item</th>
                    <th className="px-4 py-3 text-center font-semibold">Qty</th>
                    <th className="px-4 py-3 text-right font-semibold">Price</th>
                    <th className="px-4 py-3 text-right font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.product?.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {item.product.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">{item.qty}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(item.price)}</td>
                      <td className="px-4 py-3 text-right font-medium">
                        {formatCurrency(item.lineTotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(invoiceData.summary.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{formatCurrency(invoiceData.summary.shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>{formatCurrency(invoiceData.summary.tax)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>{formatCurrency(invoiceData.summary.total)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t text-center">
            <p className="text-lg font-semibold mb-2 text-orange-600">Thank you for choosing Nitesh Handicraft!</p>
            <p className="text-gray-600">
              For support and inquiries: {invoiceData.company.email}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Handcrafted with love and tradition
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
