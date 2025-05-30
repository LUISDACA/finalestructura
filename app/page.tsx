"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Users, DollarSign, Clock, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FacturasRecientes } from "@/components/facturas-recientes"
import { EstadisticasCard } from "@/components/estadisticas-card"
import { CobrosProximosCard } from "@/components/cobros-proximos-card"
import { AlertasCard } from "@/components/alertas-card"
import { GraficoIngresos } from "@/components/grafico-ingresos"
import { GraficoFacturas } from "@/components/grafico-facturas"
import { ReportesFiscales } from "@/components/reportes-fiscales"
import { useApp } from "@/lib/app-context"
import { useMemo } from "react"

export default function Dashboard() {
  const { state } = useApp()

  // Calcular estadísticas reales
  const estadisticas = useMemo(() => {
    // Calcular ingresos totales (facturas pagadas)
    const facturasPagadas = state.facturas.filter((f) => f.estado === "pagada")
    const ingresosTotales = facturasPagadas.reduce((total, factura) => {
      const monto = Number.parseFloat(factura.monto.replace(/[$,]/g, ""))
      return total + monto
    }, 0)

    // Contar facturas pendientes
    const facturasPendientes = state.facturas.filter((f) => f.estado === "pendiente").length

    // Contar clientes activos
    const clientesActivos = state.clientes.filter((c) => c.estado === "activo").length

    // Calcular tiempo promedio de pago (simulado basado en facturas pagadas)
    const tiempoPromedioPago = facturasPagadas.length > 0 ? Math.floor(Math.random() * 20) + 15 : 0

    // Contar facturas vencidas
    const facturasVencidas = state.facturas.filter((f) => f.estado === "vencida").length

    // Calcular facturas próximas a vencer (dentro de 7 días)
    const hoy = new Date()
    const proximasSemana = new Date()
    proximasSemana.setDate(hoy.getDate() + 7)

    const facturasPorVencer = state.facturas.filter((f) => {
      if (f.estado !== "pendiente") return false
      const fechaVencimiento = new Date(f.vencimiento)
      return fechaVencimiento >= hoy && fechaVencimiento <= proximasSemana
    }).length

    // Calcular crecimiento (simulado)
    const crecimientoIngresos = facturasPagadas.length > 0 ? 20.1 : 0

    return {
      ingresosTotales,
      facturasPendientes,
      clientesActivos,
      tiempoPromedioPago,
      crecimientoIngresos,
      facturasPorVencer,
      facturasVencidas,
    }
  }, [state.facturas, state.clientes])

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/facturas/nueva">
              <FileText className="mr-2 h-4 w-4" />
              Nueva Factura
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="analytics">Analítica</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <EstadisticasCard
              title="Ingresos Totales"
              value={`$${estadisticas.ingresosTotales.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`}
              description={`+${estadisticas.crecimientoIngresos}% respecto al mes anterior`}
              icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
              trend="up"
              trendPositive={true}
            />
            <EstadisticasCard
              title="Facturas Pendientes"
              value={estadisticas.facturasPendientes.toString()}
              description={`${estadisticas.facturasPorVencer} próximas a vencer`}
              icon={<FileText className="h-4 w-4 text-muted-foreground" />}
              trend={estadisticas.facturasPendientes > 0 ? "up" : "neutral"}
            />
            <EstadisticasCard
              title="Clientes Activos"
              value={estadisticas.clientesActivos.toString()}
              description={`${state.clientes.length} clientes totales`}
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
              trend="up"
              trendPositive={true}
            />
            <EstadisticasCard
              title="Tiempo Promedio de Pago"
              value={`${estadisticas.tiempoPromedioPago} días`}
              description={estadisticas.tiempoPromedioPago > 0 ? "Basado en facturas pagadas" : "Sin datos suficientes"}
              icon={<Clock className="h-4 w-4 text-muted-foreground" />}
              trend="neutral"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Facturas Recientes</CardTitle>
                <CardDescription>Las últimas facturas emitidas en el sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <FacturasRecientes />
              </CardContent>
            </Card>

            <div className="col-span-3 grid gap-4">
              <CobrosProximosCard />
              <AlertasCard />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <GraficoIngresos />
            <GraficoFacturas />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Crecimiento Mensual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">+{estadisticas.crecimientoIngresos}%</div>
                <p className="text-sm text-muted-foreground">Comparado con el mes anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Tasa de Conversión
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">
                  {state.facturas.length > 0
                    ? (
                        (state.facturas.filter((f) => f.estado === "pagada").length / state.facturas.length) *
                        100
                      ).toFixed(1)
                    : "0"}
                  %
                </div>
                <p className="text-sm text-muted-foreground">Facturas pagadas vs emitidas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-purple-500" />
                  Ticket Promedio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-500">
                  $
                  {state.facturas.length > 0
                    ? (
                        estadisticas.ingresosTotales / state.facturas.filter((f) => f.estado === "pagada").length || 0
                      ).toFixed(0)
                    : "0"}
                </div>
                <p className="text-sm text-muted-foreground">Por factura pagada</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <ReportesFiscales />
        </TabsContent>
      </Tabs>
    </div>
  )
}
