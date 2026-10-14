# Ejercicios y reglas

Los ejercicios se encuentran en `js/datos-ejercicios.js` y usan FEN para describir la posición. La interfaz compara la jugada del alumno con una solución UCI definida para cada ejercicio; no acepta cualquier movimiento como correcto.

El módulo `js/ejercicios.js` valida turnos, trayectorias, capturas básicas y que el movimiento no deje al propio rey en jaque. Esta entrega no declara un motor completo: todavía faltan una interfaz de promoción, enroque, captura al paso y detección editorial completa de mate/ahogado. Esas limitaciones se muestran también junto al tablero. Antes de presentar posiciones avanzadas como reglamentarias, ampliar la implementación y sumar una batería de casos de prueba.
