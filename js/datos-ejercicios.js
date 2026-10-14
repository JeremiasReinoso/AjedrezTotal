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
    explicacion: 'La dama da jaque junto al rey y queda protegida por el rey blanco; las casillas de escape están controladas.'
  },
  {
    id: 'torre-clavada',
    titulo: 'La clavada decisiva',
    dificultad: 'Intermedio',
    categoria: 'Clavadas',
    fen: '4k3/8/8/8/8/2B5/8/4R1K1 w - - 0 1',
    solucion: 'e1e8',
    explicacion: 'La torre avanza por la columna abierta; la posición se usa para practicar trayectorias y jaques.'
  },
  {
    id: 'caballo-doble',
    titulo: 'Un salto con doble ataque',
    dificultad: 'Intermedio',
    categoria: 'Ataques dobles',
    fen: '4k3/8/8/3q4/8/2N5/8/4K3 w - - 0 1',
    solucion: 'c3d5',
    explicacion: 'El caballo salta a una casilla central y ataca la dama junto con una pieza de apoyo.'
  }
];
