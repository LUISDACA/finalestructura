# 📊 Plataforma de Facturación Inteligente

Una plataforma moderna y completa de facturación diseñada para freelancers y PyMEs, construida con Next.js 14, React 18 y Tailwind CSS.

![Facturación Inteligente](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.1-38B2AC.svg)

## 🚀 Características Principales

### 📋 Gestión de Facturas
- ✅ Creación de facturas con múltiples productos/servicios
- ✅ Generación automática de PDF profesionales
- ✅ Estados de factura (Pendiente, Pagada, Vencida)
- ✅ Numeración automática secuencial
- ✅ Cálculo automático de impuestos (IVA 16%)

### 👥 Gestión de Clientes
- ✅ CRUD completo de clientes
- ✅ Estados activo/inactivo
- ✅ Información de contacto completa
- ✅ Historial de facturas por cliente

### 📦 Catálogo de Productos/Servicios
- ✅ Gestión de productos y servicios
- ✅ Precios y descripciones
- ✅ Categorización por tipo
- ✅ Estados activo/inactivo

### 💰 Sistema de Cobros
- ✅ Programación de cobros automáticos
- ✅ Seguimiento de pagos
- ✅ Múltiples métodos de pago
- ✅ Estados de procesamiento

### 📊 Dashboard y Analítica
- ✅ Vista general con métricas en tiempo real
- ✅ Gráficos interactivos de ingresos
- ✅ Análisis de facturas por estado
- ✅ Alertas y notificaciones inteligentes
- ✅ Reportes fiscales automatizados

### 🎨 Interfaz de Usuario
- ✅ Diseño moderno y responsivo
- ✅ Modo oscuro/claro
- ✅ Sidebar colapsible
- ✅ Componentes reutilizables con shadcn/ui
- ✅ Animaciones suaves

## 🛠 Tecnologías Utilizadas

### Frontend Framework
- *Next.js 14.1.0* - Framework React con App Router
- *React 18* - Biblioteca de interfaz de usuario
- *TypeScript 5* - Tipado estático para JavaScript

### Styling & UI
- *Tailwind CSS 3.4.1* - Framework CSS utility-first
- *shadcn/ui* - Componentes UI modernos y accesibles
- *Lucide React* - Iconos SVG optimizados
- *next-themes* - Soporte para modo oscuro/claro

### Generación de PDF
- *jsPDF 2.5.1* - Generación de PDFs en el cliente
- *jspdf-autotable 3.8.2* - Tablas automáticas para jsPDF

### Gestión de Estado
- *React Context API* - Estado global de la aplicación
- *localStorage* - Persistencia de datos local

### Utilidades
- *date-fns 3.3.1* - Manipulación de fechas
- *class-variance-authority* - Gestión de variantes de clases
- *clsx & tailwind-merge* - Utilidades para clases CSS

## 📦 Instalación

### Prerrequisitos
- Node.js 18.0 o superior
- npm, yarn, pnpm o bun

### Pasos de Instalación

