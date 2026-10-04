'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Flame,
  Sparkles,
  Volume2,
  VolumeX,
  Layers,
  ArrowRight,
  Clock,
  ShieldCheck,
  Compass,
  Sliders,
  Check,
  Copy,
  ExternalLink,
  ChevronRight,
  Radio,
  Zap,
  Calendar,
  Share2
} from 'lucide-react';

// Type definitions for Themes
type ThemeMode = 'noir' | 'washi' | 'solar' | 'cyber';

interface ThemeConfig {
  name: string;
  badge: string;
  bg: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentGlow: string;
  border: string;
  canvasParticle: string;
}

export default function Edition01() {
  // Theme state
  const [theme, setTheme] = useState<ThemeMode>('noir');

  // Interactive kinetic typography state
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [fontWeight, setFontWeight] = useState(700);
  const [morphScale, setMorphScale] = useState(1);

  // Audio engine state
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [ambientPlaying, setAmbientPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientOscRef = useRef<OscillatorNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);

  // Time & Streak state
  const [timeJakarta, setTimeJakarta] = useState('');
  const [timeUTC, setTimeUTC] = useState('');
  const [proofClaimed, setProofClaimed] = useState(false);
  const [tokenCopied, setTokenCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'manifesto' | 'playground' | 'roadmap'>('manifesto');

  // Canvas ref for fluid kinetic particles
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePos = useRef({ x: -1000, y: -1000 });

  // Theme palettes definitions
  const themes: Record<ThemeMode, ThemeConfig> = useMemo(() => ({
    noir: {
      name: 'Obsidian Noir',
      badge: 'ARCHITECT BATCH',
      bg: '#0a0b0e',
      cardBg: '#13151b',
      textPrimary: '#f8fafc',
      textSecondary: '#94a3b8',
      accent: '#f59e0b',
      accentGlow: 'rgba(245, 158, 11, 0.25)',
      border: 'rgba(245, 158, 11, 0.2)',
      canvasParticle: 'rgba(245, 158, 11, 0.45)',
    },
    washi: {
      name: 'Washi Paper & Moss',
      badge: 'KYOTO BOTANICAL',
      bg: '#f6f3eb',
      cardBg: '#ffffff',
      textPrimary: '#1a1f1d',
      textSecondary: '#526058',
      accent: '#2d6a4f',
      accentGlow: 'rgba(45, 106, 79, 0.2)',
      border: 'rgba(45, 106, 79, 0.18)',
      canvasParticle: 'rgba(45, 106, 79, 0.35)',
    },
    solar: {
      name: 'Solar Flare',
      badge: 'AEROSPACE KINETIC',
      bg: '#080a10',
      cardBg: '#101422',
      textPrimary: '#fdfdfd',
      textSecondary: '#8a99b5',
      accent: '#ff5e13',
      accentGlow: 'rgba(255, 94, 19, 0.28)',
      border: 'rgba(255, 94, 19, 0.25)',
      canvasParticle: 'rgba(255, 94, 19, 0.4)',
    },
    cyber: {
      name: 'Cyber Violet',
      badge: 'SYNTHETIC PULSE',
      bg: '#0c0b14',
      cardBg: '#161426',
      textPrimary: '#f3f0ff',
      textSecondary: '#9d94b8',
      accent: '#a855f7',
      accentGlow: 'rgba(168, 85, 247, 0.25)',
      border: 'rgba(168, 85, 247, 0.25)',
      canvasParticle: 'rgba(168, 85, 247, 0.4)',
    },
  }), []);

  const currentTheme = themes[theme];

  // Dual Clocks update loop
  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setTimeJakarta(
        now.toLocaleTimeString('id-ID', {
          timeZone: 'Asia/Jakarta',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' WIB'
      );
      setTimeUTC(
        now.toLocaleTimeString('en-GB', {
          timeZone: 'UTC',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' UTC'
      );
    };
    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  // Web Audio Click & Ambient Synthesizer
  const playTactileClick = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.03);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // audio error handling
    }
  };

  const toggleAmbientSound = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      if (ambientPlaying) {
        if (ambientGainRef.current) {
          ambientGainRef.current.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
          setTimeout(() => {
            if (ambientOscRef.current) ambientOscRef.current.stop();
            ambientOscRef.current = null;
            setAmbientPlaying(false);
          }, 800);
        }
      } else {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(110, ctx.currentTime); // 110 Hz warm analog tone

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 1.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime);
        ambientOscRef.current = osc;
        ambientGainRef.current = gain;
        setAmbientPlaying(true);
        setSoundEnabled(true);
      }
    } catch {
      // audio error handling
    }
  };

  // Fluid Particle Canvas Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = 42;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2.5 + 1.2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connecting lines between nearby particles
      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.strokeStyle = currentTheme.canvasParticle;
            ctx.globalAlpha = (1 - dist / 130) * 0.25;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Update & draw particles with mouse interaction
      particles.forEach((p) => {
        // Subtle mouse repulsion / attraction
        const mdx = mousePos.current.x - p.x;
        const mdy = mousePos.current.y - p.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 160) {
          p.x -= (mdx / mDist) * 0.8;
          p.y -= (mdy / mDist) * 0.8;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = currentTheme.accent;
        ctx.globalAlpha = 0.6;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentTheme]);

  // Track mouse coordinates for canvas interaction
  const handleMouseMove = (e: React.MouseEvent) => {
    mousePos.current = { x: e.clientX, y: e.clientY };
  };

  // Sovereign Confetti Fireworks generator
  const triggerConfetti = () => {
    playTactileClick();
    setProofClaimed(true);

    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = [currentTheme.accent, '#f59e0b', '#3b82f6', '#10b981', '#ec4899'];
    const confetti = Array.from({ length: 90 }, () => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 0.7) * 20,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 15,
      alpha: 1,
    }));

    let animationFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      confetti.forEach((c) => {
        c.x += c.vx;
        c.y += c.vy;
        c.vy += 0.55; // gravity
        c.rotation += c.vRot;
        c.alpha -= 0.015;

        if (c.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.rotate((c.rotation * Math.PI) / 180);
          ctx.fillStyle = c.color;
          ctx.globalAlpha = Math.max(0, c.alpha);
          ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.6);
          ctx.restore();
        }
      });

      if (alive) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(animationFrame);
        document.body.removeChild(canvas);
      }
    };
    animate();
  };

  const copyProofToken = () => {
    playTactileClick();
    navigator.clipboard.writeText('0xED01_7A9F42B1_STREAK_SOVEREIGN_CONFIRMED');
    setTokenCopied(true);
    setTimeout(() => setTokenCopied(false), 2500);
  };

  const sequentialRoadmap = [
    {
      edition: 'EDITION 01',
      title: 'The Kinetic Canvas',
      tag: 'LIVE // DEPLOYED',
      status: 'active',
      desc: 'Fluid particle dynamics, Web Audio tactile acoustic feedback, and sovereign theme matrix.',
      date: '2026-10-04',
    },
    {
      edition: 'EDITION 02',
      title: 'Spatial Geometry & Shaders',
      tag: 'QUEUED // DAY 2 BACKUP',
      status: 'queued',
      desc: '3D WebGL isometric wireframe projections, GLSL light dispersion, and spatial card tilt.',
      date: 'Ready on reserve',
    },
    {
      edition: 'EDITION 03',
      title: 'Algorithmic Typography Matrix',
      tag: 'QUEUED // DAY 3 BACKUP',
      status: 'queued',
      desc: 'Variable font morphing, mathematical Bézier curve manipulation, and tactile haptic sliders.',
      date: 'Ready on reserve',
    },
    {
      edition: 'EDITION 04',
      title: 'Harmonic Audio Synthesizer',
      tag: 'QUEUED // DAY 4 BACKUP',
      status: 'queued',
      desc: 'Custom Web Audio multi-oscillator synth pad with interactive frequency XY oscilloscope.',
      date: 'Ready on reserve',
    },
  ];

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        backgroundColor: currentTheme.bg,
        color: currentTheme.textPrimary,
        transition: 'background-color 0.4s ease, color 0.4s ease',
      }}
      className="relative min-h-screen font-sans overflow-x-hidden"
    >
      {/* Interactive Background Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
      />

      {/* Top Chrono HUD Status Bar */}
      <aside
        aria-label="Chrono HUD"
        style={{
          backgroundColor: currentTheme.cardBg,
          borderColor: currentTheme.border,
        }}
        className="sticky top-0 z-50 border-b backdrop-blur-md bg-opacity-80 px-6 py-2.5 flex items-center justify-between text-xs tracking-wider"
      >
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Streak Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold"
                 style={{ backgroundColor: currentTheme.accentGlow, color: currentTheme.accent }}>
              <Flame className="w-3.5 h-3.5 animate-pulse" />
              <span>STREAK ANCHOR: DAY 01</span>
            </div>
            <span className="hidden md:inline text-[11px] opacity-60 font-mono">
              // SOVEREIGN RELEASE ENGINE
            </span>
          </div>

          {/* Real-time Dual Clocks & Sound Controls */}
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <div className="flex items-center gap-1 opacity-70">
              <Clock className="w-3 h-3" />
              <span>{timeJakarta || '00:00:00 WIB'}</span>
              <span className="opacity-40">|</span>
              <span>{timeUTC || '00:00:00 UTC'}</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                toggleAmbientSound();
                playTactileClick();
              }}
              style={{
                borderColor: currentTheme.border,
                color: ambientPlaying ? currentTheme.accent : currentTheme.textSecondary,
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border hover:opacity-100 transition"
              title="Toggle Web Audio Ambient Tone"
            >
              {ambientPlaying ? <Volume2 className="w-3 h-3 animate-pulse" /> : <VolumeX className="w-3 h-3" />}
              <span>{ambientPlaying ? 'AMBIENT ON' : 'SOUND OFF'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 space-y-20">
        
        {/* Header Branding */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-8"
                style={{ borderColor: currentTheme.border }}>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono tracking-widest uppercase font-bold"
                    style={{ color: currentTheme.accent }}>
                DAILY CRAFT // ISSUE N° 01
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono border"
                    style={{ borderColor: currentTheme.border, color: currentTheme.textSecondary }}>
                SERIAL: ED-01-KINETIC
              </span>
            </div>

            <h1
              style={{
                letterSpacing: `${letterSpacing}px`,
                fontWeight: fontWeight,
                transform: `scale(${morphScale})`,
                transformOrigin: 'left center',
                transition: 'letter-spacing 0.1s ease, font-weight 0.1s ease, transform 0.1s ease',
              }}
              className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[0.95]"
            >
              AURA
            </h1>

            <p className="text-base sm:text-lg max-w-2xl font-light opacity-80 leading-relaxed">
              Sebuah eksperimen digital harian yang dirancang luwes, hidup, dan bebas dari kebekuan template korporat. Dibuat dengan interaksi fisika mikro, Web Audio sintetis, dan komitmen streak harian yang tidak akan pernah padam.
            </p>
          </div>

          {/* Theme Palette Matrix Picker */}
          <div className="flex flex-col gap-2 p-3 rounded-2xl border"
               style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.border }}>
            <span className="text-[10px] font-mono tracking-wider opacity-60 uppercase">
              SELECT MOOD PALETTE
            </span>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(themes) as ThemeMode[]).map((tKey) => (
                <button
                  key={tKey}
                  onClick={() => {
                    setTheme(tKey);
                    playTactileClick();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center justify-between gap-2 border transition ${
                    theme === tKey ? 'font-bold' : 'opacity-60 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: theme === tKey ? currentTheme.accentGlow : 'transparent',
                    borderColor: theme === tKey ? currentTheme.accent : 'transparent',
                    color: theme === tKey ? currentTheme.accent : currentTheme.textPrimary,
                  }}
                >
                  <span>{themes[tKey].name}</span>
                  {theme === tKey && <Check className="w-3 h-3" />}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav aria-label="Edition Sections" className="flex items-center gap-2 p-1.5 rounded-full border max-w-fit"
             style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.border }}>
          {[
            { id: 'manifesto', label: 'MANIFESTO', icon: Sparkles },
            { id: 'playground', label: 'TYPO EXPERIMENTER', icon: Sliders },
            { id: 'roadmap', label: 'SEQUENTIAL RESERVE', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as 'manifesto' | 'playground' | 'roadmap');
                  playTactileClick();
                }}
                className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-mono tracking-wider transition"
                style={{
                  backgroundColor: active ? currentTheme.accent : 'transparent',
                  color: active ? '#000000' : currentTheme.textPrimary,
                  fontWeight: active ? 700 : 500,
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Tab 1: Manifesto & Digital Collectible */}
        {activeTab === 'manifesto' && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Card: Anti-Slop Manifesto */}
            <div
              style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.border }}
              className="lg:col-span-7 p-8 rounded-3xl border shadow-xl space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b"
                   style={{ borderColor: currentTheme.border }}>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" style={{ color: currentTheme.accent }} />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider">
                    PRINCIPLE OF ANTI-STIFFNESS
                  </span>
                </div>
                <span className="text-[11px] font-mono opacity-50">EDITION // 01</span>
              </div>

              <div className="space-y-4 text-sm sm:text-base leading-relaxed opacity-90 font-light">
                <p>
                  Sebagian besar landing page modern terasa kaku karena dirancang seperti brosur PDF yang dipaksa jadi HTML. Kering, prediktif, dan dipenuhi oleh placeholder korporat tanpa jiwa.
                </p>
                <p>
                  <strong className="font-semibold text-white">AURA Edition 01</strong> dibangun dengan paradigma kebalikannya:
                  tiap elemen memiliki massa mikro, partikel latar bereaksi terhadap pergerakan kursor Anda, palet dapat dimutasi secara instan, dan seluruh arsitekturnya dirancang sebagai <em>living canvas</em>.
                </p>
                <p>
                  Yang terpenting: proyek ini adalah jangkar serial harian. Setiap hari memiliki nomor edisi berurutan, siap dipush dan dirilis sehingga api kontribusi Anda tetap menyala abadi.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-2xl border"
                     style={{ borderColor: currentTheme.border, backgroundColor: currentTheme.bg }}>
                  <div className="text-2xl font-mono font-bold" style={{ color: currentTheme.accent }}>01/100</div>
                  <div className="text-xs opacity-60 mt-1 font-mono">Sequential Drop</div>
                </div>
                <div className="p-4 rounded-2xl border"
                     style={{ borderColor: currentTheme.border, backgroundColor: currentTheme.bg }}>
                  <div className="text-2xl font-mono font-bold" style={{ color: currentTheme.accent }}>100%</div>
                  <div className="text-xs opacity-60 mt-1 font-mono">Client Sovereign</div>
                </div>
                <div className="p-4 rounded-2xl border col-span-2 sm:col-span-1"
                     style={{ borderColor: currentTheme.border, backgroundColor: currentTheme.bg }}>
                  <div className="text-2xl font-mono font-bold" style={{ color: currentTheme.accent }}>ZERO</div>
                  <div className="text-xs opacity-60 mt-1 font-mono">AI Slop Clichés</div>
                </div>
              </div>
            </div>

            {/* Right Card: Interactive Proof / Digital Artifact */}
            <div
              style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.border }}
              className="lg:col-span-5 p-8 rounded-3xl border shadow-2xl space-y-6 relative overflow-hidden"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono tracking-widest uppercase opacity-60">
                    CRYPTOGRAPHIC PROOF OF DAY 01
                  </span>
                  <div className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: currentTheme.accent }} />
                </div>
                <h3 className="text-2xl font-bold font-mono">Proof of Craft #01</h3>
              </div>

              {/* Holographic Spec Card */}
              <div
                style={{
                  borderColor: currentTheme.border,
                  background: `linear-gradient(135deg, ${currentTheme.cardBg} 0%, ${currentTheme.bg} 100%)`,
                }}
                className="p-6 rounded-2xl border space-y-4 font-mono text-xs"
              >
                <div className="flex justify-between items-center text-white/50">
                  <span>HASH VERIFIER</span>
                  <button onClick={copyProofToken} className="hover:text-white flex items-center gap-1">
                    {tokenCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{tokenCopied ? 'COPIED' : 'COPY'}</span>
                  </button>
                </div>
                <div className="p-3 rounded-lg bg-black/40 text-[11px] text-[#f59e0b] break-all border border-white/5 font-mono">
                  0xED01_7A9F42B1_STREAK_SOVEREIGN_CONFIRMED
                </div>

                <div className="divide-y divide-white/10 text-[11px]">
                  <div className="py-2 flex justify-between">
                    <span className="opacity-50">RELEASE ID:</span>
                    <span className="font-bold">EDITION-01-KINETIC</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="opacity-50">TIMESTAMP:</span>
                    <span>2026-10-04 // 23:45 WIB</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="opacity-50">ENGINE:</span>
                    <span>Next.js 15 + Tailwind v4</span>
                  </div>
                </div>
              </div>

              {/* Claim Action Button */}
              <button
                onClick={triggerConfetti}
                style={{
                  backgroundColor: currentTheme.accent,
                  color: '#000000',
                }}
                className="w-full py-4 rounded-2xl font-bold font-mono text-sm tracking-wider transition hover:opacity-90 shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>{proofClaimed ? 'ARTIFACT CLAIMED // BLAST AGAIN' : 'CLAIM DAY 01 ARTIFACT PROOF'}</span>
              </button>

              {proofClaimed && (
                <div className="text-center text-xs font-mono text-emerald-400 animate-pulse">
                  ✓ Verified: Day 01 Commit Token Activated
                </div>
              )}
            </div>

          </section>
        )}

        {/* Tab 2: Interactive Kinetic Typography Experimenter */}
        {activeTab === 'playground' && (
          <section
            style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.border }}
            className="p-8 rounded-3xl border shadow-xl space-y-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b"
                 style={{ borderColor: currentTheme.border }}>
              <div>
                <h3 className="text-2xl font-bold font-mono">Kinetic Typography Matrix</h3>
                <p className="text-xs opacity-60 font-mono mt-1">
                  Manipulate real-time CSS geometry variables on the headline
                </p>
              </div>
              <button
                onClick={() => {
                  setLetterSpacing(0);
                  setFontWeight(700);
                  setMorphScale(1);
                  playTactileClick();
                }}
                className="px-3 py-1.5 rounded-lg border text-xs font-mono opacity-70 hover:opacity-100"
                style={{ borderColor: currentTheme.border }}
              >
                RESET VALUES
              </button>
            </div>

            {/* Live Interactive Specimen Display */}
            <div
              style={{ backgroundColor: currentTheme.bg, borderColor: currentTheme.border }}
              className="p-12 rounded-2xl border text-center flex flex-col items-center justify-center min-h-[220px] overflow-hidden"
            >
              <div
                style={{
                  letterSpacing: `${letterSpacing}px`,
                  fontWeight: fontWeight,
                  transform: `scale(${morphScale})`,
                  color: currentTheme.accent,
                  transition: 'letter-spacing 0.15s ease, font-weight 0.15s ease, transform 0.15s ease',
                }}
                className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight select-none"
              >
                DYNAMIC FORM
              </div>
              <span className="text-[11px] font-mono opacity-40 mt-4">
                WEIGHT: {fontWeight} • TRACKING: {letterSpacing}PX • SCALE: {morphScale}X
              </span>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span>Tracking / Spacing</span>
                  <span style={{ color: currentTheme.accent }}>{letterSpacing}px</span>
                </div>
                <input
                  type="range"
                  min="-2"
                  max="24"
                  value={letterSpacing}
                  onChange={(e) => {
                    setLetterSpacing(parseInt(e.target.value));
                    playTactileClick();
                  }}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span>Font Weight</span>
                  <span style={{ color: currentTheme.accent }}>{fontWeight}</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="900"
                  step="100"
                  value={fontWeight}
                  onChange={(e) => {
                    setFontWeight(parseInt(e.target.value));
                    playTactileClick();
                  }}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span>Kinetic Scale</span>
                  <span style={{ color: currentTheme.accent }}>{morphScale}x</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.3"
                  step="0.05"
                  value={morphScale}
                  onChange={(e) => {
                    setMorphScale(parseFloat(e.target.value));
                    playTactileClick();
                  }}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          </section>
        )}

        {/* Tab 3: Sequential Roadmap (Antisipasi Kalau Kelewat 1 Hari) */}
        {activeTab === 'roadmap' && (
          <section className="space-y-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase mb-2"
                   style={{ color: currentTheme.accent }}>
                <Calendar className="w-4 h-4" />
                <span>SEQUENTIAL DAILY RELEASE REPOSITORY</span>
              </div>
              <h3 className="text-3xl font-bold font-mono">Katalog Rilis Berurutan</h3>
              <p className="text-sm opacity-70 mt-2 font-light">
                Dirancang spesifik untuk mengamankan streak Anda. Jika sewaktu-waktu terlewat 1 hari,
                Anda tinggal merilis edisi berurutan berikutnya (`edition-02`, `edition-03`, dst.)
                sehingga portofolio dan grafik kontribusi GitHub Anda selalu rapi dan berkesinambungan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sequentialRoadmap.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: currentTheme.cardBg,
                    borderColor: item.status === 'active' ? currentTheme.accent : currentTheme.border,
                  }}
                  className={`p-6 rounded-3xl border flex flex-col justify-between space-y-4 transition ${
                    item.status === 'active' ? 'ring-1 ring-amber-500 shadow-xl' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-mono font-bold tracking-widest"
                          style={{ color: item.status === 'active' ? currentTheme.accent : currentTheme.textSecondary }}>
                      {item.edition}
                    </span>
                    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
                      item.status === 'active' 
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold' 
                        : 'border-white/10 opacity-60'
                    }`}>
                      {item.tag}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold">{item.title}</h4>
                    <p className="text-xs opacity-70 mt-2 leading-relaxed">{item.desc}</p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono border-t pt-4"
                       style={{ borderColor: currentTheme.border }}>
                    <span className="opacity-50">{item.date}</span>
                    <span className="flex items-center gap-1 font-bold" style={{ color: currentTheme.accent }}>
                      {item.status === 'active' ? 'VIEWING NOW' : 'BLUEPRINT READY'}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer
          style={{ borderColor: currentTheme.border }}
          className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono opacity-60"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentTheme.accent }} />
            <span>AURA // EDITION 01</span>
            <span>• SOVEREIGN NEXT.JS STATIC EXPORT</span>
          </div>
          <div>
            Built with zero AI slop • Autonomous Daily Release Architecture
          </div>
        </footer>

      </main>
    </div>
  );
}
