/**
 * Mantiene los artículos editoriales que consume la biblioteca del sitio.
 * El contenido es de ejemplo y se filtra localmente por título, resumen y categoría.
 */
window.AjedrezDatos = window.AjedrezDatos || {};
window.AjedrezDatos.articulos = [
  {
    id: 'principios-apertura',
    titulo: 'Tres preguntas antes de mover',
    categoria: 'Principios estratégicos',
    resumen: 'Una guía breve para convertir la apertura en un plan comprensible.',
    autor: 'Redacción AjedrezTotal',
    fecha: '2026-10-01',
    contenido: 'Antes de mover, preguntate qué amenaza tu rival, qué pieza está peor ubicada y qué casilla querés controlar. Estas tres preguntas reducen los movimientos automáticos y ayudan a construir una posición con intención.'
  },
  {
    id: 'calculo-candidatos',
    titulo: 'Cómo ordenar el cálculo de variantes',
    categoria: 'Táctica',
    resumen: 'Un método práctico para comparar jugadas candidatas sin perderte en el árbol.',
    autor: 'Redacción AjedrezTotal',
    fecha: '2026-09-18',
    contenido: 'Elegí pocas candidatas: jaques, capturas y amenazas. Para cada una, imaginá la mejor respuesta del rival y recién después evaluá el resultado. La calidad del cálculo mejora cuando la lista es corta y las respuestas son concretas.'
  },
  {
    id: 'finales-rey-peon',
    titulo: 'El rey activo en finales de peones',
    categoria: 'Finales',
    resumen: 'Por qué la oposición importa y cómo practicarla con posiciones simples.',
    autor: 'Redacción AjedrezTotal',
    fecha: '2026-08-30',
    contenido: 'En muchos finales de peones, la actividad del rey decide más que el material. Practicá posiciones de oposición y contá las casillas críticas antes de avanzar el peón.'
  },
  {
    id: 'rutina-principiante',
    titulo: 'Una rutina semanal posible',
    categoria: 'Consejos para principiantes',
    resumen: 'Una propuesta realista de estudio, táctica y partidas comentadas.',
    autor: 'Redacción AjedrezTotal',
    fecha: '2026-08-12',
    contenido: 'Alterná sesiones cortas de táctica, revisión de una partida propia y lectura de un concepto. La constancia y la revisión consciente producen más progreso que acumular horas sin foco.'
  }
];
