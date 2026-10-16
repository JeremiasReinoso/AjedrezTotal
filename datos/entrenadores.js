/**
 * Define los perfiles de entrenadores consumidos por los módulos de inicio,
 * catálogo y perfil; los datos se mantienen localmente en este archivo.
 * Los perfiles pendientes esperan información y los restantes ejemplos son ficticios.
 */
window.AjedrezDatos = window.AjedrezDatos || {};
window.AjedrezDatos.entrenadores = [
  { id: 'cesar-ariel-gerez', nombre: 'César Ariel Gerez', iniciales: 'CG', publicado: true, imagen: 'entrenadores/PerfilEntrenadores/profecesar.jpeg', bio: 'Contactá al entrenador para consultar sobre sus clases y modalidades de enseñanza.', whatsapp: 'https://wa.me/542945638915?text=Hola%2C%20C%C3%A9sar.%20Te%20contacto%20desde%20AjedrezTotal%20porque%20me%20interesa%20consultar%20sobre%20tus%20clases%20de%20ajedrez.' },
  { id: 'jeremias-reinoso', nombre: 'Jeremias Reinoso', iniciales: 'JR', publicado: true, imagen: 'entrenadores/PerfilEntrenadores/ProfeJere.png', bio: 'Contactá al entrenador para consultar sobre sus clases y modalidades de enseñanza.', whatsapp: 'https://wa.me/542944312022?text=Hola%2C%20Jeremias.%20Te%20contacto%20desde%20AjedrezTotal%20para%20consultar%20sobre%20tus%20clases%20de%20ajedrez.' },
  { id: 'walter-sierra', nombre: 'Walter Sierra', iniciales: 'WS', pendiente: true, destacado: true, bio: 'Pronto vas a encontrar aquí información sobre sus clases.', whatsapp: 'https://wa.me/542945695264?text=Hola%2C%20Walter.%20Te%20contacto%20desde%20AjedrezTotal%20para%20consultar%20sobre%20tus%20clases%20de%20ajedrez.' },
  { id: 'sofia-rios', nombre: 'Sofía Ríos', iniciales: 'SR', destacado: false, ficticio: true, bio: 'Ficha ficticia para ilustrar una especialista en finales y acompañamiento para adultos.', titulos: 'Pendiente de revisión documental', experiencia: 'Ejemplo de experiencia declarada por una profesional', especialidades: ['Finales', 'Adultos'], niveles: ['Principiante', 'Intermedio'], modalidad: ['Presencial'], idiomas: ['Español'], disponibilidad: 'Consultar disponibilidad', tarifa: 'A convenir', contacto: 'mailto:contacto@ejemplo.invalid' }
];
