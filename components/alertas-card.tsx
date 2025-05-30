"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CreditCard, AlertTriangle } from "lucide-react"
import { useApp } from "@/lib/app-context"
import { useMemo } from "react"

export function AlertasCard() {
  const { state } = useApp()

  // Generar alertas basadas en datos reales
  const alertas = useMemo(() => {
    const alertasGeneradas = []
    const hoy = new Date()

    // Alertas de facturas vencidas
    const facturasVencidas = state.facturas.filter((f) => {
      if (f.estado !== "pendiente") return false
      const fechaVencimiento = new Date(f.vencimiento)
      return fechaVencimiento < hoy
    })

    facturasVencidas.forEach((factura) => {
      const diasVencida = Math.floor((hoy.getTime() - new Date(factura.vencimiento).getTime()) / (1000 * 60 * 60 * 24))
      alertasGeneradas.push({
        id: `vencida-${factura.id}`,
        tipo: "factura",
        mensaje: `Factura ${factura.id} vencida hace ${diasVencida} día${diasVencida > 1 ? "s" : ""}`,
        fecha: new Date().toLocaleDateString("es-ES"),
        prioridad: "alta",
      })
    })

    // Alertas de cobros programados para hoy
    const cobrosHoy = state.cobros.filter((c) => {
      if (c.estado !== "pendiente") return false
      const fechaProgramada = new Date(c.fecha_programada)
      return fechaProgramada.toDateString() === hoy.toDateString()
    })

    cobrosHoy.forEach((cobro) => {
      alertasGeneradas.push({
        id: `cobro-${cobro.id}`,
        tipo: "cobro",
        mensaje: `Cobro programado para hoy: $${cobro.monto.toFixed(2)} - ${cobro.cliente}`,
        fecha: new Date().toLocaleDateString("es-ES"),
        prioridad: "media",
      })
    })

    // Alertas de facturas próximas a vencer (próximos 3 días)
    const proximosTresDias = new Date()
    proximosTresDias.setDate(hoy.getDate() + 3)

    const facturasPorVencer = state.facturas.filter((f) => {
      if (f.estado !== "pendiente") return false
      const fechaVencimiento = new Date(f.vencimiento)
      return fechaVencimiento > hoy && fechaVencimiento <= proximosTresDias
    })

    if (facturasPorVencer.length > 0) {
      alertasGeneradas.push({
        id: "por-vencer",
        tipo: "sistema",
        mensaje: `${facturasPorVencer.length} factura${facturasPorVencer.length > 1 ? "s" : ""} próxima${facturasPorVencer.length > 1 ? "s" : ""} a vencer`,
        fecha: new Date().toLocaleDateString("es-ES"),
        prioridad: "baja",
      })
    }

    // Si no hay alertas, mostrar mensaje de sistema
    if (alertasGeneradas.length === 0) {
      alertasGeneradas.push({
        id: "sin-alertas",
        tipo: "sistema",
        mensaje: "No hay alertas pendientes",
        fecha: new Date().toLocaleDateString("es-ES"),
        prioridad: "baja",
      })
    }

    return alertasGeneradas.slice(0, 3) // Mostrar máximo 3 alertas
  }, [state.facturas, state.cobros])

  const getIcono = (tipo: string) => {
    switch (tipo) {
      case "factura":
        return <FileText className="h-4 w-4" />
      case "cobro":
        return <CreditCard className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alertas.map((alerta) => (
            <div key={alerta.id} className="flex items-start gap-4">
              <div
                className={`rounded-full p-2 
                ${
                  alerta.prioridad === "alta"
                    ? "bg-destructive/10 text-destructive"
                    : alerta.prioridad === "media"
                      ? "bg-amber-500/10 text-amber-500"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {getIcono(alerta.tipo)}
              </div>
              <div className="space-y-1 flex-1">
                <p className="text-sm font-medium leading-none">{alerta.mensaje}</p>
                <p className="text-xs text-muted-foreground">{alerta.fecha}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
