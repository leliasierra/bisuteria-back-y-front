# Bisutería - Hechos Con Amor

Sistema de gestión de inventario y ventas para emprendimiento de bisutería.

## Tech Stack

- **Backend**: Express.js, JSON DB, JWT
- **Frontend**: React, TypeScript, Vite, Zustand

## Estructura

```
bisuteria-back-y-front/
├── backend/          # API REST
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── schemas/
│   └── db/
└── frontend/         # App React
    ├── src/
    │   ├── components/
    │   ├── stores/
    │   └── lib/
    └── public/
```

## Instalación

```bash
# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
```

## Ejecución

```bash
# Backend (puerto 3000)
cd backend
npm run dev

# Frontend (puerto 5173)
cd frontend
npm run dev
```

## Funcionalidades

- Autenticación de usuarios (login/register)
- Gestión de productos (CRUD)
- Registro de ventas
- Control de inventario
- Alertas de stock bajo
