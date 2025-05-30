'use client'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface DatosFactura {
  numero: string
  fecha: Date
  cliente: {
    nombre: string
    email: string
    telefono: string
    direccion: string
  }
  items: Array<{
    descripcion: string
    cantidad: number
    precio: number
    importe: number
  }>
  subtotal: number
  iva: number
  total: number
  notas: string
  empresa: {
    nombre: string
    rfc: string
    direccion: string
    telefono: string
    email: string
  }
}

export async function generarFacturaPDF(datos: DatosFactura): Promise<void> {
  try {
    if (!datos || !datos.numero || !datos.cliente || !datos.items || datos.items.length === 0) {
      throw new Error('Datos de factura incompletos')
    }

    const doc = new jsPDF()
    const colorPrimario = [59, 130, 246]
    const colorSecundario = [107, 114, 128]
    const colorTexto = [17, 24, 39]

    doc.setFont('helvetica')
    doc.setFontSize(20)
    doc.setTextColor(...colorPrimario)
    doc.text(datos.empresa.nombre, 20, 25)

    doc.setFontSize(10)
    doc.setTextColor(...colorSecundario)
    doc.text(`RFC: ${datos.empresa.rfc}`, 20, 35)
    doc.text(datos.empresa.direccion, 20, 42)
    doc.text(`Tel: ${datos.empresa.telefono}`, 20, 49)
    doc.text(`Email: ${datos.empresa.email}`, 20, 56)

    doc.setFontSize(24)
    doc.setTextColor(...colorPrimario)
    doc.text('FACTURA', 150, 25)

    doc.setFontSize(12)
    doc.setTextColor(...colorTexto)
    doc.text(`No. ${datos.numero}`, 150, 35)
    doc.text(`Fecha: ${format(datos.fecha, 'dd/MM/yyyy', { locale: es })}`, 150, 45)

    doc.setDrawColor(...colorPrimario)
    doc.setLineWidth(0.5)
    doc.line(20, 65, 190, 65)

    doc.setFontSize(14)
    doc.setTextColor(...colorPrimario)
    doc.text('FACTURAR A:', 20, 80)

    doc.setFontSize(11)
    doc.setTextColor(...colorTexto)
    doc.text(datos.cliente.nombre, 20, 90)
    doc.text(datos.cliente.direccion, 20, 97)
    doc.text(`Tel: ${datos.cliente.telefono}`, 20, 104)
    doc.text(`Email: ${datos.cliente.email}`, 20, 111)

    const columnasTabla = [
      { header: 'Descripción', dataKey: 'descripcion' },
      { header: 'Cantidad', dataKey: 'cantidad' },
      { header: 'Precio Unit.', dataKey: 'precio' },
      { header: 'Importe', dataKey: 'importe' },
    ]

    const filasTabla = datos.items.map((item) => ({
      descripcion: item.descripcion,
      cantidad: item.cantidad.toString(),
      precio: `$${item.precio.toFixed(2)}`,
      importe: `$${item.importe.toFixed(2)}`,
    }))

    // ✅ USO CORRECTO
    autoTable(doc, {
      startY: 125,
      head: [columnasTabla.map((col) => col.header)],
      body: filasTabla.map((fila) =>
        columnasTabla.map((col) => fila[col.dataKey as keyof typeof fila])
      ),
      theme: 'grid',
      headStyles: {
        fillColor: colorPrimario,
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 10,
        textColor: colorTexto,
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 35, halign: 'right' },
      },
      margin: { left: 20, right: 20 },
    })

    const finalY = (doc as any).lastAutoTable?.finalY || 125
    const inicioTotales = finalY + 15
    const xTotales = 130

    doc.setFontSize(11)
    doc.setTextColor(...colorTexto)
    doc.text('Subtotal:', xTotales, inicioTotales)
    doc.text(`$${datos.subtotal.toFixed(2)}`, 175, inicioTotales, { align: 'right' })

    doc.text('IVA (16%):', xTotales, inicioTotales + 8)
    doc.text(`$${datos.iva.toFixed(2)}`, 175, inicioTotales + 8, { align: 'right' })

    doc.setDrawColor(...colorSecundario)
    doc.setLineWidth(0.3)
    doc.line(xTotales, inicioTotales + 12, 175, inicioTotales + 12)

    doc.setFontSize(14)
    doc.setTextColor(...colorPrimario)
    doc.setFont('helvetica', 'bold')
    doc.text('TOTAL:', xTotales, inicioTotales + 20)
    doc.text(`$${datos.total.toFixed(2)}`, 175, inicioTotales + 20, { align: 'right' })

    if (datos.notas && datos.notas.trim()) {
      const inicioNotas = inicioTotales + 35
      doc.setFontSize(12)
      doc.setTextColor(...colorPrimario)
      doc.setFont('helvetica', 'bold')
      doc.text('NOTAS:', 20, inicioNotas)

      doc.setFontSize(10)
      doc.setTextColor(...colorTexto)
      doc.setFont('helvetica', 'normal')

      const lineasNotas = doc.splitTextToSize(datos.notas, 170)
      doc.text(lineasNotas, 20, inicioNotas + 8)
    }

    const alturaPagina = doc.internal.pageSize.height
    doc.setFontSize(8)
    doc.setTextColor(...colorSecundario)
    doc.text('Gracias por su preferencia', 105, alturaPagina - 20, { align: 'center' })
    doc.text(`Generado el ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: es })}`, 105, alturaPagina - 15, {
      align: 'center',
    })

    const nombreArchivo = `Factura_${datos.numero.replace(/[^a-zA-Z0-9]/g, '_')}_${format(datos.fecha, 'yyyyMMdd')}.pdf`

    doc.save(nombreArchivo)
    console.log(`PDF generado y guardado como: ${nombreArchivo}`)
  } catch (error: any) {
    console.error('Error en generarFacturaPDF:', error)
    throw new Error(`Error al generar PDF: ${error.message}`)
  }
}
