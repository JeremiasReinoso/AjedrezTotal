# Instalación local

Para usar solo la parte estática, abrí `index.html` en un navegador moderno. Para habilitar usuarios y persistencia SQL, ejecutá `npm install`, copiá `.env.example` a `.env.local`, completá la URL de PostgreSQL y ejecutá `npm run db:apply`. En Vercel, vinculá Vercel Postgres/Neon para que `POSTGRES_URL` quede disponible y configurá también las variables de Resend.

El formulario usa `/api/contacto-entrenador`: primero guarda la solicitud en SQL y después intenta enviar el aviso por Resend. Si Resend falla, la solicitud queda guardada. Las cuentas se gestionan con `POST /api/usuarios-registro`, `POST /api/usuarios-login` y `GET /api/usuario-actual`.
