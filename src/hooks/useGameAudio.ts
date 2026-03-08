import { useRef, useState } from 'react';

/**
 * ゲームのサウンドシステムを管理するカスタムフック
 * 
 * Web Audio API を使用して、外部音声ファイルなしでBGMやSEを動的に生成します。
 */
export const useGameAudio = () => {
  const audioCtx = useRef<AudioContext | null>(null);
  const bgmTimerId = useRef<number | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  /**
   * ブラウザの音声エンジンを初期化
   * ※ユーザー操作（クリック等）のタイミングで呼び出す必要があります。
   */
  const initAudio = () => {
    if (!audioCtx.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtx.current = new AudioContextClass();
    }
    if (audioCtx.current.state === 'suspended') audioCtx.current.resume();
  };

  /**
   * 8bit風のBGMループを開始
   */
  const startBGM = () => {
    stopBGM();
    const ctx = audioCtx.current; if (!ctx) return;
    let step = 0;
    const notes = [261.63, 329.63, 392.00, 349.23]; // ド、ミ、ソ、ファ
    bgmTimerId.current = window.setInterval(() => {
      if (!isAudioEnabled || ctx.state === 'suspended') return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.type = 'triangle'; // 柔らかい三角波
      osc.frequency.setValueAtTime(notes[step % 4], now);
      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.3);
      step++;
    }, 400);
  };

  /**
   * BGMを停止
   */
  const stopBGM = () => {
    if (bgmTimerId.current !== null) {
      clearInterval(bgmTimerId.current);
      bgmTimerId.current = null;
    }
  };

  /**
   * 汎用的なシステム効果音 (召喚音など)
   */
  const playSystemSE = (f: number, dur = 0.1, vol = 0.05) => {
    if (!isAudioEnabled || !audioCtx.current) return;
    const ctx = audioCtx.current; const now = ctx.currentTime;
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = 'sine'; // 澄んだサイン波
    o.frequency.setValueAtTime(f, now); g.gain.setValueAtTime(vol, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur); o.connect(g); g.connect(ctx.destination);
    o.start(now); o.stop(now + dur);
  };

  /**
   * ゲージ満タン時の「チャリン」音
   */
  const playCharinSound = () => {
    if (!isAudioEnabled || !audioCtx.current) return;
    const ctx = audioCtx.current; const now = ctx.currentTime;
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(2000, now);
    o.frequency.exponentialRampToValueAtTime(1500, now + 0.1);
    g.gain.setValueAtTime(0.08, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    o.connect(g); g.connect(ctx.destination);
    o.start(now); o.stop(now + 0.2);
  };

  /**
   * 戦闘中の打撃音 (ガシッ)
   */
  const playGashiSound = () => {
    if (!isAudioEnabled || !audioCtx.current) return;
    const ctx = audioCtx.current; const now = ctx.currentTime;
    // 低音の衝撃波
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = 'square';
    o.frequency.setValueAtTime(100, now);
    o.frequency.linearRampToValueAtTime(40, now + 0.1);
    g.gain.setValueAtTime(0.05, now);
    g.gain.linearRampToValueAtTime(0, now + 0.1);
    o.connect(g); g.connect(ctx.destination); o.start(); o.stop(now + 0.1);
  };

  /**
   * 勝利時のファンファーレ
   */
  const playVictoryFanfare = () => {
    if (!isAudioEnabled || !audioCtx.current) return;
    const ctx = audioCtx.current; const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = 'square'; o.frequency.setValueAtTime(f, now + i * 0.15);
      g.gain.setValueAtTime(0.05, now + i * 0.15); g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.4);
      o.connect(g); g.connect(ctx.destination);
      o.start(now + i * 0.15); o.stop(now + i * 0.15 + 0.4);
    });
  };

  /**
   * 敗北時のジングル
   */
  const playDefeatJingle = () => {
    if (!isAudioEnabled || !audioCtx.current) return;
    const ctx = audioCtx.current; const now = ctx.currentTime;
    [261.63, 233.08, 207.65, 196.00].forEach((f, i) => {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = 'sawtooth'; o.frequency.setValueAtTime(f, now + i * 0.3);
      g.gain.setValueAtTime(0.05, now + i * 0.3); g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.3 + 0.6);
      o.connect(g); g.connect(ctx.destination);
      o.start(now + i * 0.3); o.stop(now + i * 0.3 + 0.6);
    });
  };

  /**
   * にゃんこ砲発射音 (充填 + 爆発)
   */
  const playCannonSound = () => {
    if (!isAudioEnabled || !audioCtx.current) return;
    const ctx = audioCtx.current; const now = ctx.currentTime;
    // ウィィィンという充填音
    const o1 = ctx.createOscillator(); const g1 = ctx.createGain();
    o1.type = 'sawtooth'; o1.frequency.setValueAtTime(100, now); o1.frequency.exponentialRampToValueAtTime(800, now + 0.5);
    g1.gain.setValueAtTime(0, now); g1.gain.linearRampToValueAtTime(0.1, now + 0.1); g1.gain.linearRampToValueAtTime(0, now + 0.5);
    o1.connect(g1); g1.connect(ctx.destination); o1.start(now); o1.stop(now + 0.5);
    // ドォォォンという爆発音
    const o2 = ctx.createOscillator(); const g2 = ctx.createGain();
    o2.type = 'square'; o2.frequency.setValueAtTime(60, now + 0.5); o2.frequency.exponentialRampToValueAtTime(10, now + 1.5);
    g2.gain.setValueAtTime(0.2, now + 0.5); g2.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    o2.connect(g2); g2.connect(ctx.destination); o2.start(now + 0.5); o2.stop(now + 1.5);
  };

  return {
    isAudioEnabled, setIsAudioEnabled, initAudio, startBGM, stopBGM,
    playSystemSE, playCharinSound, playGashiSound, playVictoryFanfare, playDefeatJingle, playCannonSound
  };
};
