# Arquitectura

AjedrezTotal mantiene un frontend estático, pero ahora incorpora una API serverless opcional y una base PostgreSQL. El navegador nunca se conecta directamente a SQL: los endpoints de `api/` validan los datos y persisten mediante `@vercel/postgres`.

- `datos/` contiene información editorial editable y ficticia.
- `js/` separa navegación, utilidades, catálogo, formulario y tablero.
- `css/` contiene tokens, base, componentes, layout, responsive y tablero.
- `db/schema.sql` define usuarios, sesiones, solicitudes de formularios y auditoría.
- `api/_lib/auth.js` centraliza hash scrypt, sesiones y lectura de usuario.
- Las páginas de sección usan enlaces relativos para funcionar en GitHub Pages o al abrir `index.html` localmente.

La interfaz no inserta contenido proveniente de usuarios: los datos dinámicos se escapan con `AjedrezUI.escape`. Las contraseñas nunca se guardan en texto plano; las sesiones usan tokens aleatorios almacenados solo como hash y cookie HttpOnly. Los perfiles de demostración están marcados como ficticios.
