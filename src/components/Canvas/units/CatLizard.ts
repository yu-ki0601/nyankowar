import { type UnitStats } from '../../../types/game';

/**
 * ネコトカゲを描画する関数
 */
export const drawCatLizard = (ctx: CanvasRenderingContext2D, stats: UnitStats, timestamp: number) => {
  // 足元の影
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.beginPath(); ctx.ellipse(0, 15, stats.radius * 2, 6, 0, 0, Math.PI * 2); ctx.fill();

  ctx.save();
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2.5;
  ctx.fillStyle = stats.color;

  // 1. しなる長い尻尾
  const tailSwing = Math.sin(timestamp / 80) * 10;
  ctx.beginPath();
  ctx.moveTo(-15, 0);
  ctx.quadraticCurveTo(-45, -35 + tailSwing, -70, 10 + tailSwing);
  ctx.stroke();

  // 2. 胴体
  ctx.beginPath();
  ctx.ellipse(0, 5, stats.radius * 1.8, stats.radius * 0.8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 3. 背中のトゲ
  ctx.fillStyle = '#1e8449';
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(-15 + i * 15, -2);
    ctx.lineTo(-7 + i * 15, -18);
    ctx.lineTo(0 + i * 15, -2);
    ctx.fill();
    ctx.stroke();
  }

  // 4. 頭部
  ctx.fillStyle = stats.color;
  ctx.beginPath();
  ctx.arc(stats.radius * 1.6, -8, stats.radius * 0.75, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 5. ネコ耳
  ctx.beginPath();
  ctx.moveTo(stats.radius * 1.3, -14); ctx.lineTo(stats.radius * 1.0, -24); ctx.lineTo(stats.radius * 1.7, -18);
  ctx.moveTo(stats.radius * 1.9, -14); ctx.lineTo(stats.radius * 2.2, -24); ctx.lineTo(stats.radius * 1.5, -18);
  ctx.fill();
  ctx.stroke();

  // 6. 目 (光あり)
  ctx.fillStyle = '#333';
  ctx.beginPath(); ctx.arc(stats.radius * 1.9, -10, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(stats.radius * 1.95, -11, 1, 0, Math.PI * 2); ctx.fill();

  ctx.restore();
};
