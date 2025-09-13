
# TimerJuego PWA

Aplicación web progresiva (PWA) de temporizador interactivo hecha con Vite + React.

## Características
- Fondo personalizable (por defecto azul)
- Temporizador configurable (por defecto 30 segundos)
- Temporizador inicia automáticamente
- Al llegar a 0: fondo parpadea en rojo, vibra el dispositivo (si soporta vibración) y suena "perdiste"
- El temporizador se reinicia tocando cualquier parte de la pantalla
- Botón "Detener" para pausar el temporizador
- Listo para instalar como PWA en móvil
- Listo para publicar en GitHub Pages

## Ejecución local

1. Instala dependencias:
	```sh
	npm install
	```
2. Ejecuta la app:
	```sh
	npm run dev
	```

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

## Instalación en móvil

Abre la URL publicada y elige "Agregar a la pantalla de inicio".

## Configuración del temporizador

Modifica la variable `DEFAULT_SECONDS` en `src/App.jsx` para cambiar los segundos iniciales.

---

Para instrucciones detalladas, consulta `INSTRUCTIONS.md`.