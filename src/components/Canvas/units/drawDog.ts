import { type UnitStats } from '../../../types/game';

/**
 * 敵ユニット（わんこ）を描画する関数
 */
export const drawDog = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  stats: UnitStats,
  currentHp: number,
  timestamp: number
) => {
  const bob = Math.sin(timestamp / 50) * 5; 
  const curY = y + bob;

  ctx.save();
  ctx.translate(x, curY);
  ctx.scale(-1, 1);

  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.fillStyle = stats.color;

  ctx.beginPath(); ctx.ellipse(0, 0, stats.radius * 1.2, stats.radius, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  ctx.fillStyle = '#2c3e50';
  ctx.beginPath(); ctx.arc(-stats.radius * 0.8, -stats.radius * 0.5, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(stats.radius * 0.8, -stats.radius * 0.5, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  ctx.fillStyle = '#17202a';
  ctx.beginPath(); ctx.arc(stats.radius * 0.6, 5, 4, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#ff0000';
  ctx.beginPath(); ctx.arc(stats.radius * 0.3, -5, 4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(-stats.radius * 0.1, -5, 4, 0, Math.PI * 2); ctx.fill();

  ctx.restore();

  const hpBarY = curY - stats.radius - 20;
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(x - 20, hpBarY, 40, 4);
  ctx.fillStyle = '#e74c3c'; 
  ctx.fillRect(x - 20, hpBarY, (currentHp / stats.hp) * 40, 4);
};
