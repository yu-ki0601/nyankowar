import { useRef, useState, useCallback, useEffect, useMemo } from 'react';

// シングルトンAudioContext
let globalAudioCtx: AudioContext | null = null;

/**
 * 確実に音が鳴ることを最優先したサウンドシステム
 */
export const useGameAudio = () => {
  const bgmTimerRef = useRef<number | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const isAudioEnabledRef = useRef(true);

  // 設定をRefに同期
  useEffect(() => {
    isAudioEnabledRef.current = isAudioEnabled;
  }, [isAudioEnabled]);

  // コンテキストの取得と強制レジューム
  const getCtx = useCallback(() => {
    if (!globalAudioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      globalAudioCtx = new AudioContextClass();
    }
    if (globalAudioCtx.state === 'suspended') {
      globalAudioCtx.resume();
    }
    return globalAudioCtx;
  }, []);

  // BGM停止
  const stopBGM = useCallback(() => {
    if (bgmTimerRef.current !== null) {
      window.clearTimeout(bgmTimerRef.current);
      bgmTimerRef.current = null;
    }
  }, []);

  // BGM開始 (再帰的スケジューラ)
  const startBGM = useCallback(() => {
    stopBGM();
    const ctx = getCtx();
    let step = 0;
    const notes = [261.63, 329.63, 392.00, 349.23]; // C, E, G, F

    const playNextNote = () => {
      if (!isAudioEnabledRef.current) {
        bgmTimerRef.current = window.setTimeout(playNextNote, 400);
        return;
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(notes[step % 4], now);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.35);
      
      step++;
      bgmTimerRef.current = window.setTimeout(playNextNote, 400);
    };

    playNextNote();
  }, [getCtx, stopBGM]);

  // 即時SE再生 (同期処理)
  const playOscDirect = useCallback((f: number, type: OscillatorType, dur: number, vol: number) => {
    if (!isAudioEnabledRef.current) return;
    const ctx = getCtx();
    if (ctx.state !== 'running') return;

    const now = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, now);
    g.gain.setValueAtTime(vol, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(now);
    o.stop(now + dur);
  }, [getCtx]);

  // APIの提供
  return useMemo(() => ({
    isAudioEnabled,
    setIsAudioEnabled,
    initAudio: getCtx,
    startBGM,
    stopBGM,
    playSystemSE: (f: number) => playOscDirect(f, 'sine', 0.1, 0.05),
    playCharinSound: () => playOscDirect(2000, 'sine', 0.2, 0.1), // 少し音量アップ
    playGashiSound: () => playOscDirect(150, 'square', 0.1, 0.08), // 低音を上げ音量アップ
    playVictoryFanfare: () => {
      const ctx = getCtx(); const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'square'; o.frequency.setValueAtTime(f, now + i * 0.15);
        g.gain.setValueAtTime(0.05, now + i * 0.15); g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.4);
        o.connect(g); g.connect(ctx.destination); o.start(now + i * 0.15); o.stop(now + i * 0.15 + 0.4);
      });
    },
    playDefeatJingle: () => {
      const ctx = getCtx(); const now = ctx.currentTime;
      [261.63, 233.08, 207.65, 196.00].forEach((f, i) => {
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'sawtooth'; o.frequency.setValueAtTime(f, now + i * 0.3);
        g.gain.setValueAtTime(0.05, now + i * 0.3); g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.3 + 0.6);
        o.connect(g); g.connect(ctx.destination); o.start(now + i * 0.3); o.stop(now + i * 0.3 + 0.6);
      });
    },
    playCannonSound: () => {
      const ctx = getCtx(); const now = ctx.currentTime;
      const o1 = ctx.createOscillator(); const g1 = ctx.createGain();
      o1.type = 'sawtooth'; o1.frequency.setValueAtTime(100, now); o1.frequency.exponentialRampToValueAtTime(800, now + 0.5);
      g1.gain.setValueAtTime(0, now); g1.gain.linearRampToValueAtTime(0.1, now + 0.1); g1.gain.linearRampToValueAtTime(0, now + 0.5);
      o1.connect(g1); g1.connect(ctx.destination); o1.start(now); o1.stop(now + 0.5);
      const o2 = ctx.createOscillator(); const g2 = ctx.createGain();
      o2.type = 'square'; o2.frequency.setValueAtTime(60, now + 0.5); o2.frequency.exponentialRampToValueAtTime(10, now + 1.5);
      g2.gain.setValueAtTime(0.2, now + 0.5); g2.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
      o2.connect(g2); g2.connect(ctx.destination); o2.start(now + 0.5); o2.stop(now + 1.5);
    }
  }), [isAudioEnabled, getCtx, startBGM, stopBGM, playOscDirect]);
};
