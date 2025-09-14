import { useState, useEffect, useRef } from 'react';
import './App.css';

const DEFAULT_SECONDS = 10;
const DEFAULT_BG = '#1976d2';
const RED = '#d32f2f';

function TimerJuego() {
  const [seconds, setSeconds] = useState(DEFAULT_SECONDS);
  const [running, setRunning] = useState(false);
  const [bgColor, setBgColor] = useState(DEFAULT_BG);
  const [flash, setFlash] = useState(false);
  const timerRef = useRef();
  const audioRef = useRef();

  useEffect(() => {
    if (!running) return;
    if (seconds === 0) {
      let flashCount = 0;
      let flashInterval;
      setBgColor(RED);
      if (navigator.vibrate) navigator.vibrate([300, 100, 300]);
      // Reproducir loose.wav solo una vez
      if (audioRef.current) {
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
    timerRef.current = setTimeout(() => {
      setSeconds(s => s - 1);
    }, 1000);
    return () => clearTimeout(timerRef.current);
  }, [seconds, running]);

  // Reiniciar temporizador al tocar pantalla
  useEffect(() => {
    let started = false;
    const handleTouch = () => {
      if (!started && !running) {
        // Intentar reproducir el audio para desbloquearlo en iOS/Safari
        if (audioRef.current) {
          audioRef.current.play().catch(() => {});
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        setRunning(true);
        started = true;
        return;
      }
      setSeconds(DEFAULT_SECONDS);
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
  }, [running]);

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
      <div style={{
        fontSize: '5rem',
        color: '#fff',
        fontWeight: 'bold',
        textShadow: '2px 2px 8px #000',
        marginBottom: '2rem',
      }}>
        {seconds}
      </div>
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
    </div>
  );
}

export default TimerJuego;
