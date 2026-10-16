/* Respaldo pequeño y auditable. Las FEN y secuencias UCI fueron comprobadas
 * con chess.js; no depende de la API para que el tablero siga funcionando. */
window.AjedrezDatos = window.AjedrezDatos || {};
window.AjedrezDatos.ejercicios = [
  { id:'mate-en-uno', titulo:'Mate en una', rating:1350, dificultad:'Principiante · 1350', categoria:'Jaque mate', fen:'7k/5Q2/6K1/8/8/8/8/8 w - - 0 1', solucion:['f7g7'], pistas:['Buscá una casilla junto al rey negro.','La dama debe quedar protegida por el rey blanco.'], explicacion:'La dama da jaque mate en g7 y queda protegida por el rey blanco.', fuente:'Ejercicio editorial AjedrezTotal · FEN verificada' },
  { id:'captura-dama', titulo:'El caballo gana la dama', rating:1450, dificultad:'Intermedio · 1450', categoria:'Captura táctica', fen:'4k3/8/8/3q4/8/2N5/8/4K3 w - - 0 1', solucion:['c3d5'], pistas:['El caballo puede saltar al centro.'], explicacion:'El caballo captura la dama negra en d5.', fuente:'Ejercicio editorial AjedrezTotal · FEN verificada' },
  { id:'promocion', titulo:'Coroná el peón', rating:1200, dificultad:'Principiante · 1200', categoria:'Promoción', fen:'7k/P7/8/8/8/8/8/6K1 w - - 0 1', solucion:['a7a8q'], pistas:['El peón blanco está en la séptima fila.'], explicacion:'El peón llega a la última fila y se transforma en dama.', fuente:'Ejercicio editorial AjedrezTotal · FEN verificada' }
];
