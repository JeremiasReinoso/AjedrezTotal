# Arquitectura

AjedrezTotal es una aplicación estática: cada página HTML carga hojas CSS, datos locales y módulos JavaScript del navegador. No necesita servidor de aplicación, base de datos ni proceso de compilación.

- `datos/` contiene información editorial editable y ficticia.
- `js/` separa navegación, utilidades, catálogo, formulario y tablero.
- `css/` contiene tokens, base, componentes, layout, responsive y tablero.
- Las páginas de sección usan enlaces relativos para funcionar en GitHub Pages o al abrir `index.html` localmente.

La interfaz no inserta contenido proveniente de usuarios: los datos dinámicos se escapan con `AjedrezUI.escape`. Los perfiles de demostración están marcados como ficticios.
