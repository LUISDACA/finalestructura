"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useApp } from "@/lib/app-context"
import { useMemo } from "react"

export function CobrosProximosCard() {
  const { state } = useApp()

  // Calcular cobros próximos basados en datos reales
  const cobrosProximos = useMemo(() => {
    const hoy = new Date()
    const proximosMes = new Date()
    proximosMes.setDate(hoy.getDate() + 30)

    return state.cobros
      .filter((cobro) => {
        if (cobro.estado !== "pendiente") return false
        const fechaProgramada = new Date(cobro.fecha_programada)
        return fechaProgramada >= hoy && fechaProgramada <= proximosMes
      })
      .sort((a, b) => new Date(a.fecha_programada).getTime() - new Date(b.fecha_programada).getTime())
      .slice(0, 3)
      .map((cobro) => {
        const fechaProgramada = new Date(cobro.fecha_programada)
        const diasRestantes = Math.ceil((fechaProgramada.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))

        return {
          id: cobro.factura,
          cliente: cobro.cliente,
          fecha: cobro.fecha_programada,
          monto: `$${cobro.monto.toFixed(2)}`,
          diasRestantes: Math.max(0, diasRestantes),
        }
      })
  }, [state.cobros])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cobros Próximos</CardTitle>
      </CardHeader>
      <CardContent>
        {cobrosProximos.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <p>No hay cobros programados</p>
            <p className="text-sm">Programa cobros para verlos aquí</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cobrosProximos.map((cobro) => (
              <div key={cobro.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{cobro.cliente}</p>
                  <p className="text-sm text-muted-foreground">{cobro.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-sm font-medium">{cobro.monto}</p>
                    <p className="text-xs text-muted-foreground">{new Date(cobro.fecha).toLocaleDateString("es-ES")}</p>
                  </div>
                  <Badge
                    variant={
                      cobro.diasRestantes <= 3 ? "destructive" : cobro.diasRestantes <= 7 ? "outline" : "secondary"
                    }
                  >
                    {cobro.diasRestantes === 0 ? "Hoy" : `${cobro.diasRestantes} días`}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
