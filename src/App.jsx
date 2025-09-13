
// Importing necessary libraries and assets
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

import { useState, useEffect, useRef } from 'react';
import './App.css';

const DEFAULT_SECONDS = 10;
const DEFAULT_BG = '#1976d2';
const RED = '#d32f2f';
const SOUND_URL = 'https://cdn.pixabay.com/audio/2022/10/16/audio_12b6b1b2e7.mp3'; // Placeholder, replace if needed

function TimerJuego() {
  const [seconds, setSeconds] = useState(DEFAULT_SECONDS);
  const [running, setRunning] = useState(true);
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
      // Parpadeo entre rojo y blanco cada 400ms durante 5s
      flashInterval = setInterval(() => {
        setBgColor(prev => prev === RED ? '#fff' : RED);
        // Beep de tono descendente
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        // De agudo a grave: 1200Hz a 400Hz
        const freq = 1200 - flashCount * ((1200-400)/12);
        oscillator.type = 'sine';
        oscillator.frequency.value = freq;
        gain.gain.value = 0.2;
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start();
        oscillator.stop(context.currentTime + 0.18);
        oscillator.onended = () => context.close();
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
    const handleTouch = () => {
      setSeconds(DEFAULT_SECONDS);
      setBgColor(DEFAULT_BG);
      setFlash(false);
      setRunning(true);
    };
    window.addEventListener('touchstart', handleTouch);
    window.addEventListener('mousedown', handleTouch);
    return () => {
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('mousedown', handleTouch);
    };
  }, []);

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
  {/* El sonido ahora se genera con Web Audio API */}
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
        onClick={() => setRunning(false)}
        disabled={!running || seconds === 0}
      >
        Detener
      </button>
      <div style={{marginTop: '2rem', color: '#fff', fontSize: '1rem'}}>
        {seconds === 0
          ? 'Toca la pantalla para reiniciar el temporizador'
          : 'Toca la pantalla para reiniciar (solo si perdiste)'}
      </div>
    </div>
  );
}

export default TimerJuego;
