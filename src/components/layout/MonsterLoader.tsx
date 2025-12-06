import React, { useState, useEffect, useRef } from 'react';

// --- ESTILOS CSS DEL LOADER (SVG Animations) ---
const loaderStyles = `
  /* CONFIGURACIÓN BÁSICA */
  .loader-wrapper {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to bottom, #023350ff, #000000);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      opacity: 1;
      transition: opacity 0.5s ease-out;
  }

  .loader-wrapper.fading { opacity: 0; }

  .loading-text {
      margin-top: 20px;
      color: white;
      font-size: 24px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-family: 'Segoe UI', sans-serif;
      animation: pulseText 1s infinite alternate;
  }

  /* --- ANIMACIONES SVG --- */
  
  /* 1. EL MONSTRUO MASTICANDO (Squash & Stretch) */
  .monster-group {
      transform-origin: center bottom;
      animation: monsterSquash 1.6s infinite ease-in-out;
  }

  /* 2. MANDÍBULA INFERIOR */
  .jaw-lower {
      transform-origin: 100px 110px; /* Pivote en la comisura */
      animation: jawChew 1.6s infinite ease-in-out;
  }

  /* 3. CEJAS (Expresión) */
  .eyebrows {
      animation: eyebrowsMad 1.6s infinite ease-in-out;
  }

  /* 4. BRAZOS */
  .arm-left {
      transform-origin: 30px 120px;
      animation: armGrabLeft 1.6s infinite ease-in-out;
  }
  .arm-right {
      transform-origin: 170px 120px;
      animation: armGrabRight 1.6s infinite ease-in-out;
  }

  /* 5. EL DVD Y SUS PEDAZOS */
  .dvd-group {
      animation: dvdMove 1.6s infinite linear;
  }
  
  .dvd-whole {
      animation: dvdBreakVisibility 1.6s infinite step-end;
  }
  
  .dvd-broken-pieces {
      opacity: 0;
      animation: dvdShatter 1.6s infinite linear;
  }

  /* 6. OJOS (Parpadeo ocasional) */
  .eyes-group {
      animation: blink 4s infinite;
      transform-origin: center;
  }
  .pupils {
      animation: lookTrack 1.6s infinite ease-in-out;
  }


  /* --- KEYFRAMES --- */

  /* El cuerpo se aplasta al morder */
  @keyframes monsterSquash {
      0%, 10% { transform: scale(1, 1); } /* Normal */
      40% { transform: scale(1.1, 0.9); } /* Aplastado (Bite) */
      60% { transform: scale(0.95, 1.05); } /* Rebote (Estirado) */
      100% { transform: scale(1, 1); }
  }

  /* La boca abre y cierra violentamente */
  @keyframes jawChew {
      0%, 10% { transform: rotate(0deg); } /* Cerrada/Relajada */
      25% { transform: rotate(25deg) translateY(10px); } /* Abierta (Anticipación) */
      40% { transform: rotate(-5deg) translateY(-5px); } /* MORDIDA (Cierra fuerte) */
      60% { transform: rotate(0deg); }
      100% { transform: rotate(0deg); }
  }

  /* Cejas se bajan al morder (Enojado) */
  @keyframes eyebrowsMad {
      0%, 20% { transform: translateY(0); }
      40% { transform: translateY(15px) rotate(5deg); } /* Enojado en el impacto */
      100% { transform: translateY(0); }
  }

  /* Brazos acercan la comida a la boca */
  @keyframes armGrabLeft {
      0% { transform: rotate(0deg); }
      25% { transform: rotate(-20deg); } /* Abre brazos */
      40% { transform: rotate(10deg); } /* Mete comida */
      100% { transform: rotate(0deg); }
  }
  @keyframes armGrabRight {
      0% { transform: rotate(0deg); }
      25% { transform: rotate(20deg); }
      40% { transform: rotate(-10deg); }
      100% { transform: rotate(0deg); }
  }

  /* Movimiento del DVD */
  @keyframes dvdMove {
      /* Ajustado: Sube mucho más alto (-25px) para entrar en la boca */
      0% { transform: translate(0, 50px) scale(0.8); opacity: 0; }
      15% { transform: translate(0, 10px) scale(1); opacity: 1; }
      40% { transform: translate(0, -25px); } /* LLEGA HASTA LA BOCA */
      41% { transform: translate(0, -25px); } 
      100% { transform: translate(0, -25px); opacity: 1; }
  }

  /* Visibilidad del DVD entero */
  @keyframes dvdBreakVisibility {
      0% { opacity: 1; }
      40% { opacity: 0; }
      100% { opacity: 0; }
  }

  /* Explosión de pedazos */
  @keyframes dvdShatter {
      /* Ajustado para coincidir con la nueva altura (-25px) */
      0%, 39% { opacity: 0; transform: translate(0, 10px) scale(1); }
      40% { opacity: 1; transform: translate(0, -25px); }
      80% { opacity: 1; }
      100% { opacity: 0; transform: translate(0, 60px) scale(0.5); }
  }

  /* Pedazos individuales saliendo disparados */
  .shard-1 { animation: shardFly1 1.6s infinite ease-out; }
  .shard-2 { animation: shardFly2 1.6s infinite ease-out; }
  .shard-3 { animation: shardFly3 1.6s infinite ease-out; }

  @keyframes shardFly1 { 40% { transform: translate(0,0) rotate(0); } 100% { transform: translate(-40px, 40px) rotate(-120deg); } }
  @keyframes shardFly2 { 40% { transform: translate(0,0) rotate(0); } 100% { transform: translate(0px, 60px) rotate(180deg); } }
  @keyframes shardFly3 { 40% { transform: translate(0,0) rotate(0); } 100% { transform: translate(40px, 40px) rotate(120deg); } }

  @keyframes pulseText { 0% { opacity: 0.6; } 100% { opacity: 1; } }
  @keyframes blink { 0%, 96%, 100% { transform: scaleY(1); } 98% { transform: scaleY(0.1); } }
  @keyframes lookTrack { 0%, 100% { transform: translate(0,0); } 25% { transform: translate(0, 5px); } 40% { transform: translate(0, 0); } }

  /* COLORES */
  .monster-skin { fill: #0a5f5f; }
  .monster-dark { fill: #063f3f; }
  .mouth-bg { fill: #a30000; }
  .tongue { fill: #ff5252; }
  .tooth { fill: #fffde7; stroke: #ccc; stroke-width: 1px; }
  .dvd-case { fill: #333; stroke: #111; stroke-width: 2px; }
  .dvd-tray { fill: #ddd; }
  .dvd-disc { fill: #eef; stroke: #ccc; }
`;

