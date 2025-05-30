"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, Plus, Trash2, Download } from "lucide-react"
import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "@/components/ui/use-toast"
import { generarFacturaPDF } from "@/lib/pdf-generator"
import { useApp } from "@/lib/app-context"

export default function NuevaFacturaPage() {
  const { state, agregarFactura } = useApp()
  const [fecha, setFecha] = useState<Date | undefined>(new Date())
  const [clienteSeleccionado, setClienteSeleccionado] = useState("")
  const [numeroFactura, setNumeroFactura] = useState(() => {
    // Generar número de factura automáticamente
    const numeroActual =
      state.facturas.length > 0 ? Math.max(...state.facturas.map((f) => Number.parseInt(f.id.split("-")[2]))) : 0
    return `FACT-2024-${String(numeroActual + 1).padStart(4, "0")}`
  })
  const [notas, setNotas] = useState("")
  const [items, setItems] = useState([{ id: 1, producto: "", cantidad: 1, precio: 0, importe: 0 }])
  const [generandoPDF, setGenerandoPDF] = useState(false)

  // Obtener clientes activos del estado global
  const clientesActivos = state.clientes.filter((cliente) => cliente.estado === "activo")

  // Obtener productos activos del estado global
  const productosActivos = state.productos.filter((producto) => producto.estado === "activo")

  const agregarItem = () => {
    const nuevoId = items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1
    setItems([...items, { id: nuevoId, producto: "", cantidad: 1, precio: 0, importe: 0 }])
  }

  const eliminarItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const actualizarItem = (id: number, campo: string, valor: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const itemActualizado = { ...item, [campo]: valor }

          // Si se actualiza el producto, actualizar el precio
          if (campo === "producto") {
            const productoSeleccionado = productosActivos.find((p) => p.id === valor)
            if (productoSeleccionado) {
              itemActualizado.precio = productoSeleccionado.precio
              itemActualizado.importe = productoSeleccionado.precio * itemActualizado.cantidad
            }
          }

          // Si se actualiza la cantidad, recalcular el importe
          if (campo === "cantidad") {
            itemActualizado.importe = itemActualizado.precio * valor
          }

          return itemActualizado
        }
        return item
      }),
    )
  }

  // Calcular subtotal
  const subtotal = items.reduce((sum, item) => sum + item.importe, 0)

  // Calcular impuestos (ejemplo: 16% de IVA)
  const iva = subtotal * 0.16

  // Calcular total
  const total = subtotal + iva

  const handleGenerarFactura = async () => {
    // Validaciones
    if (!clienteSeleccionado) {
      toast({
        title: "Error",
        description: "Debe seleccionar un cliente",
        variant: "destructive",
      })
      return
    }

    if (items.length === 0 || items.every((item) => !item.producto)) {
      toast({
        title: "Error",
        description: "Debe agregar al menos un producto o servicio",
        variant: "destructive",
      })
      return
    }

    if (!fecha) {
      toast({
        title: "Error",
        description: "Debe seleccionar una fecha",
        variant: "destructive",
      })
      return
    }

    setGenerandoPDF(true)

    try {
      // Obtener datos del cliente seleccionado
      const cliente = clientesActivos.find((c) => c.id === clienteSeleccionado)
      if (!cliente) {
        throw new Error("Cliente no encontrado")
      }

      // Preparar items de la factura con nombres de productos
      const itemsFactura = items
        .filter((item) => item.producto && item.cantidad > 0)
        .map((item) => {
          const producto = productosActivos.find((p) => p.id === item.producto)
          return {
            descripcion: producto?.nombre || "Producto no encontrado",
            cantidad: item.cantidad,
            precio: item.precio,
            importe: item.importe,
          }
        })

      if (itemsFactura.length === 0) {
        throw new Error("No hay items válidos en la factura")
      }

      // Calcular fecha de vencimiento (30 días después)
      const fechaVencimiento = new Date(fecha)
      fechaVencimiento.setDate(fechaVencimiento.getDate() + 30)

      // Preparar datos de la factura para guardar
      const nuevaFactura = {
        cliente: cliente.nombre,
        fecha: format(fecha, "yyyy-MM-dd"),
        vencimiento: format(fechaVencimiento, "yyyy-MM-dd"),
        monto: `$${total.toFixed(2)}`,
        estado: "pendiente" as const,
        items: itemsFactura,
      }

      // Guardar la factura en el estado global PRIMERO
      agregarFactura(nuevaFactura)

      // Preparar datos para el PDF
      const datosFactura = {
        numero: numeroFactura,
        fecha: fecha,
        cliente: {
          nombre: cliente.nombre,
          email: cliente.email,
          telefono: cliente.telefono,
          direccion: cliente.ubicacion,
        },
        items: itemsFactura,
        subtotal,
        iva,
        total,
        notas,
        empresa: {
          nombre: "Mideros S.A.",
          rfc: "FPR123456789",
          direccion: "Av. Tecnológico 123, Pasto",
          telefono: "+57 318 431 6629",
          email: "contacto@facturapro.com",
        },
      }

      // Generar y descargar el PDF
      await generarFacturaPDF(datosFactura)

      toast({
        title: "Factura generada",
        description: `La factura ${numeroFactura} se ha generado y descargado correctamente`,
      })

      // Limpiar formulario después de generar la factura
      setClienteSeleccionado("")
      setNotas("")
      setItems([{ id: 1, producto: "", cantidad: 1, precio: 0, importe: 0 }])

      // Incrementar número de factura para la próxima
      const numeroActual = Number.parseInt(numeroFactura.split("-")[2])
      const nuevoNumero = `FACT-2024-${String(numeroActual + 1).padStart(4, "0")}`
      setNumeroFactura(nuevoNumero)
    } catch (error) {
      console.error("Error al generar la factura:", error)
      toast({
        title: "Error",
        description: `Hubo un error al generar la factura: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setGenerandoPDF(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Nueva Factura</h2>
        <p className="text-muted-foreground">Crea una nueva factura para tus clientes</p>
      </div>

      <Separator />

      <Tabs defaultValue="factura" className="space-y-4">
        <TabsList>
          <TabsTrigger value="factura">Factura</TabsTrigger>
          <TabsTrigger value="configuracion">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="factura">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Detalles de la Factura</CardTitle>
                <CardDescription>Completa la información de la factura</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numero">Número de Factura</Label>
                    <Input
                      id="numero"
                      value={numeroFactura}
                      onChange={(e) => setNumeroFactura(e.target.value)}
                      placeholder="FACT-2024-0001"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fecha">Fecha de Emisión</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !fecha && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {fecha ? format(fecha, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={fecha} onSelect={setFecha} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente</Label>
                  <Select value={clienteSeleccionado} onValueChange={setClienteSeleccionado}>
                    <SelectTrigger id="cliente">
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientesActivos.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id}>
                          {cliente.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notas">Notas</Label>
                  <Textarea
                    id="notas"
                    placeholder="Notas o condiciones especiales para esta factura"
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Productos y Servicios</h3>
                    <Button variant="outline" size="sm" onClick={agregarItem}>
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar Item
                    </Button>
                  </div>

                  {items.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-5">
                        <Select
                          value={item.producto}
                          onValueChange={(value) => actualizarItem(item.id, "producto", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar producto" />
                          </SelectTrigger>
                          <SelectContent>
                            {productosActivos.map((producto) => (
                              <SelectItem key={producto.id} value={producto.id}>
                                {producto.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          min="1"
                          value={item.cantidad}
                          onChange={(e) => actualizarItem(item.id, "cantidad", Number.parseInt(e.target.value) || 1)}
                          placeholder="Cantidad"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="text"
                          value={item.precio > 0 ? `$${item.precio.toFixed(2)}` : ""}
                          readOnly
                          placeholder="Precio"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="text"
                          value={item.importe > 0 ? `$${item.importe.toFixed(2)}` : ""}
                          readOnly
                          placeholder="Importe"
                        />
                      </div>
                      <div className="col-span-1 flex justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => eliminarItem(item.id)}
                          disabled={items.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Eliminar item</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
                <CardDescription>Resumen de la factura</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IVA (16%):</span>
                    <span>${iva.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button className="w-full" onClick={handleGenerarFactura} disabled={generandoPDF}>
                  {generandoPDF ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                      Generando PDF...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Generar Factura PDF
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="configuracion">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de la Factura</CardTitle>
              <CardDescription>Personaliza la configuración de tus facturas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="serie">Serie de Facturación</Label>
                <Input id="serie" placeholder="FACT" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="moneda">Moneda</Label>
                <Select defaultValue="MXN">
                  <SelectTrigger id="moneda">
                    <SelectValue placeholder="Seleccionar moneda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MXN">Peso Mexicano (MXN)</SelectItem>
                    <SelectItem value="USD">Dólar Estadounidense (USD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    <SelectItem value="COP">Peso Colombiano (COP)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="impuesto">Impuesto Predeterminado</Label>
                <Select defaultValue="16">
                  <SelectTrigger id="impuesto">
                    <SelectValue placeholder="Seleccionar impuesto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16">IVA 16%</SelectItem>
                    <SelectItem value="8">IVA 8% (Frontera)</SelectItem>
                    <SelectItem value="0">Exento de IVA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
