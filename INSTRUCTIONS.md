# INSTRUCTIONS.md

## Instrucciones de uso

1. Clona el repositorio desde GitHub:
   ```sh
   git clone https://github.com/<usuario>/<repo>.git
   cd <repo>
   ```
2. Instala dependencias:
   ```sh
   npm install
   ```
3. Ejecuta localmente:
   ```sh
   npm run dev
   ```

## Configuración del temporizador

- Para cambiar los segundos iniciales, edita la variable `DEFAULT_SECONDS` en `src/App.jsx`.

## Deploy en GitHub Pages

1. Ejecuta el build:
   ```sh
   npm run build
   ```
2. Publica en GitHub Pages (preconfigurado con gh-pages):
   ```sh
   npm run deploy
   ```
3. Accede a la PWA desde `https://<usuario>.github.io/<repo>/`

## Instalación de la PWA en móvil

- Abre la URL publicada en tu navegador móvil.
- Elige "Agregar a la pantalla de inicio" para instalar la PWA.

## Notas técnicas

- El temporizador inicia automáticamente y se reinicia tocando cualquier parte de la pantalla.
- Al llegar a 0, el fondo parpadea en rojo, el dispositivo vibra (si es compatible) y se reproduce un sonido.
- El botón "Detener" pausa el temporizador manualmente.
- La configuración de PWA incluye `manifest.json` y `service-worker.js` en la carpeta `public/`.
- El deploy está preconfigurado con `gh-pages`.

---

Para dudas o mejoras, consulta el código fuente o abre un issue en GitHub.