1. *Clonar el repositorio*
\\\`bash
git clone https://github.com/tu-usuario/facturacion-inteligente.git
cd facturacion-inteligente
\\\`

2. *Instalar dependencias*
\\\`bash
npm install
# o
yarn install
# o
pnpm install
\\\`

3. *Ejecutar en modo desarrollo*
\\\`bash
npm run dev
# o
yarn dev
# o
pnpm dev
\\\`

4. *Abrir en el navegador*
\\\`
http://localhost:3000
\\\`

## 🏗 Estructura del Proyecto

\\\`
facturacion-inteligente/
├── app/                          # App Router de Next.js
│   ├── globals.css              # Estilos globales
│   ├── layout.tsx               # Layout principal
│   ├── page.tsx                 # Dashboard principal
│   ├── clientes/                # Páginas de clientes
│   ├── productos/               # Páginas de productos
│   ├── facturas/                # Páginas de facturas
│   ├── cobros/                  # Páginas de cobros
│   └── configuracion/           # Páginas de configuración
├── components/                   # Componentes React
│   ├── ui/                      # Componentes base (shadcn/ui)
│   ├── app-sidebar.tsx          # Sidebar principal
│   ├── mode-toggle.tsx          # Toggle modo oscuro/claro
│   ├── *-table.tsx              # Tablas de datos
│   ├── *-dialog.tsx             # Diálogos modales
│   └── grafico-*.tsx            # Componentes de gráficos
├── lib/                         # Utilidades y configuración
│   ├── utils.ts                 # Utilidades generales
│   ├── app-context.tsx          # Context de la aplicación
│   └── pdf-generator.ts         # Generador de PDFs
├── hooks/                       # Custom hooks
│   └── use-mobile.tsx           # Hook para detección móvil
├── public/                      # Archivos estáticos
├── tailwind.config.js           # Configuración de Tailwind
├── next.config.mjs              # Configuración de Next.js
└── package.json                 # Dependencias del proyecto
\\\`

## 🎯 Funcionalidades Detalladas

### 📊 Dashboard
- *Métricas en tiempo real*: Ingresos totales, facturas pendientes, clientes activos
- *Gráficos interactivos*: Análisis de ingresos vs gastos, distribución de facturas
- *Alertas inteligentes*: Facturas vencidas, cobros programados, recordatorios
- *Facturas recientes*: Vista rápida de las últimas facturas emitidas

### 📄 Gestión de Facturas
- *Creación intuitiva*: Formulario paso a paso con validaciones
- *Selección de productos*: Catálogo integrado con precios automáticos
- *Cálculos automáticos*: Subtotales, IVA, totales en tiempo real
- *PDF profesional*: Generación automática con diseño corporativo
- *Estados dinámicos*: Seguimiento completo del ciclo de vida

### 👤 Gestión de Clientes
- *Información completa*: Datos de contacto, ubicación, estado
- *Búsqueda avanzada*: Filtros por nombre, email, ubicación
- *Historial integrado*: Número de facturas por cliente
- *Estados flexibles*: Activar/desactivar clientes según necesidad

### 🛍 Catálogo de Productos
- *Tipos flexibles*: Productos físicos y servicios
- *Precios dinámicos*: Actualización en tiempo real en facturas
- *Descripciones detalladas*: Información completa para facturas
- *Gestión de estados*: Control de disponibilidad

### 💳 Sistema de Cobros
- *Programación flexible*: Fechas y métodos personalizables
- *Seguimiento completo*: Estados pendiente/procesado
- *Múltiples métodos*: Transferencia, tarjeta, efectivo, cheque
- *Referencias*: Sistema de tracking por cobro

### 📈 Reportes y Analítica
- *Reportes fiscales*: IVA, retenciones, ingresos gravados
- *Análisis temporal*: Comparativas mensuales y anuales
- *Métricas de negocio*: Conversión, ticket promedio, crecimiento
- *Exportación*: Generación de reportes en PDF

## ⚙ Configuración

### Variables de Entorno
El proyecto utiliza configuración local sin variables de entorno externas.

### Personalización de Tema
\\\`typescript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Personaliza los colores del tema
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        // ...
      }
    }
  }
}
\\\`

### Configuración de Empresa
Edita los datos de tu empresa en:
\\\`typescript
// lib/pdf-generator.ts
empresa: {
  nombre: "Tu Empresa S.A. de C.V.",
  rfc: "TUE123456789",
  direccion: "Tu dirección completa",
  telefono: "+52 55 1234 5678",
  email: "contacto@tuempresa.com",
}
\\\`

## 🚀 Despliegue

### Vercel (Recomendado)
\\\`bash
npm run build
vercel --prod
\\\`

### Netlify
\\\`bash
npm run build
# Subir carpeta .next a Netlify
\\\`

### Docker
\\\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\\\`

## 🧪 Scripts Disponibles

\\\`bash
npm run dev          # Desarrollo local
npm run build        # Construcción para producción
npm run start        # Servidor de producción
npm run lint         # Linting con ESLint
\\\`

## 📱 Responsividad

La aplicación está completamente optimizada para:
- 📱 *Móviles*: 320px - 768px
- 📱 *Tablets*: 768px - 1024px
- 💻 *Desktop*: 1024px+

## 🔒 Seguridad

- ✅ Validación de datos en cliente
- ✅ Sanitización de inputs
- ✅ Protección XSS básica
- ✅ Datos almacenados localmente

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (git checkout -b feature/AmazingFeature)
3. Commit tus cambios (git commit -m 'Add some AmazingFeature')
4. Push a la rama (git push origin feature/AmazingFeature)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver LICENSE para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. *Issues*: Abre un issue en GitHub
2. *Documentación*: Revisa este README
3. *Comunidad*: Únete a nuestras discusiones

## 🗺 Roadmap

### Próximas Características
- [ ] 🔐 Sistema de autenticación
- [ ] 🌐 API REST para integración
- [ ] 📧 Envío automático de facturas por email
- [ ] 💾 Base de datos externa (PostgreSQL/MongoDB)
- [ ] 📊 Dashboard avanzado con más métricas
- [ ] 🔄 Sincronización en la nube
- [ ] 📱 App móvil nativa
- [ ] 🤖 Automatización con IA

### Mejoras Técnicas
- [ ] Tests unitarios y de integración
- [ ] PWA (Progressive Web App)
- [ ] Optimización de rendimiento
- [ ] Internacionalización (i18n)
- [ ] Accesibilidad mejorada (WCAG 2.1)
