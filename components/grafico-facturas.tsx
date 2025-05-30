"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useApp } from "@/lib/app-context"

export function GraficoFacturas() {
  const { state } = useApp()
  const [animado, setAnimado] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimado(true), 500)
    return () => clearTimeout(timer)
  }, [])

  // Calcular datos reales de facturas
  const datosFacturas = [
    {
      estado: "Pagadas",
      cantidad: state.facturas.filter((f) => f.estado === "pagada").length,
      color: "bg-green-500",
    },
    {
      estado: "Pendientes",
      cantidad: state.facturas.filter((f) => f.estado === "pendiente").length,
      color: "bg-yellow-500",
    },
    {
      estado: "Vencidas",
      cantidad: state.facturas.filter((f) => f.estado === "vencida").length,
      color: "bg-red-500",
    },
  ]

  const total = datosFacturas.reduce((sum, dato) => sum + dato.cantidad, 0)

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estado de Facturas</CardTitle>
          <CardDescription>Distribución actual de facturas por estado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p>No hay facturas registradas</p>
              <p className="text-sm">Crea tu primera factura para ver las estadísticas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado de Facturas</CardTitle>
        <CardDescription>Distribución actual de facturas por estado</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center">
          {/* Gráfico de dona simulado */}
          <div className="relative w-48 h-48">
            <div className="absolute inset-0 rounded-full border-[40px] border-gray-200"></div>

            {/* Segmentos del gráfico */}
            {datosFacturas.map((dato, index) => {
              if (dato.cantidad === 0) return null

              const porcentaje = (dato.cantidad / total) * 100
              const rotacion = datosFacturas.slice(0, index).reduce((sum, d) => sum + (d.cantidad / total) * 360, 0)

              return (
                <div
                  key={dato.estado}
                  className={`absolute inset-0 rounded-full border-[40px] border-transparent ${dato.color.replace("bg-", "border-")}`}
                  style={{
                    clipPath: animado
                      ? `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(((porcentaje * 3.6 - 90) * Math.PI) / 180)}% ${50 + 50 * Math.sin(((porcentaje * 3.6 - 90) * Math.PI) / 180)}%, 50% 50%)`
                      : "polygon(50% 50%, 50% 0%, 50% 0%, 50% 50%)",
                    transform: `rotate(${rotacion}deg)`,
                    transition: "clip-path 1s ease-out",
                    transitionDelay: `${index * 200}ms`,
                  }}
                />
              )
            })}

            {/* Centro del gráfico */}
            <div className="absolute inset-[40px] rounded-full bg-background flex flex-col items-center justify-center">
              <div className="text-2xl font-bold">{total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>
        </div>

        {/* Leyenda */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {datosFacturas.map((dato) => (
            <div key={dato.estado} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${dato.color}`}></div>
              <span className="text-sm flex-1">{dato.estado}</span>
              <span className="text-sm font-medium">{dato.cantidad}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
