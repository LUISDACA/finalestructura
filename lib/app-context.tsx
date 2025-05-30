"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Tipos de datos
interface Producto {
  id: string
  nombre: string
  descripcion: string
  precio: number
  tipo: "servicio" | "producto"
  estado: "activo" | "inactivo"
}

interface Cliente {
  id: string
  nombre: string
  contacto: string
  email: string
  telefono: string
  ubicacion: string
  estado: "activo" | "inactivo"
  facturas: number
}

interface Factura {
  id: string
  cliente: string
  fecha: string
  vencimiento: string
  monto: string
  estado: "pendiente" | "pagada" | "vencida"
  items: Array<{
    descripcion: string
    cantidad: number
    precio: number
    importe: number
  }>
}

interface Cobro {
  id: string
  factura: string
  cliente: string
  monto: number
  fecha_programada: string
  fecha_procesamiento: string | null
  estado: "pendiente" | "procesado"
  metodo: string
  referencia: string
}

interface AppState {
  productos: Producto[]
  clientes: Cliente[]
  facturas: Factura[]
  cobros: Cobro[]
}

interface AppContextType {
  state: AppState
  // Productos
  agregarProducto: (producto: Omit<Producto, "id">) => void
  actualizarProducto: (id: string, producto: Partial<Producto>) => void
  eliminarProducto: (id: string) => void
  cambiarEstadoProducto: (id: string) => void
  // Clientes
  agregarCliente: (cliente: Omit<Cliente, "id" | "facturas">) => void
  actualizarCliente: (id: string, cliente: Partial<Cliente>) => void
  eliminarCliente: (id: string) => void
  cambiarEstadoCliente: (id: string) => void
  // Facturas
  agregarFactura: (factura: Omit<Factura, "id">) => void
  actualizarFactura: (id: string, factura: Partial<Factura>) => void
  marcarFacturaComoPagada: (id: string) => void
  // Cobros
  agregarCobro: (cobro: Omit<Cobro, "id">) => void
  marcarCobroComoProcesado: (id: string) => void
}

