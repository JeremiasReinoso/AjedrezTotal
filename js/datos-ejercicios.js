/**
 * Proporciona las posiciones, soluciones y explicaciones de los ejercicios interactivos.
 * Los módulos de inicio y ejercicios leen esta colección; son ejemplos editoriales locales.
 */
window.AjedrezDatos = window.AjedrezDatos || {};
window.AjedrezDatos.ejercicios = [
  {
    id: 'mate-en-uno',
    titulo: 'Mate en una',
    dificultad: 'Principiante',
    categoria: 'Jaque mate',
    fen: '7k/5Q2/6K1/8/8/8/8/8 w - - 0 1',
    solucion: 'f7g7',
    pistas: ['Buscá una casilla junto al rey negro.', 'La dama debe quedar protegida por el rey blanco.'],
    explicacion: 'La dama da jaque junto al rey y queda protegida por el rey blanco; las casillas de escape están controladas.',
    fuente: 'Ejemplo editorial de AjedrezTotal'
  },
  {
    id: 'torre-clavada',
    titulo: 'La clavada decisiva',
    dificultad: 'Intermedio',
    categoria: 'Clavadas',
    fen: '7k/8/8/8/8/2B5/8/4R1K1 w - - 0 1',
    solucion: 'e1e8',
    explicacion: 'La torre avanza por la columna abierta y captura la pieza que ocupa e8 en esta variante editorial.',
    fuente: 'Ejemplo editorial de AjedrezTotal'
  },
  {
    id: 'caballo-doble',
    titulo: 'Un salto con doble ataque',
    dificultad: 'Intermedio',
    categoria: 'Ataques dobles',
    fen: '4k3/8/8/3q4/8/2N5/8/4K3 w - - 0 1',
    solucion: 'c3d5',
    explicacion: 'El caballo captura la dama en d5; la posición sirve para practicar un salto táctico.',
    fuente: 'Ejemplo editorial de AjedrezTotal'
  }
];
