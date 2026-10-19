# Envío de solicitudes de entrenadores

El formulario de `incorporar-entrenador/` envía un `POST` a `/api/contacto-entrenador`. La función serverless usa [Resend](https://resend.com/) y entrega las solicitudes a `reinosojeremias0@gmail.com`.

## Configuración de producción

El repositorio debe desplegarse en Vercel (o en un adaptador compatible con funciones Node en `api/`). En el proyecto de Vercel, configurá estas variables de entorno:

- `RESEND_API_KEY`: clave privada de Resend.
- `RESEND_FROM_EMAIL`: remitente autorizado en Resend. Para pruebas puede ser `onboarding@resend.dev`; para producción conviene verificar un dominio propio.
- `TEACHER_APPLICATION_RECIPIENT`: opcional; por defecto es `reinosojeremias0@gmail.com`.

No pongas la clave de Resend en HTML, JavaScript del navegador ni en GitHub. GitHub Pages por sí solo no ejecuta la carpeta `api/`; si el sitio continúa alojado allí, hay que mantener el frontend y la función en un despliegue que soporte serverless.
