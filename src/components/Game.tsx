import React, { useEffect, useRef, useState } from "react";

// ==========================================
// 定数・基本設定
// ==========================================
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;

/**
 * ユニットの基本性能を定義するインターフェース
 */
interface UnitStats {
  name: string;
  cost: number;
  hp: number;
  speed: number;
  damage: number;
  color: string;
  cooldown: number;
  radius: number;
  range: number;
}

/**
 * 各ユニット種別のステータス設定
 */
const UNIT_TYPES: Record<string, UnitStats> = {
  BASIC: {
    name: "にゃんこ",
    cost: 50,
    hp: 150,
    speed: 1.0,
    damage: 30,
    color: "#ffffff",
    cooldown: 2500,
    radius: 18,
    range: 60,
  },
  TANK: {
    name: "タンク",
    cost: 150,
    hp: 500,
    speed: 0.6,
    damage: 10,
    color: "#f0f0f0",
    cooldown: 6000,
    radius: 25,
    range: 35,
  },
  BATTLE: {
    name: "バトル",
    cost: 200,
    hp: 100,
    speed: 1.2,
    damage: 60,
    color: "#ffcccc",
    cooldown: 8000,
    radius: 18,
    range: 55,
  },
  ENEMY: {
    name: "わんこ",
    cost: 0,
    hp: 150,
    speed: 0.8,
    damage: 25,
    color: "#5d6d7e",
    cooldown: 0,
    radius: 18,
    range: 50,
  },
};

/**
 * ユニットインスタンスの定義
 */
interface Unit {
  id: number;
  x: number;
  y: number;
  type: "ally" | "enemy";
  unitType: string;
  stats: UnitStats;
  currentHp: number;
}

