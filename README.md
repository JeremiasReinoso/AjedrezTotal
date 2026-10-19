# AjedrezTotal

Plataforma web estática de aprendizaje, entrenamiento y difusión del ajedrez. Está construida con HTML5, CSS3 y JavaScript del navegador, sin frameworks ni dependencias de compilación.

## Estado actual

- Portada responsive con navegación accesible.
- Catálogo de entrenadores con búsqueda, filtros, ordenamiento y detalle. Los tres perfiles son ficticios.
- Formulario de incorporación conectado a una función serverless que envía las solicitudes por correo.
- Biblioteca editorial con búsqueda y filtro.
- Agenda de comunidad con estado vacío honesto; no hay eventos verificados cargados.
- Tablero de ejercicios con puzzles reales de Lichess, historial anti-repetición, respaldo local, solución comparada, reinicio y ELO independiente.
- Sección de partidas de entrenadores preparada para cuentas públicas de Lichess, con visor PGN/NDJSON dentro del sitio.
- Limitación declarada: el tablero aún no es un motor reglamentario completo; falta interfaz y cobertura completa de enroque, promoción, captura al paso y detección editorial de mate/ahogado.

## Uso

Abrí `index.html` o publicá la carpeta en un alojamiento estático. La documentación operativa está en `docs/`.

## Verificación ejecutada

Se revisaron los archivos HTML/CSS/JS con inspección estática y se ejecutó una prueba de sintaxis JavaScript con `node --check` (Node solo se usa como herramienta de verificación, no como requisito de ejecución). La prueba de navegador debe repetirse en el entorno de publicación antes del lanzamiento.
