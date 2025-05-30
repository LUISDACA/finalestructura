"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, FileText, Calculator, TrendingUp } from "lucide-react"
import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { useApp } from "@/lib/app-context"
import { useMemo } from "react"

export function ReportesFiscales() {
  const { state } = useApp()
  const [fechaInicio, setFechaInicio] = useState<Date>()
  const [fechaFin, setFechaFin] = useState<Date>()
  const [tipoReporte, setTipoReporte] = useState("")
  const [generando, setGenerando] = useState(false)

  // Calcular datos fiscales reales
  const datosFiscales = useMemo(() => {
    const facturasPagadas = state.facturas.filter((f) => f.estado === "pagada")

    // Calcular ingresos gravados
    const ingresosGravados = facturasPagadas.reduce((total, factura) => {
      const monto = Number.parseFloat(factura.monto.replace(/[$,]/g, ""))
      return total + monto
    }, 0)

    // Calcular IVA por cobrar (16% de los ingresos)
    const ivaPorCobrar = ingresosGravados * 0.16

    // Calcular retenciones ISR (10% de los ingresos)
    const retencionesISR = ingresosGravados * 0.1

    return {
      ingresosGravados,
      ivaPorCobrar,
      retencionesISR,
      facturasEmitidas: state.facturas.length,
    }
  }, [state.facturas])

  const generarReporte = async () => {
    if (!fechaInicio || !fechaFin || !tipoReporte) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      })
      return
    }

    setGenerando(true)

    // Simular generación de reporte
    setTimeout(() => {
      toast({
        title: "Reporte generado",
        description: `El reporte ${tipoReporte} ha sido generado y descargado`,
      })
      setGenerando(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generador de Reportes Fiscales</CardTitle>
          <CardDescription>Genera reportes para declaraciones fiscales y análisis contables</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha de Inicio</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !fechaInicio && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fechaInicio ? format(fechaInicio, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={fechaInicio} onSelect={setFechaInicio} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha de Fin</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !fechaFin && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fechaFin ? format(fechaFin, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={fechaFin} onSelect={setFechaFin} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Reporte</label>
              <Select value={tipoReporte} onValueChange={setTipoReporte}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="iva">Reporte de IVA</SelectItem>
                  <SelectItem value="ingresos">Reporte de Ingresos</SelectItem>
                  <SelectItem value="retenciones">Reporte de Retenciones</SelectItem>
                  <SelectItem value="completo">Reporte Completo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={generarReporte} disabled={generando} className="w-full">
            {generando ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Generando reporte...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Generar Reporte
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IVA por Cobrar</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${datosFiscales.ivaPorCobrar.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">16% de ingresos gravados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retenciones ISR</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${datosFiscales.retencionesISR.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">10% de ingresos gravados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Gravados</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${datosFiscales.ingresosGravados.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total de facturas pagadas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumen Fiscal del Período</CardTitle>
          <CardDescription>Información fiscal consolidada basada en datos reales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold">{datosFiscales.facturasEmitidas}</div>
                <div className="text-sm text-muted-foreground">Facturas Emitidas</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">${datosFiscales.ingresosGravados.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Ingresos Totales</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">${datosFiscales.ivaPorCobrar.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">IVA Trasladado</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">${datosFiscales.retencionesISR.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Retenciones</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
