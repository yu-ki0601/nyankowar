import { type UnitStats } from '../../../types/game';

/**
 * キモねこを描画する関数
 */
export const drawCatLegs = (ctx: CanvasRenderingContext2D, stats: UnitStats) => {
  const legLength = 100;
  
  // 足元の影 (足ごとに2つ)
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.beginPath(); ctx.ellipse(-15, 10, 10, 4, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(15, 10, 10, 4, 0, 0, Math.PI * 2); ctx.fill();

  ctx.save();
  ctx.translate(0, -legLength);

  // 1. 長い脚 (関節ディテール)
  ctx.strokeStyle = '#333'; ctx.lineWidth = 3;
  ctx.beginPath();
  // 左足
  ctx.moveTo(-8, 0); ctx.lineTo(-12, legLength/2); ctx.lineTo(-15, legLength);
  // 右足
  ctx.moveTo(8, 0); ctx.lineTo(12, legLength/2); ctx.lineTo(15, legLength);
  ctx.stroke();

  // 2. 胴体
  ctx.fillStyle = stats.color;
  ctx.beginPath(); ctx.arc(0, 0, stats.radius * 1.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  // 3. 耳
  ctx.beginPath();
  ctx.moveTo(-stats.radius * 0.6, -stats.radius * 0.5); ctx.lineTo(-stats.radius * 1.0, -stats.radius * 1.2); ctx.lineTo(-stats.radius * 0.2, -stats.radius * 1.0);
  ctx.moveTo(stats.radius * 0.6, -stats.radius * 0.5); ctx.lineTo(stats.radius * 1.0, -stats.radius * 1.2); ctx.lineTo(stats.radius * 0.2, -stats.radius * 1.0);
  ctx.fill(); ctx.stroke();

  // 4. 目 (虚無感のある表情)
  ctx.fillStyle = '#333';
  ctx.beginPath(); ctx.arc(-stats.radius * 0.4, 0, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(stats.radius * 0.4, 0, 2, 0, Math.PI * 2); ctx.fill();

  ctx.restore();
};
