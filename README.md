# Cuestionario WhatsApp - Oasis Air Cleaner Services LLC

Mini-app lista para GitHub Pages. No requiere base de datos ni servidor.

## Qué hace
- Cuestionario móvil para clientes.
- Preguntas condicionales según el servicio.
- Resume la solicitud.
- Exige seleccionar una fecha en Confirmafy antes del envío.
- Lectura obligatoria de la política de depósito para clientes nuevos.
- Envío directo del cuestionario por WhatsApp al 787-664-3079.

## Publicar con GitHub Pages
1. Crea un repositorio nuevo en GitHub, por ejemplo: `oasis-servicio`.
2. Sube `index.html`, `styles.css` y `app.js` a la raíz del repositorio.
3. Ve a **Settings > Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**.
5. Selecciona `main` y carpeta `/root`, luego **Save**.
6. GitHub te dará una dirección parecida a `https://TU-USUARIO.github.io/oasis-servicio/`.
7. Usa ese enlace como botón/enlace de "Solicitar servicio" en WhatsApp Business, Instagram, web o respuestas rápidas.

## Cambiar WhatsApp
Busca en `app.js` esta parte: `17876643079` y reemplázala por el número en formato internacional, sin + ni guiones.
