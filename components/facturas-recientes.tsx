"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download } from "lucide-react"
import { useApp } from "@/lib/app-context"
import { generarFacturaPDF } from "@/lib/pdf-generator"
import { toast } from "@/components/ui/use-toast"

export function FacturasRecientes() {
  const { state } = useApp()

  // Obtener las 5 facturas más recientes
  const facturasRecientes = state.facturas
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 5)

  const handleDescargarPDF = async (factura: any) => {
    try {
      // Buscar el cliente en el estado global
      const clienteEncontrado = state.clientes.find((c) => c.nombre === factura.cliente)

      if (!clienteEncontrado) {
        toast({
          title: "Error",
          description: "Cliente no encontrado",
          variant: "destructive",
        })
        return
      }

      // Calcular totales
      const subtotal = factura.items.reduce((sum: number, item: any) => sum + item.importe, 0)
      const iva = subtotal * 0.16
      const total = subtotal + iva

      // Preparar datos para el PDF
      const datosFactura = {
        numero: factura.id,
        fecha: new Date(factura.fecha),
        cliente: {
          nombre: clienteEncontrado.nombre,
          email: clienteEncontrado.email,
          telefono: clienteEncontrado.telefono,
          direccion: clienteEncontrado.ubicacion,
        },
        items: factura.items,
        subtotal,
        iva,
        total,
        notas: "Gracias por su preferencia. Pago a 30 días.",
        empresa: {
          nombre: "FacturaPro S.A. de C.V.",
          rfc: "FPR123456789",
          direccion: "Av. Tecnológico 123, Ciudad de México",
          telefono: "+52 55 1234 5678",
          email: "contacto@facturapro.com",
        },
      }

      // Generar y descargar el PDF
      await generarFacturaPDF(datosFactura)

      toast({
        title: "PDF descargado",
        description: `La factura ${factura.id} se ha descargado correctamente`,
      })
    } catch (error) {
      console.error("Error al descargar PDF:", error)
      toast({
        title: "Error",
        description: "Hubo un error al generar el PDF",
        variant: "destructive",
      })
    }
  }

  if (facturasRecientes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No hay facturas registradas</p>
        <p className="text-sm">Crea tu primera factura para verla aquí</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Factura</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Monto</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {facturasRecientes.map((factura) => (
          <TableRow key={factura.id}>
            <TableCell className="font-medium">{factura.id}</TableCell>
            <TableCell>{factura.cliente}</TableCell>
            <TableCell>{new Date(factura.fecha).toLocaleDateString("es-ES")}</TableCell>
            <TableCell>{factura.monto}</TableCell>
            <TableCell>
              <Badge
                variant={
                  factura.estado === "pagada" ? "success" : factura.estado === "pendiente" ? "outline" : "destructive"
                }
              >
                {factura.estado.toUpperCase()}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">Ver factura</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDescargarPDF(factura)}>
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Descargar factura</span>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
