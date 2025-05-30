"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

// Datos simulados para el gráfico de ingresos
const datosIngresos = [
  { mes: "Ene", ingresos: 12000, gastos: 8000 },
  { mes: "Feb", ingresos: 15000, gastos: 9000 },
  { mes: "Mar", ingresos: 18000, gastos: 10000 },
  { mes: "Abr", ingresos: 22000, gastos: 12000 },
  { mes: "May", ingresos: 25000, gastos: 13000 },
  { mes: "Jun", ingresos: 28000, gastos: 14000 },
]

export function GraficoIngresos() {
  const [animado, setAnimado] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimado(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const maxValor = Math.max(...datosIngresos.map((d) => Math.max(d.ingresos, d.gastos)))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análisis de Ingresos vs Gastos</CardTitle>
        <CardDescription>Comparativa mensual de ingresos y gastos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <div className="flex h-full items-end justify-between gap-2 px-4">
            {datosIngresos.map((dato, index) => (
              <div key={dato.mes} className="flex flex-col items-center gap-2 flex-1">
                <div className="flex flex-col items-center gap-1 w-full">
                  {/* Barra de Ingresos */}
                  <div className="relative w-full max-w-[30px]">
                    <div
                      className="bg-blue-500 rounded-t transition-all duration-1000 ease-out"
                      style={{
                        height: animado ? `${(dato.ingresos / maxValor) * 200}px` : "0px",
                        transitionDelay: `${index * 100}ms`,
                      }}
                    />
                    <div className="text-xs text-center mt-1 text-blue-600 font-medium">
                      ${(dato.ingresos / 1000).toFixed(0)}k
                    </div>
                  </div>

                  {/* Barra de Gastos */}
                  <div className="relative w-full max-w-[30px]">
                    <div
                      className="bg-red-400 rounded-t transition-all duration-1000 ease-out"
                      style={{
                        height: animado ? `${(dato.gastos / maxValor) * 200}px` : "0px",
                        transitionDelay: `${index * 100 + 50}ms`,
                      }}
                    />
                    <div className="text-xs text-center mt-1 text-red-500 font-medium">
                      ${(dato.gastos / 1000).toFixed(0)}k
                    </div>
                  </div>
                </div>

                <div className="text-sm font-medium text-muted-foreground">{dato.mes}</div>
              </div>
            ))}
          </div>

          {/* Leyenda */}
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-sm">Ingresos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded"></div>
              <span className="text-sm">Gastos</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