// Datos iniciales
const datosIniciales: AppState = {
  productos: [
    {
      id: "1",
      nombre: "Desarrollo web",
      descripcion: "Desarrollo de sitios web personalizados",
      precio: 5000,
      tipo: "servicio",
      estado: "activo",
    },
    {
      id: "2",
      nombre: "Diseño gráfico",
      descripcion: "Diseño de logotipos e identidad corporativa",
      precio: 3000,
      tipo: "servicio",
      estado: "activo",
    },
    {
      id: "3",
      nombre: "Consultoría",
      descripcion: "Asesoría en estrategia digital",
      precio: 8000,
      tipo: "servicio",
      estado: "activo",
    },
    {
      id: "4",
      nombre: "Mantenimiento",
      descripcion: "Mantenimiento mensual de sitios web",
      precio: 2500,
      tipo: "servicio",
      estado: "activo",
    },
    {
      id: "5",
      nombre: "Hosting",
      descripcion: "Alojamiento web anual",
      precio: 1200,
      tipo: "producto",
      estado: "activo",
    },
    {
      id: "6",
      nombre: "Dominio",
      descripcion: "Registro de dominio anual",
      precio: 350,
      tipo: "producto",
      estado: "inactivo",
    },
    {
      id: "7",
      nombre: "Licencia Software",
      descripcion: "Licencia anual de software",
      precio: 4500,
      tipo: "producto",
      estado: "activo",
    },
  ],
  clientes: [
    {
      id: "1",
      nombre: "Empresa ABC",
      contacto: "Juan Pérez",
      email: "contacto@abc.com",
      telefono: "+52 55 1234 5678",
      ubicacion: "Ciudad de México",
      estado: "activo",
      facturas: 12,
    },
    {
      id: "2",
      nombre: "Consultora XYZ",
      contacto: "María López",
      email: "info@xyz.com",
      telefono: "+34 91 234 5678",
      ubicacion: "Madrid, España",
      estado: "activo",
      facturas: 8,
    },
    {
      id: "3",
      nombre: "Freelancer 123",
      contacto: "Carlos Rodríguez",
      email: "free@123.com",
      telefono: "+57 1 234 5678",
      ubicacion: "Bogotá, Colombia",
      estado: "inactivo",
      facturas: 3,
    },
    {
      id: "4",
      nombre: "Empresa DEF",
      contacto: "Ana Martínez",
      email: "info@def.com",
      telefono: "+54 11 2345 6789",
      ubicacion: "Buenos Aires, Argentina",
      estado: "activo",
      facturas: 5,
    },
    {
      id: "5",
      nombre: "Startup Tech",
      contacto: "Roberto Gómez",
      email: "contact@startup.tech",
      telefono: "+52 33 2345 6789",
      ubicacion: "Guadalajara, México",
      estado: "activo",
      facturas: 2,
    },
  ],
  facturas: [
    {
      id: "FACT-2023-0001",
      cliente: "Empresa ABC",
      fecha: "2023-05-15",
      vencimiento: "2023-06-15",
      monto: "$5,800.00",
      estado: "pagada",
      items: [
        { descripcion: "Desarrollo web", cantidad: 1, precio: 5000, importe: 5000 },
        { descripcion: "Hosting anual", cantidad: 1, precio: 800, importe: 800 },
      ],
    },
    {
      id: "FACT-2023-0002",
      cliente: "Consultora XYZ",
      fecha: "2023-05-18",
      vencimiento: "2023-06-18",
      monto: "$3,200.00",
      estado: "pendiente",
      items: [
        { descripcion: "Diseño gráfico", cantidad: 1, precio: 3000, importe: 3000 },
        { descripcion: "Revisiones", cantidad: 2, precio: 100, importe: 200 },
      ],
    },
    {
      id: "FACT-2023-0003",
      cliente: "Freelancer 123",
      fecha: "2023-05-20",
      vencimiento: "2023-05-20",
      monto: "$1,500.00",
      estado: "vencida",
      items: [{ descripcion: "Consultoría", cantidad: 2, precio: 750, importe: 1500 }],
    },
    {
      id: "FACT-2023-0004",
      cliente: "Empresa ABC",
      fecha: "2023-05-22",
      vencimiento: "2023-06-22",
      monto: "$4,200.00",
      estado: "pendiente",
      items: [{ descripcion: "Mantenimiento", cantidad: 3, precio: 1400, importe: 4200 }],
    },
    {
      id: "FACT-2023-0005",
      cliente: "Consultora XYZ",
      fecha: "2023-05-25",
      vencimiento: "2023-06-25",
      monto: "$2,800.00",
      estado: "pagada",
      items: [{ descripcion: "Desarrollo web", cantidad: 1, precio: 2800, importe: 2800 }],
    },
    {
      id: "FACT-2023-0006",
      cliente: "Freelancer 123",
      fecha: "2023-05-28",
      vencimiento: "2023-06-28",
      monto: "$2,100.00",
      estado: "pendiente",
      items: [{ descripcion: "Diseño gráfico", cantidad: 1, precio: 2100, importe: 2100 }],
    },
    {
      id: "FACT-2023-0007",
      cliente: "Empresa DEF",
      fecha: "2023-05-30",
      vencimiento: "2023-05-15",
      monto: "$3,500.00",
      estado: "vencida",
      items: [{ descripcion: "Consultoría", cantidad: 1, precio: 3500, importe: 3500 }],
    },
  ],
  cobros: [
    {
      id: "COB-2023-0001",
      factura: "FACT-2023-0001",
      cliente: "Empresa ABC",
      monto: 5800.0,
      fecha_programada: "2023-06-15",
      fecha_procesamiento: "2023-06-15",
      estado: "procesado",
      metodo: "Transferencia",
      referencia: "TRF001234",
    },
    {
      id: "COB-2023-0002",
      factura: "FACT-2023-0002",
      cliente: "Consultora XYZ",
      monto: 3200.0,
      fecha_programada: "2023-06-18",
      fecha_procesamiento: null,
      estado: "pendiente",
      metodo: "Tarjeta de crédito",
      referencia: "TC005678",
    },
    {
      id: "COB-2023-0003",
      factura: "FACT-2023-0003",
      cliente: "Freelancer 123",
      monto: 1500.0,
      fecha_programada: "2023-05-20",
      fecha_procesamiento: null,
      estado: "pendiente",
      metodo: "Transferencia",
      referencia: "TRF001235",
    },
    {
      id: "COB-2023-0004",
      factura: "FACT-2023-0004",
      cliente: "Empresa ABC",
      monto: 4200.0,
      fecha_programada: "2023-06-22",
      fecha_procesamiento: null,
      estado: "pendiente",
      metodo: "Cheque",
      referencia: "CHQ001",
    },
    {
      id: "COB-2023-0005",
      factura: "FACT-2023-0005",
      cliente: "Consultora XYZ",
      monto: 2800.0,
      fecha_programada: "2023-06-25",
      fecha_procesamiento: "2023-06-24",
      estado: "procesado",
      metodo: "Transferencia",
      referencia: "TRF001236",
    },
  ],
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(datosIniciales)

  // Cargar datos del localStorage al inicializar
  useEffect(() => {
    const datosGuardados = localStorage.getItem("facturacion-app-data")
    if (datosGuardados) {
      try {
        const datos = JSON.parse(datosGuardados)
        setState(datos)
      } catch (error) {
        console.error("Error al cargar datos:", error)
      }
    }
  }, [])

  // Guardar datos en localStorage cuando cambie el estado
  useEffect(() => {
    localStorage.setItem("facturacion-app-data", JSON.stringify(state))
  }, [state])

  // Funciones para productos
  const agregarProducto = (producto: Omit<Producto, "id">) => {
    const nuevoId = (Math.max(...state.productos.map((p) => Number.parseInt(p.id))) + 1).toString()
    const nuevoProducto = { ...producto, id: nuevoId }
    setState((prev) => ({
      ...prev,
      productos: [...prev.productos, nuevoProducto],
    }))
  }

  const actualizarProducto = (id: string, producto: Partial<Producto>) => {
    setState((prev) => ({
      ...prev,
      productos: prev.productos.map((p) => (p.id === id ? { ...p, ...producto } : p)),
    }))
  }

  const eliminarProducto = (id: string) => {
    setState((prev) => ({
      ...prev,
      productos: prev.productos.filter((p) => p.id !== id),
    }))
  }

  const cambiarEstadoProducto = (id: string) => {
    setState((prev) => ({
      ...prev,
      productos: prev.productos.map((p) =>
        p.id === id ? { ...p, estado: p.estado === "activo" ? "inactivo" : "activo" } : p,
      ),
    }))
  }

  // Funciones para clientes
  const agregarCliente = (cliente: Omit<Cliente, "id" | "facturas">) => {
    const nuevoId = (Math.max(...state.clientes.map((c) => Number.parseInt(c.id))) + 1).toString()
    const nuevoCliente = { ...cliente, id: nuevoId, facturas: 0 }
    setState((prev) => ({
      ...prev,
      clientes: [...prev.clientes, nuevoCliente],
    }))
  }

  const actualizarCliente = (id: string, cliente: Partial<Cliente>) => {
    setState((prev) => ({
      ...prev,
      clientes: prev.clientes.map((c) => (c.id === id ? { ...c, ...cliente } : c)),
    }))
  }

  const eliminarCliente = (id: string) => {
    setState((prev) => ({
      ...prev,
      clientes: prev.clientes.filter((c) => c.id !== id),
    }))
  }

  const cambiarEstadoCliente = (id: string) => {
    setState((prev) => ({
      ...prev,
      clientes: prev.clientes.map((c) =>
        c.id === id ? { ...c, estado: c.estado === "activo" ? "inactivo" : "activo" } : c,
      ),
    }))
  }

  // Funciones para facturas
  const agregarFactura = (factura: Omit<Factura, "id">) => {
    const numeroActual = Math.max(...state.facturas.map((f) => Number.parseInt(f.id.split("-")[2])))
    const nuevoNumero = `FACT-2024-${String(numeroActual + 1).padStart(4, "0")}`
    const nuevaFactura = { ...factura, id: nuevoNumero }
    setState((prev) => ({
      ...prev,
      facturas: [...prev.facturas, nuevaFactura],
    }))
  }

  const actualizarFactura = (id: string, factura: Partial<Factura>) => {
    setState((prev) => ({
      ...prev,
      facturas: prev.facturas.map((f) => (f.id === id ? { ...f, ...factura } : f)),
    }))
  }

  const marcarFacturaComoPagada = (id: string) => {
    setState((prev) => ({
      ...prev,
      facturas: prev.facturas.map((f) => (f.id === id ? { ...f, estado: "pagada" } : f)),
    }))
  }

  // Funciones para cobros
  const agregarCobro = (cobro: Omit<Cobro, "id">) => {
    const numeroActual = Math.max(...state.cobros.map((c) => Number.parseInt(c.id.split("-")[2])))
    const nuevoNumero = `COB-2024-${String(numeroActual + 1).padStart(4, "0")}`
    const nuevoCobro = { ...cobro, id: nuevoNumero }
    setState((prev) => ({
      ...prev,
      cobros: [...prev.cobros, nuevoCobro],
    }))
  }

  const marcarCobroComoProcesado = (id: string) => {
    const fechaActual = new Date().toISOString().split("T")[0]
    setState((prev) => ({
      ...prev,
      cobros: prev.cobros.map((c) =>
        c.id === id ? { ...c, estado: "procesado", fecha_procesamiento: fechaActual } : c,
      ),
    }))
  }

  const value: AppContextType = {
    state,
    agregarProducto,
    actualizarProducto,
    eliminarProducto,
    cambiarEstadoProducto,
    agregarCliente,
    actualizarCliente,
    eliminarCliente,
    cambiarEstadoCliente,
    agregarFactura,
    actualizarFactura,
    marcarFacturaComoPagada,
    agregarCobro,
    marcarCobroComoProcesado,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
