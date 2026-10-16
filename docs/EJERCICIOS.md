# Ejercicios tácticos

`ejercicios/index.html` usa un tablero propio. `js/ejercicios.js` utiliza `chess.js 0.10.3` desde cdnjs para validar FEN, turnos, capturas, jaques, enroque, promoción y captura al paso. Si la CDN o la red no están disponibles, conserva un validador local reducido y carga el catálogo verificado de `js/datos-ejercicios.js`.

## Ejercicios de Lichess

La fuente prioritaria es `https://lichess.org/api/puzzle/daily`; «Siguiente ejercicio» intenta `https://lichess.org/api/puzzle/next`. Se reconstruye la posición aplicando el PGN hasta `initialPly`; la primera jugada de `solution` es la jugada previa del rival y se ejecuta automáticamente. Las jugadas siguientes se comparan como UCI dentro del tablero propio. El ejercicio diario se cachea por fecha y los IDs aparecidos recientemente se guardan en `ajedrez-total-lichess-recent-v1` (hasta 40) para evitar repeticiones. Las peticiones son secuenciales; un HTTP 429 activa una pausa de 60 segundos. Si falla la API, CORS, la CDN o la conexión, se conserva el respaldo local y se muestra un aviso que lo identifica como tal.

La API de ejercicios de Lichess y su documentación son la referencia operativa. Los ejercicios locales de este repositorio son material editorial de AjedrezTotal, con FEN y soluciones UCI comprobadas. La base pública de puzzles de Lichess se distribuye bajo CC0; cualquier catálogo futuro debe mantener la atribución y licencia de su fuente.

## ELO propio

El rating comienza en 1500. Para un usuario `R` y un ejercicio `P`, la expectativa es `E = 1 / (1 + 10 ^ ((P - R) / 400))`. Se usa `K = 24` y `cambio = redondear(K × (resultado − E))`:

- solución sin pista: resultado 1;
- solución con pista: resultado 0,5;
- error final o “Ver solución”: resultado 0.

Una sesión se puntúa una sola vez por ejercicio. Una jugada legal pero incorrecta permite reintentar y no modifica el rating por sí misma. El usuario ve el rating actual, su mejor rating, el rating del ejercicio, el cambio y las estadísticas.

## Guardado

El progreso del usuario se guarda en `localStorage` bajo `ajedrez-total-exercise-user-v1`: rating, mejor rating, ejercicios resueltos, aciertos, errores, historial de hasta 100 resultados y preferencias reservadas. El catálogo diario se guarda por separado bajo `ajedrez-total-exercise-catalog-v2`. El progreso y el historial son locales al navegador y no se sincronizan entre dispositivos. El ELO de AjedrezTotal es independiente del rating de origen del puzzle.

Para agregar un ejercicio editorial, sumá un objeto a `window.AjedrezDatos.ejercicios` con `id`, `titulo`, `rating`, `dificultad`, `categoria`, `fen`, `solucion` UCI, `pistas`, `explicacion` y `fuente`. Verificá cada FEN y cada jugada antes de publicarlo.

## Partidas de entrenadores

Los usuarios de la sección viven en `window.AjedrezDatos.partidasEntrenadores` dentro de `datos/entrenadores.js`. Para agregar otro perfil basta con sumar `{ id, lichessUsername, nombre }`; no se inventan datos editoriales ni credenciales.

`js/partidas-entrenadores.js` consulta `GET /api/games/user/{username}` como `application/x-ndjson`, en una cola de una solicitud por vez, con un máximo inicial de 8 partidas. Usa `until` para cargar partidas más antiguas, filtra variantes no estándar, cachea cada cuenta durante 10 minutos y reconstruye las posiciones con chess.js en un visor local. Las partidas no afectan el ELO de ejercicios. La API pública depende de CORS, conectividad y disponibilidad de la cuenta; los estados de error y reintento son independientes por entrenador.

Verificación realizada el 16/10/2026: `GCA91`, `HulkSierra` y `oiki76778` existen y devolvieron partidas reales desde la API con un User-Agent de navegador. La API responde `404` a algunos clientes automatizados con User-Agent genérico; la página publicada usa el User-Agent normal del navegador y muestra un mensaje de reintento si Lichess aplica ese bloqueo. No se incorporó backend ni credenciales.
