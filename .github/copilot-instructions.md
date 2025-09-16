## Copilot Instructions — TimerJuego

Esta PWA es un temporizador de juego construido con Vite + React, preparada como PWA y lista para desplegar en GitHub Pages. Usa este resumen para orientar contribuciones y mantener coherencia.

## Checklist de funcionalidades actuales

- [x] Base técnica: Vite + React con PWA (manifest + service worker).
- [x] Temporizador interactivo:
  - Inicio con toque/click global, pausa con botón “Detener”, reinicio con toque.
  - Indicador circular SVG animado que refleja el progreso por segundo.
  - Al terminar: fondo rojo, parpadeo, vibración (si disponible) y sonido de fin.
- [x] Configuración persistente:
  - Botón “Configuración” cuando está detenido y botón flotante de engranaje siempre visible.
  - Modal accesible para ajustar segundos (1–600) y habilitar/deshabilitar sonidos.
  - Config JSON en localStorage (clave `timerJuego:config`).
- [x] Sonidos: tic por segundo y fin de tiempo, con toggle de sonidos.
- [x] PWA/Offline: manifest, service worker, Add to Home Screen.
- [x] UI responsiva y moderna (móvil/escritorio).
- [x] Accesibilidad básica (roles/labels ARIA, bloqueo de auto-inicio con modal abierto).
- [x] Documentación en `README.md` e `INSTRUCTIONS.md`.

Nota: actualmente se persiste la configuración; el estado en curso del temporizador no se guarda.

## Detalles de implementación

- Auto-inicio y exclusiones
  - Listeners globales en `window` para `touchstart/mousedown` inician o reinician el contador.
  - Elementos de configuración (modal, botones) usan `data-ignore-start="true"` y detienen propagación para no iniciar el temporizador.

- Esquema de configuración (localStorage)
  - Clave: `timerJuego:config`
  - Estructura: `{ seconds: number, soundsEnabled: boolean }`
  - Carga en el montaje y merge con defaults para compatibilidad hacia atrás.

- Audio y iOS
  - “Unlock” de audio en el primer gesto del usuario para Safari/iOS.
  - Reproducción condicionada por `soundsEnabled`.

- UI/UX
  - Botón “Detener” pausa y detiene audio.
  - Engranaje flotante (top-right) abre configuración en cualquier momento.
  - Indicador circular usa `config.seconds` para el cálculo del progreso.

- PWA
  - `public/manifest.json` con nombre e íconos.
  - `public/service-worker.js` para offline básico.
  - Audios en `public/tic.wav` y `public/loose.wav` y referenciados desde `<audio>`.

## Buenas prácticas

- Versionar/expandir el JSON de `timerJuego:config` al añadir opciones (p.ej. `vibrationEnabled`, `themeColor`, `volume`).
- Mantener `data-ignore-start` y `stopPropagation` en controles que no deben iniciar el timer.
- Probar en touch/mouse y revisar accesibilidad (roles, labels, foco).
- Verificar rutas y base path para GitHub Pages (especialmente assets de audio/manifest).

## Próximos pasos sugeridos

- Añadir más opciones en Configuración: vibración on/off, color de fondo, volumen.
- Persistir estado del temporizador (opcional) entre recargas.
- Tests de smoke en móviles reales.

---

Mantén este checklist al día antes de publicar cambios.