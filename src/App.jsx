import { useState, useEffect, useRef } from 'react';
import './App.css';

const DEFAULT_SECONDS = 10;
const DEFAULT_BG = '#1976d2';
const RED = '#d32f2f';

const CONFIG_KEY = 'timerJuego:config';
const DEFAULT_CONFIG = { seconds: DEFAULT_SECONDS, soundsEnabled: true };

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function TimerJuego() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [seconds, setSeconds] = useState(DEFAULT_SECONDS);
  const [running, setRunning] = useState(false);
  const [bgColor, setBgColor] = useState(DEFAULT_BG);
  const [flash, setFlash] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsSeconds, setSettingsSeconds] = useState(String(DEFAULT_SECONDS));
  const [settingsSoundsEnabled, setSettingsSoundsEnabled] = useState(true);
  const timerRef = useRef();
  const audioRef = useRef();
  const ticRef = useRef();

  // Cargar configuración desde localStorage al iniciar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CONFIG_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const sec = clamp(parseInt(parsed?.seconds, 10) || DEFAULT_SECONDS, 1, 600);
        const snd = typeof parsed?.soundsEnabled === 'boolean' ? parsed.soundsEnabled : true;
        const next = { ...DEFAULT_CONFIG, ...parsed, seconds: sec, soundsEnabled: snd };
        setConfig(next);
        setSeconds(sec);
        setSettingsSeconds(String(sec));
        setSettingsSoundsEnabled(Boolean(next.soundsEnabled));
      } else {
        // Persistir configuración por defecto para futuras ampliaciones
        localStorage.setItem(CONFIG_KEY, JSON.stringify(DEFAULT_CONFIG));
        setSettingsSeconds(String(DEFAULT_CONFIG.seconds));
        setSettingsSoundsEnabled(Boolean(DEFAULT_CONFIG.soundsEnabled));
      }
    } catch (_) {
      // Si hay error, usar valores por defecto
      setConfig(DEFAULT_CONFIG);
      setSeconds(DEFAULT_CONFIG.seconds);
      setSettingsSeconds(String(DEFAULT_CONFIG.seconds));
      setSettingsSoundsEnabled(Boolean(DEFAULT_CONFIG.soundsEnabled));
    }
  }, []);

  useEffect(() => {
    if (!running) return;
    if (seconds === 0) {
      let flashCount = 0;
      let flashInterval;
      setBgColor(RED);
      if (navigator.vibrate) navigator.vibrate([300, 100, 300]);
      // Reproducir loose.wav solo una vez
      if (audioRef.current && config.soundsEnabled) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      // Parpadeo entre rojo y blanco cada 400ms durante 5s
      flashInterval = setInterval(() => {
        setBgColor(prev => prev === RED ? DEFAULT_BG : RED);
        flashCount++;
        if (flashCount >= 12) { // 12*400ms ≈ 4800ms
          clearInterval(flashInterval);
          setBgColor(RED);
        }
      }, 400);
      return () => clearInterval(flashInterval);
    }
    // Reproducir tic.wav cada vez que cambia el segundo
    if (ticRef.current && config.soundsEnabled) {
      ticRef.current.volume = 0.4;
      ticRef.current.currentTime = 0;
      ticRef.current.play();
    }
    timerRef.current = setTimeout(() => {
      setSeconds(s => s - 1);
    }, 1000);
    return () => clearTimeout(timerRef.current);
  }, [seconds, running, config.soundsEnabled]);

  // Reiniciar temporizador al tocar pantalla
  useEffect(() => {
    let started = false;
    const handleTouch = (e) => {
      if (settingsOpen) return; // No iniciar si está abierta la configuración
      // Ignorar clics dentro de elementos marcados para no iniciar
      if (e && e.target && e.target.closest && e.target.closest('[data-ignore-start="true"]')) {
        return;
      }
      if (!started && !running) {
        // Intentar reproducir el audio para desbloquearlo en iOS/Safari
        if (audioRef.current && config.soundsEnabled) {
          audioRef.current.play().catch(() => {});
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        setRunning(true);
        started = true;
        return;
      }
      setSeconds(clamp(parseInt(config.seconds, 10) || DEFAULT_SECONDS, 1, 600));
      setBgColor(DEFAULT_BG);
      setFlash(false);
      setRunning(true);
      // Detener sonido si está reproduciéndose
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
    window.addEventListener('touchstart', handleTouch);
    window.addEventListener('mousedown', handleTouch);
    return () => {
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('mousedown', handleTouch);
    };
  }, [running, settingsOpen, config.seconds, config.soundsEnabled]);

  return (
    <div
      className="timer-bg"
      style={{
        background: bgColor,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.2s',
      }}
    >
  <audio ref={audioRef} src="/timerJuego/loose.wav" preload="auto" />
  <audio ref={ticRef} src="/timerJuego/tic.wav" preload="auto" />
      <div style={{ position: 'relative', width: '220px', height: '220px', marginBottom: '2rem' }}>
        {(() => {
          const R = 100;
          const C = 2 * Math.PI * R;
          const total = clamp(parseInt(config.seconds, 10) || DEFAULT_SECONDS, 1, 600);
          const offset = C * (1 - seconds / total);
          const ratio = seconds / total;
          const progressColor = ratio <= 0.1 ? '#ff5252' : ratio <= 0.25 ? '#ffeb3b' : '#ffffff';
          return (
            <svg width="220" height="220" viewBox="0 0 220 220" style={{ position: 'absolute', top: 0, left: 0 }}>
          <circle
            cx="110"
            cy="110"
            r={R}
            stroke="#ffffff44"
            strokeWidth="16"
            fill="none"
          />
          <circle
            cx="110"
            cy="110"
            r={R}
            stroke={progressColor}
            strokeWidth="16"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s linear', filter: 'drop-shadow(0 0 6px rgba(0,0,0,0.35)) drop-shadow(0 0 10px rgba(255,255,255,0.6))' }}
            transform="rotate(-90 110 110)"
          />
            </svg>
          );
        })()}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '220px',
          height: '220px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '5rem',
          color: '#fff',
          fontWeight: 'bold',
          textShadow: '2px 2px 8px #000',
        }}>
          {seconds}
        </div>
      </div>
      {/* Botón fijo de engranaje (siempre visible) */}
      <button
        aria-label="Abrir configuración"
        data-ignore-start="true"
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onClick={() => setSettingsOpen(true)}
        style={{
          position: 'fixed',
          right: 16,
          top: 16,
          width: 44,
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '999px',
          background: '#ffffffcc',
          border: '1px solid #ffffffaa',
          color: '#1976d2',
          boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
          backdropFilter: 'blur(6px)',
          cursor: 'pointer',
          zIndex: 900,
        }}
        title="Configuración"
      >
        {/* Ícono Engranaje (SVG) */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.4.12-.61l-1.92-3.32a.5.5 0 0 0-.58-.22l-2.39.96a7.025 7.025 0 0 0-1.63-.94l-.36-2.54A.496.496 0 0 0 13.9 1h-3.8c-.24 0-.44.17-.48.4l-.36 2.54c-.58.22-1.12.52-1.63.94l-2.39-.96a.5.5 0 0 0-.58.22L2.74 7.96c-.11.21-.06.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.5.5 0 0 0-.12.61l1.92 3.32c.12.21.37.3.58.22l2.39-.96c.5.41 1.05.74 1.63.94l.36 2.54c.04.23.24.4.48.4h3.8c.24 0 .44-.17.48-.4l.36-2.54c.58-.22 1.12-.52 1.63-.94l2.39.96c.21.08.46-.01.58-.22l1.92-3.32a.5.5 0 0 0-.12-.61l-2.03-1.58ZM12 15.5c-1.93 0-3.5-1.57-3.5-3.5S10.07 8.5 12 8.5s3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5Z"/>
        </svg>
      </button>

      {!running && (
        <button
          aria-label="Abrir configuración"
          data-ignore-start="true"
          style={{
            padding: '0.75rem 1.25rem',
            fontSize: '1rem',
            borderRadius: '8px',
            border: 'none',
            background: '#fff',
            color: '#1976d2',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            marginBottom: '1rem',
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onClick={() => setSettingsOpen(true)}
        >
          Configuración
        </button>
      )}
      <button
        style={{
          padding: '1rem 2rem',
          fontSize: '1.5rem',
          borderRadius: '8px',
          border: 'none',
          background: '#fff',
          color: '#1976d2',
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          cursor: running ? 'pointer' : 'not-allowed',
          opacity: running ? 1 : 0.5,
          pointerEvents: running ? 'auto' : 'none',
        }}
        onClick={() => {
          setRunning(false);
          // Detener sonido si está reproduciéndose
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
        }}
        disabled={!running || seconds === 0}
      >
        Detener
      </button>
      <div style={{marginTop: '2rem', color: '#fff', fontSize: '1rem'}}>
        {!running
          ? 'Toca la pantalla para iniciar el temporizador'
          : seconds === 0
            ? 'Toca la pantalla para reiniciar el temporizador'
            : 'Toca la pantalla para reiniciar (solo si perdiste)'}
      </div>

      {settingsOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-title"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onMouseDown={(e) => {
            // Cerrar al hacer click en el fondo
            if (e.target === e.currentTarget) setSettingsOpen(false);
          }}
        >
          <div
            data-ignore-start="true"
            style={{
              background: '#fff',
              color: '#333',
              borderRadius: '12px',
              width: 'min(92vw, 420px)',
              padding: '1.25rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h2 id="settings-title" style={{margin: 0, marginBottom: '1rem', fontSize: '1.25rem'}}>Configuración</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label htmlFor="seconds-input" style={{ fontWeight: 600 }}>Segundos del temporizador</label>
              <input
                id="seconds-input"
                type="number"
                min={1}
                max={600}
                value={settingsSeconds}
                onChange={(e) => setSettingsSeconds(e.target.value.replace(/[^0-9]/g, ''))}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                placeholder="p. ej. 10"
              />
              <label htmlFor="sounds-toggle" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', userSelect: 'none' }}>
                <input
                  id="sounds-toggle"
                  type="checkbox"
                  checked={settingsSoundsEnabled}
                  onChange={(e) => setSettingsSoundsEnabled(e.target.checked)}
                />
                Habilitar sonidos
              </label>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  onClick={() => {
                    setSettingsSeconds(String(config.seconds));
                    setSettingsSoundsEnabled(Boolean(config.soundsEnabled));
                    setSettingsOpen(false);
                  }}
                  style={{
                    padding: '0.6rem 1rem',
                    background: 'transparent',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    const raw = parseInt(settingsSeconds, 10);
                    const nextSeconds = clamp(isNaN(raw) ? config.seconds : raw, 1, 600);
                    const nextConfig = { ...config, seconds: nextSeconds, soundsEnabled: Boolean(settingsSoundsEnabled) };
                    setConfig(nextConfig);
                    localStorage.setItem(CONFIG_KEY, JSON.stringify(nextConfig));
                    setSeconds(nextSeconds);
                    setSettingsOpen(false);
                  }}
                  style={{
                    padding: '0.6rem 1rem',
                    background: '#1976d2',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  Guardar
                </button>
              </div>
            </div>
            <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#555' }}>La configuración se guarda en este dispositivo.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimerJuego;
