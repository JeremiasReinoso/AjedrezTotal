# Ejercicios y reglas

Los ejercicios se encuentran en `js/datos-ejercicios.js` y usan FEN para describir la posición. Cada registro admite `id`, `titulo`, `dificultad`, `categoria`, `fen`, `solucion` (UCI), `pistas`, `explicacion` y `fuente`. Los ejemplos actuales están marcados como material editorial de AjedrezTotal.

`js/ejercicios.js` valida legalidad, turnos, jaque, enroque, promoción y captura al paso mediante Chess.js cuando la CDN está disponible, y tiene un validador local para los ejercicios offline. Una jugada legal que no coincide con la secuencia UCI se informa como incorrecta y no avanza la solución.

En `entrenar/index.html`, el ejercicio diario se solicita desde el navegador a `https://lichess.org/api/puzzle/daily`. Se reconstruye la posición aplicando el PGN hasta `initialPly` y se ejecuta la primera jugada de la solución como respuesta del rival; no se supone que la solución empieza desde la posición inicial de la partida. Si falla la API, CORS, la conexión o la CDN, se conserva un ejercicio local de respaldo. Lichess no se carga como iframe para esta herramienta.

Para agregar un ejercicio propio, incorporá un objeto al arreglo `window.AjedrezDatos.ejercicios`, con una FEN comprobada, la secuencia UCI completa y atribución en `fuente`. La estructura queda preparada para futuras selecciones editoriales de César Ariel Gerez.