interface MonsterLoaderProps {
  isLoading: boolean;
  onFinished?: () => void;
}

const MonsterLoader: React.FC<MonsterLoaderProps> = ({ isLoading, onFinished }) => {
  const [mounted, setMounted] = useState(true);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedFadingRef = useRef(false);

  useEffect(() => {
    if (!isLoading && !hasStartedFadingRef.current) {
      hasStartedFadingRef.current = true;

      hideTimeoutRef.current = setTimeout(() => {
        setMounted(false);
        if (onFinished) {
          onFinished();
        }
      }, 500);
    }

    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };
  }, [isLoading, onFinished]);

  if (!mounted) return null;

  const isFading = !isLoading;

  return (
    <>
      <style>{loaderStyles}</style>
      <div className={`loader-wrapper ${isFading ? 'fading' : ''}`}>

        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          aria-labelledby="loader-title"
        >
          <title id="loader-title">Monstruo comiendo un lector DVD</title>

          <defs>
            <clipPath id="mouth-clip">
              <path d="M40,110 Q100,180 160,110 L160,125 Q100,200 40,125 Z" />
            </clipPath>
          </defs>

          <g className="monster-group">
            {/* --- BRAZO IZQUIERDO (Detrás) --- */}
            <g className="arm-left">
              <path d="M0,0 C-10,30 -20,60 -5,80 C5,90 25,85 25,70"
                className="monster-skin" stroke="#043333" strokeWidth="3" transform="translate(30, 90)" />
              <path d="M-5,80 L-10,85 M0,82 L-2,88 M5,80 L8,86" stroke="#fff" strokeWidth="2" transform="translate(30, 90)" />
            </g>
            <g className="arm-right">
              <path d="M0,0 C10,30 20,60 5,80 C-5,90 -25,85 -25,70"
                className="monster-skin" stroke="#043333" strokeWidth="3" transform="translate(170, 90)" />
              <path d="M5,80 L10,85 M0,82 L2,88 M-5,80 L-8,86" stroke="#fff" strokeWidth="2" transform="translate(170, 90)" />
            </g>

            {/* --- CUERPO (Peludo Spiky) --- */}
            <path className="monster-skin"
              d="M100,20 
                         C130,20 160,40 170,70 
                         C175,80 185,85 180,95
                         C185,105 175,115 180,125
                         C182,135 170,145 175,155
                         C170,170 140,180 100,180 
                         C60,180 30,170 25,155
                         C30,145 18,135 20,125
                         C25,115 15,105 20,95
                         C15,85 25,80 30,70
                         C40,40 70,20 100,20 Z"
              stroke="#043333" strokeWidth="3" />

            {/* Textura de pelo (Detalles) */}
            <path d="M100,25 L105,10 M90,28 L85,12 M110,28 L115,15" stroke="#0a5f5f" strokeWidth="4" strokeLinecap="round" />

            {/* --- CARA SUPERIOR --- */}
            <g className="face-upper">
              {/* Interior Boca (Fondo) */}
              <path d="M40,110 Q100,100 160,110 L160,120 Q100,110 40,120 Z" fill="#500000" />

              {/* Dientes Superiores */}
              <g transform="translate(0, 5)">
                <path className="tooth" d="M50,105 L55,120 L60,105 Z" />
                <path className="tooth" d="M65,105 L70,125 L75,105 Z" />
                <path className="tooth" d="M80,105 L87,128 L94,105 Z" /> {/* Colmillo central */}
                <path className="tooth" d="M106,105 L113,128 L120,105 Z" /> {/* Colmillo central */}
                <path className="tooth" d="M125,105 L130,125 L135,105 Z" />
                <path className="tooth" d="M140,105 L145,120 L150,105 Z" />
              </g>
            </g>

            {/* --- OJOS --- */}
            <g className="eyes-group">
              {/* Ojo Izquierdo */}
              <circle cx="70" cy="75" r="22" fill="white" stroke="#043333" strokeWidth="3" />
              {/* Ojo Derecho */}
              <circle cx="130" cy="75" r="22" fill="white" stroke="#043333" strokeWidth="3" />

              {/* Pupilas (Animadas) */}
              <g className="pupils">
                <circle cx="72" cy="75" r="8" fill="black" />
                <circle cx="75" cy="72" r="3" fill="white" /> {/* Brillo */}

                <circle cx="128" cy="75" r="8" fill="black" />
                <circle cx="131" cy="72" r="3" fill="white" /> {/* Brillo */}
              </g>

              {/* Cejas (Expresión) */}
              <g className="eyebrows">
                <path d="M45,50 Q70,40 90,55" stroke="#043333" strokeWidth="5" fill="none" strokeLinecap="round" />
                <path d="M110,55 Q130,40 155,50" stroke="#043333" strokeWidth="5" fill="none" strokeLinecap="round" />
              </g>
            </g>

            {/* --- MANDÍBULA INFERIOR (MÓVIL) --- */}
            <g className="jaw-lower">
              {/* Fondo Boca Inferior */}
              <path className="mouth-bg" d="M40,110 Q100,180 160,110 L140,135 Q130,100 50,125 Z" />

              {/* Lengua y dientes recortados */}
              <g clipPath="url(#mouth-clip)">
                {/* LENGUA: Subida (y=130 en vez de 140) */}
                <path className="tongue" d="M80,130 Q100,110 120,130 Q110,150 90,150 Z" />

                <g transform="translate(0, -5)">
                  <path className="tooth" d="M55,130 L60,115 L65,130 Z" />
                  <path className="tooth" d="M75,135 L80,110 L85,135 Z" />
                  <path className="tooth" d="M95,140 L100,110 L105,140 Z" />
                  <path className="tooth" d="M115,135 L120,110 L125,135 Z" />
                  <path className="tooth" d="M135,130 L140,115 L145,130 Z" />
                </g>
              </g>

              {/* LABIO INFERIOR */}
              <path className="monster-skin" d="M35,110 Q100,190 165,110 Q100,140 35,110 Z" stroke="#043333" strokeWidth="3" />
            </g>
          </g>

          {/* --- COMIDA: LECTOR DVD --- */}
          <g transform="translate(100, 140)">
            <g className="dvd-group">

              {/* DVD ENTERO */}
              <g className="dvd-whole">
                <rect x="-40" y="-10" width="80" height="20" rx="2" className="dvd-case" />
                <rect x="-30" y="-8" width="50" height="4" rx="1" fill="#111" /> {/* Ranura */}
                <circle cx="25" cy="0" r="2" fill="#2ecc71" /> {/* Luz Verde */}
                <circle cx="32" cy="0" r="2" fill="#e74c3c" /> {/* Luz Roja */}

                {/* Bandeja saliendo */}
                <rect x="-25" y="-5" width="40" height="2" fill="#aaa" />
                <ellipse cx="-5" cy="-5" rx="15" ry="5" className="dvd-disc" />
                <ellipse cx="-5" cy="-5" rx="3" ry="1" fill="#aaa" />
              </g>

              {/* DVD ROTO */}
              <g className="dvd-broken-pieces">
                {/* Pedazo 1 */}
                <g className="shard-1">
                  <path d="M-40,-10 L-20,-10 L-25,10 L-40,10 Z" className="dvd-case" />
                </g>
                {/* Pedazo 2 (Disco roto) */}
                <g className="shard-2">
                  <path d="M-10,-5 L10,-5 L5,5 L-15,5 Z" fill="#ddd" stroke="#999" />
                  <path d="M-5,-5 L5,-8 L0,0 Z" fill="#eef" />
                </g>
                {/* Pedazo 3 (Luces) */}
                <g className="shard-3">
                  <path d="M20,-10 L40,-10 L40,10 L15,10 Z" className="dvd-case" />
                  <circle cx="25" cy="0" r="2" fill="#2ecc71" />
                </g>
              </g>

            </g>
          </g>

        </svg>

        <div className="loading-text">Cargando...</div>
      </div>
    </>
  );
};

export default MonsterLoader;