const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ゲームの全状態 (Ref: 高速物理演算用)
  const stateRef = useRef({
    money: 0,
    walletLevel: 1,
    baseHp: 1000,
    enemyBaseHp: 1000,
    units: [] as Unit[],
    cannonCharge: 0,
    isCannonFiring: false,
    nextUnitId: 0,
    enemySpawnTimer: 0,
    cooldowns: { BASIC: 0, TANK: 0, BATTLE: 0 } as Record<string, number>,
    lastTime: 0,
    lastAttackSoundTime: 0,
    gameState: "start" as "start" | "playing" | "victory" | "defeat",
    bgmTimerId: null as number | null,
  });

  // UI表示用のState (React State)
  const [ui, setUi] = useState({
    money: 0,
    walletLevel: 1,
    baseHp: 1000,
    enemyBaseHp: 1000,
    cannonCharge: 0,
    gameState: "start" as any,
    cooldownPercents: { BASIC: 100, TANK: 100, BATTLE: 100 },
  });

  const [isAudio, setIsAudio] = useState(true);
  const audioCtx = useRef<AudioContext | null>(null);

  // --- サウンド生成エンジン (Web Audio API) ---

  const initAudio = () => {
    if (!audioCtx.current)
      audioCtx.current = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
    if (audioCtx.current.state === "suspended") audioCtx.current.resume();
  };

  const startGame = () => {
    initAudio();
    stateRef.current.gameState = "playing";
    startBGM();
    playSystemSE(440);
  };

  const startBGM = () => {
    stopBGM();
    const ctx = audioCtx.current;
    if (!ctx) return;
    let step = 0;
    const notes = [261.63, 329.63, 392.0, 349.23];
    stateRef.current.bgmTimerId = window.setInterval(() => {
      if (!isAudio || ctx.state === "suspended") return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(notes[step % 4], now);
      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
      step++;
    }, 400);
  };

  const stopBGM = () => {
    if (stateRef.current.bgmTimerId !== null) {
      clearInterval(stateRef.current.bgmTimerId);
      stateRef.current.bgmTimerId = null;
    }
  };

  const playVictoryFanfare = () => {
    if (!isAudio || !audioCtx.current) return;
    const ctx = audioCtx.current;
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "square";
      o.frequency.setValueAtTime(f, now + i * 0.15);
      g.gain.setValueAtTime(0.05, now + i * 0.15);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.4);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(now + i * 0.15);
      o.stop(now + i * 0.15 + 0.4);
    });
  };

  const playDefeatJingle = () => {
    if (!isAudio || !audioCtx.current) return;
    const ctx = audioCtx.current;
    const now = ctx.currentTime;
    [261.63, 233.08, 207.65, 196.0].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(f, now + i * 0.3);
      g.gain.setValueAtTime(0.05, now + i * 0.3);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.3 + 0.6);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(now + i * 0.3);
      o.stop(now + i * 0.3 + 0.6);
    });
  };

  const playCannonSound = () => {
    if (!isAudio || !audioCtx.current) return;
    const ctx = audioCtx.current;
    const now = ctx.currentTime;
    const o1 = ctx.createOscillator();
    const g1 = ctx.createGain();
    o1.type = "sawtooth";
    o1.frequency.setValueAtTime(100, now);
    o1.frequency.exponentialRampToValueAtTime(800, now + 0.5);
    g1.gain.setValueAtTime(0, now);
    g1.gain.linearRampToValueAtTime(0.1, now + 0.1);
    g1.gain.linearRampToValueAtTime(0, now + 0.5);
    o1.connect(g1);
    g1.connect(ctx.destination);
    o1.start(now);
    o1.stop(now + 0.5);
    const o2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    o2.type = "square";
    o2.frequency.setValueAtTime(60, now + 0.5);
    o2.frequency.exponentialRampToValueAtTime(10, now + 1.5);
    g2.gain.setValueAtTime(0.2, now + 0.5);
    g2.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    o2.connect(g2);
    g2.connect(ctx.destination);
    o2.start(now + 0.5);
    o2.stop(now + 1.5);
  };

  const playSystemSE = (f: number) => {
    if (!isAudio || !audioCtx.current) return;
    const ctx = audioCtx.current;
    const now = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(f, now);
    g.gain.setValueAtTime(0.05, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(now);
    o.stop(now + 0.1);
  };

  const playCharinSound = () => {
    if (!isAudio || !audioCtx.current) return;
    const ctx = audioCtx.current;
    const now = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(2000, now);
    o.frequency.exponentialRampToValueAtTime(1500, now + 0.1);
    g.gain.setValueAtTime(0.08, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(now);
    o.stop(now + 0.2);
  };

  const playGashi = () => {
    if (!isAudio || !audioCtx.current) return;
    const ctx = audioCtx.current;
    const now = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "square";
    o.frequency.setValueAtTime(100, now);
    o.frequency.linearRampToValueAtTime(40, now + 0.1);
    g.gain.setValueAtTime(0.05, now);
    g.gain.linearRampToValueAtTime(0, now + 0.1);
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(now + 0.1);
  };

  // --- 高度な描画ロジック ---

  /**
   * キャラクター（ネコ・ワンコ）の描画
   */
  const drawUnit = (
    ctx: CanvasRenderingContext2D,
    unit: Unit,
    timestamp: number,
  ) => {
    const { x, y, stats, type, unitType } = unit;
    const bob = Math.sin(timestamp / 50) * 5; // 跳ねるアニメーション
    const curY = y + bob;

    ctx.save();
    ctx.translate(x, curY);
    if (type === "enemy") ctx.scale(-1, 1);

    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;

    if (type === "ally") {
      // --- ネコ陣営 ---
      ctx.fillStyle = stats.color;
      if (unitType === "TANK") {
        // タンクねこ (背を倍に)
        ctx.beginPath();
        ctx.roundRect(
          -stats.radius * 0.8,
          -stats.radius * 2.5,
          stats.radius * 1.6,
          stats.radius * 2.8,
          10,
        );
        ctx.fill();
        ctx.stroke();
      } else {
        // 通常・バトル
        ctx.beginPath();
        ctx.arc(0, 0, stats.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      // 耳
      ctx.fillStyle = unitType === "BATTLE" ? "#c0392b" : stats.color;
      const earY =
        unitType === "TANK" ? -stats.radius * 2.5 : -stats.radius * 0.5;
      ctx.beginPath();
      ctx.moveTo(-stats.radius * 0.6, earY);
      ctx.lineTo(-stats.radius * 1.0, earY - 15);
      ctx.lineTo(-stats.radius * 0.2, earY - 10);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(stats.radius * 0.6, earY);
      ctx.lineTo(stats.radius * 1.0, earY - 15);
      ctx.lineTo(stats.radius * 0.2, earY - 10);
      ctx.fill();
      ctx.stroke();
      // 目
      ctx.fillStyle = "#333";
      const eyeY = unitType === "TANK" ? -stats.radius * 1.8 : -2;
      ctx.fillRect(-stats.radius * 0.4, eyeY, 3, 6);
      ctx.fillRect(stats.radius * 0.2, eyeY, 3, 6);
      // ひげ
      ctx.lineWidth = 1;
      const whiskerY = unitType === "TANK" ? -stats.radius * 1.5 : 5;
      ctx.beginPath();
      ctx.moveTo(-stats.radius * 0.5, whiskerY);
      ctx.lineTo(-stats.radius * 1.2, whiskerY - 2);
      ctx.stroke();
      // 斧 (バトルのみ)
      if (unitType === "BATTLE") {
        ctx.save();
        ctx.translate(stats.radius * 0.8, 0);
        ctx.rotate(Math.sin(timestamp / 100) * 0.5);
        ctx.strokeStyle = "#5d4037";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, 10);
        ctx.lineTo(0, -30);
        ctx.stroke();
        ctx.fillStyle = "#95a5a6";
        ctx.beginPath();
        ctx.moveTo(0, -30);
        ctx.quadraticCurveTo(25, -35, 20, -10);
        ctx.lineTo(0, -15);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    } else {
      // --- ワンコ陣営 ---
      ctx.fillStyle = stats.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, stats.radius * 1.2, stats.radius, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#2c3e50"; // 耳
      ctx.beginPath();
      ctx.arc(-stats.radius * 0.8, -stats.radius * 0.5, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(stats.radius * 0.8, -stats.radius * 0.5, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#ff0000"; // 目
      ctx.beginPath();
      ctx.arc(stats.radius * 0.3, -5, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-stats.radius * 0.1, -5, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // ユニットHPバー
    const hpBarY =
      unitType === "TANK"
        ? curY - stats.radius * 2.8
        : curY - stats.radius - 20;
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(x - 20, hpBarY, 40, 4);
    ctx.fillStyle = type === "ally" ? "#2ecc71" : "#e74c3c";
    ctx.fillRect(x - 20, hpBarY, (unit.currentHp / stats.hp) * 40, 4);
  };

  // --- メインエンジン ---

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let requestID: number;

    const loop = (timestamp: number) => {
      const s = stateRef.current;
      if (!s.lastTime) s.lastTime = timestamp;
      let dt = timestamp - s.lastTime;
      if (dt > 100) dt = 100;
      s.lastTime = timestamp;

      if (s.gameState === "playing") update(dt / 1000, timestamp);
      draw(ctx, timestamp);

      setUi({
        money: Math.floor(s.money),
        walletLevel: s.walletLevel,
        baseHp: s.baseHp,
        enemyBaseHp: s.enemyBaseHp,
        cannonCharge: Math.floor(s.cannonCharge),
        gameState: s.gameState,
        cooldownPercents: {
          BASIC: 100 - (s.cooldowns.BASIC / UNIT_TYPES.BASIC.cooldown) * 100,
          TANK: 100 - (s.cooldowns.TANK / UNIT_TYPES.TANK.cooldown) * 100,
          BATTLE: 100 - (s.cooldowns.BATTLE / UNIT_TYPES.BATTLE.cooldown) * 100,
        },
      });
      requestID = requestAnimationFrame(loop);
    };

    const update = (dt: number, timestamp: number) => {
      const s = stateRef.current;
      s.money += (30 + s.walletLevel * 20) * dt;
      if (s.cannonCharge < 100)
        s.cannonCharge = Math.min(100, s.cannonCharge + dt * 3.3);
      Object.keys(s.cooldowns).forEach((k) => {
        const wasReady = s.cooldowns[k] <= 0;
        s.cooldowns[k] = Math.max(0, s.cooldowns[k] - dt * 1000);
        if (!wasReady && s.cooldowns[k] <= 0) playCharinSound();
      });
      s.enemySpawnTimer += dt * 1000;
      if (s.enemySpawnTimer > 4000) {
        spawnUnit("ENEMY", false);
        s.enemySpawnTimer = 0;
      }

      let battleOccurred = false;
      s.units = s.units
        .map((u) => {
          let dmgTaken = 0;
          let isAtk = false;
          s.units.forEach((other) => {
            if (
              other.type !== u.type &&
              Math.abs(other.x - u.x) < other.stats.range
            ) {
              dmgTaken += other.stats.damage * dt;
              isAtk = true;
            }
          });
          if (u.type === "ally" && u.x > CANVAS_WIDTH - 150) {
            s.enemyBaseHp = Math.max(0, s.enemyBaseHp - u.stats.damage * dt);
            if (s.enemyBaseHp <= 0 && s.gameState === "playing") {
              s.gameState = "victory";
              stopBGM();
              playVictoryFanfare();
            }
            isAtk = true;
          } else if (u.type === "enemy" && u.x < 150) {
            s.baseHp = Math.max(0, s.baseHp - u.stats.damage * dt);
            if (s.baseHp <= 0 && s.gameState === "playing") {
              s.gameState = "defeat";
              stopBGM();
              playDefeatJingle();
            }
            isAtk = true;
          }
          if (isAtk) battleOccurred = true;
          let nx = u.x;
          if (!isAtk)
            nx += u.stats.speed * (dt * 60) * (u.type === "ally" ? 1 : -1);
          return { ...u, x: nx, currentHp: u.currentHp - dmgTaken };
        })
        .filter((u) => u.currentHp > 0);

      if (battleOccurred && timestamp - s.lastAttackSoundTime > 300) {
        playGashi();
        s.lastAttackSoundTime = timestamp;
      }
    };

    const draw = (ctx: CanvasRenderingContext2D, timestamp: number) => {
      const s = stateRef.current;
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // 背景 (空・グラデーション)
      const sky = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      sky.addColorStop(0, "#85c1e9");
      sky.addColorStop(1, "#d6eaf8");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // 山
      ctx.fillStyle = "#5dade2";
      ctx.beginPath();
      ctx.moveTo(-50, CANVAS_HEIGHT - 50);
      ctx.lineTo(150, 100);
      ctx.lineTo(350, CANVAS_HEIGHT - 50);
      ctx.fill();
      ctx.fillStyle = "#3498db";
      ctx.beginPath();
      ctx.moveTo(200, CANVAS_HEIGHT - 50);
      ctx.lineTo(450, 150);
      ctx.lineTo(700, CANVAS_HEIGHT - 50);
      ctx.fill();

      // 雲 (ゆっくり流れる)
      const cloudX = ((timestamp / 100) % (CANVAS_WIDTH + 200)) - 100;
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      const drawCloud = (cx: number, cy: number) => {
        ctx.beginPath();
        ctx.arc(cx, cy, 20, 0, Math.PI * 2);
        ctx.arc(cx + 25, cy - 5, 25, 0, Math.PI * 2);
        ctx.arc(cx + 50, cy, 20, 0, Math.PI * 2);
        ctx.fill();
      };
      drawCloud(cloudX, 50);
      drawCloud(cloudX - 400, 80);

      // 地面
      ctx.fillStyle = "#229954";
      ctx.fillRect(0, CANVAS_HEIGHT - 55, CANVAS_WIDTH, 10);
      ctx.fillStyle = "#7d6608";
      ctx.fillRect(0, CANVAS_HEIGHT - 45, CANVAS_WIDTH, 45);

      // 城
      const drawCastle = (x: number, color: string, isAlly: boolean) => {
        ctx.fillStyle = color;
        ctx.fillRect(x, CANVAS_HEIGHT - 150, 80, 100);
        ctx.fillStyle = "#333";
        ctx.fillRect(x + 25, CANVAS_HEIGHT - 90, 30, 40); // 門
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x - 10, CANVAS_HEIGHT - 150);
        ctx.lineTo(x + 40, CANVAS_HEIGHT - 200);
        ctx.lineTo(x + 90, CANVAS_HEIGHT - 150);
        ctx.fill();
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + 40, CANVAS_HEIGHT - 200);
        ctx.lineTo(x + 40, CANVAS_HEIGHT - 230);
        ctx.stroke(); // 旗竿
        ctx.fillStyle = isAlly ? "#3498db" : "#e74c3c";
        ctx.fillRect(x + 40, CANVAS_HEIGHT - 230, 30, 20); // 旗
      };
      drawCastle(40, "#d5dbdb", true);
      drawCastle(CANVAS_WIDTH - 120, "#566573", false);

      // 城HPゲージ
      ctx.fillStyle = "#fff";
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1;
      ctx.fillRect(30, CANVAS_HEIGHT - 175, 100, 8);
      ctx.strokeRect(30, CANVAS_HEIGHT - 175, 100, 8);
      ctx.fillStyle = "#3498db";
      ctx.fillRect(30, CANVAS_HEIGHT - 175, (s.baseHp / 1000) * 100, 8);
      ctx.fillStyle = "#fff";
      ctx.fillRect(CANVAS_WIDTH - 130, CANVAS_HEIGHT - 175, 100, 8);
      ctx.strokeRect(CANVAS_WIDTH - 130, CANVAS_HEIGHT - 175, 100, 8);
      ctx.fillStyle = "#e74c3c";
      ctx.fillRect(
        CANVAS_WIDTH - 130,
        CANVAS_HEIGHT - 175,
        (s.enemyBaseHp / 1000) * 100,
        8,
      );

      // ユニットの描画
      s.units.forEach((u) => drawUnit(ctx, u, timestamp));

      // お金表示 (UI)
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.roundRect(10, 10, 180, 70, 10);
      ctx.fill();
      ctx.fillStyle = "#f1c40f";
      ctx.font = "bold 22px Arial";
      ctx.fillText(`$ ${Math.floor(s.money)}`, 25, 40);
      ctx.fillStyle = "#fff";
      ctx.font = "14px Arial";
      ctx.fillText(`Lv.${s.walletLevel} 働きネコ`, 25, 65);

      if (s.isCannonFiring) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.fillRect(100, CANVAS_HEIGHT - 100, CANVAS_WIDTH, 40);
        ctx.strokeStyle = "#f1c40f";
        ctx.lineWidth = 4;
        ctx.strokeRect(100, CANVAS_HEIGHT - 100, CANVAS_WIDTH, 40);
      }
    };

    const spawnUnit = (key: string, isAlly: boolean) => {
      const s = stateRef.current;
      const stats = UNIT_TYPES[key];
      s.units.push({
        id: s.nextUnitId++,
        x: isAlly ? 110 : CANVAS_WIDTH - 110,
        y: CANVAS_HEIGHT - 70,
        type: isAlly ? "ally" : "enemy",
        unitType: key,
        stats,
        currentHp: stats.hp,
      });
    };

    requestID = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(requestID);
      stopBGM();
    };
  }, []);

  // --- 外部操作 ---

  const handleSpawn = (type: string) => {
    const s = stateRef.current;
    if (s.money >= UNIT_TYPES[type].cost && s.cooldowns[type] <= 0) {
      s.money -= UNIT_TYPES[type].cost;
      s.cooldowns[type] = UNIT_TYPES[type].cooldown;
      s.units.push({
        id: s.nextUnitId++,
        x: 110,
        y: CANVAS_HEIGHT - 70,
        type: "ally",
        unitType: type,
        stats: UNIT_TYPES[type],
        currentHp: UNIT_TYPES[type].hp,
      });
      playSystemSE(660);
    }
  };

  const handleUpgrade = () => {
    const s = stateRef.current;
    const cost = s.walletLevel * 200;
    if (s.money >= cost && s.walletLevel < 8) {
      s.money -= cost;
      s.walletLevel++;
      playSystemSE(330);
    }
  };

  const handleCannon = () => {
    const s = stateRef.current;
    if (s.cannonCharge < 100 || s.isCannonFiring) return;
    s.isCannonFiring = true;
    s.cannonCharge = 0;
    playCannonSound();
    setTimeout(() => {
      s.units = s.units
        .map((u) =>
          u.type === "enemy"
            ? { ...u, currentHp: u.currentHp - 100, x: u.x + 100 }
            : u,
        )
        .filter((u) => u.currentHp > 0);
      setTimeout(() => (s.isCannonFiring = false), 500);
    }, 500);
  };

  return (
    <div
      style={{
        textAlign: "center",
        backgroundColor: "#ecf0f1",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      <h1>にゃんこ大戦争プロトタイプ</h1>
      <div
        style={{
          position: "relative",
          display: "inline-block",
          marginBottom: "20px",
        }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          style={{
            border: "6px solid #2c3e50",
            borderRadius: "15px",
            backgroundColor: "#fff",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          }}
        />
        {ui.gameState === "start" && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.8)",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "12px",
            }}
          >
            <h2 style={{ fontSize: "40px" }}>にゃんこ大戦争プロトタイプ</h2>
            <button
              onClick={startGame}
              style={{
                padding: "20px 60px",
                fontSize: "30px",
                cursor: "pointer",
                borderRadius: "50px",
                background: "#2ecc71",
                color: "#fff",
                border: "none",
                fontWeight: "bold",
                boxShadow: "0 6px #27ae60",
              }}
            >
              GAME START
            </button>
          </div>
        )}
        {(ui.gameState === "victory" || ui.gameState === "defeat") && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.7)",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "12px",
            }}
          >
            <h2
              style={{
                fontSize: "60px",
                color: ui.gameState === "victory" ? "#f1c40f" : "#e74c3c",
              }}
            >
              {ui.gameState.toUpperCase()}
            </h2>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "15px 40px",
                fontSize: "24px",
                cursor: "pointer",
                borderRadius: "8px",
                background: "#3498db",
                color: "#fff",
                border: "none",
              }}
            >
              RETRY
            </button>
          </div>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <button
          onClick={handleCannon}
          disabled={ui.cannonCharge < 100 || ui.gameState !== "playing"}
          style={{
            padding: "15px",
            width: "140px",
            background: ui.cannonCharge >= 100 ? "#e74c3c" : "#95a5a6",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          にゃんこ砲
          <br />({ui.cannonCharge}%)
        </button>
        <button
          onClick={handleUpgrade}
          disabled={
            ui.money < ui.walletLevel * 200 ||
            ui.walletLevel >= 8 ||
            ui.gameState !== "playing"
          }
          style={{
            padding: "15px",
            width: "150px",
            background: ui.walletLevel >= 8 ? "#95a5a6" : "#e67e22",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          働きネコ Lv.{ui.walletLevel}
          <br />
          (${ui.walletLevel * 200})
        </button>
        {["BASIC", "TANK", "BATTLE"].map((t) => {
          const percent = (ui as any).cooldownPercents[t];
          const isReady = percent >= 100 && ui.money >= UNIT_TYPES[t].cost;
          return (
            <button
              key={t}
              disabled={!isReady || ui.gameState !== "playing"}
              onClick={() => handleSpawn(t)}
              style={{
                padding: "15px",
                width: "140px",
                background: isReady
                  ? "#2ecc71"
                  : `linear-gradient(to top, #3498db ${percent}%, #95a5a6 ${percent}%)`,
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: isReady ? "pointer" : "default",
                fontWeight: "bold",
                overflow: "hidden",
              }}
            >
              {UNIT_TYPES[t].name}
              <br />
              (${UNIT_TYPES[t].cost})
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Game;
