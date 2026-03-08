import { type UnitStats } from '../../../types/game';

/**
 * 味方ユニット（ネコ）を描画する関数
 */
export const drawCat = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  stats: UnitStats,
  unitType: string,
  currentHp: number,
  timestamp: number
) => {
  const bob = Math.sin(timestamp / 50) * 5; 
  const curY = y + bob;

  ctx.save();
  ctx.translate(x, curY);
  
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.fillStyle = stats.color;

  if (unitType === 'TANK') {
    ctx.beginPath(); ctx.roundRect(-stats.radius * 0.8, -stats.radius * 2.5, stats.radius * 1.6, stats.radius * 2.8, 10); ctx.fill(); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.arc(0, 0, stats.radius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }

  ctx.fillStyle = (unitType === 'BATTLE') ? '#c0392b' : stats.color;
  const earY = unitType === 'TANK' ? -stats.radius * 2.5 : -stats.radius * 0.5;
  ctx.beginPath(); ctx.moveTo(-stats.radius * 0.6, earY); ctx.lineTo(-stats.radius * 1.0, earY - 15); ctx.lineTo(-stats.radius * 0.2, earY - 10); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(stats.radius * 0.6, earY); ctx.lineTo(stats.radius * 1.0, earY - 15); ctx.lineTo(stats.radius * 0.2, earY - 10); ctx.fill(); ctx.stroke();

  ctx.fillStyle = '#333';
  const eyeY = unitType === 'TANK' ? -stats.radius * 1.8 : -2;
  ctx.fillRect(-stats.radius * 0.4, eyeY, 3, 6);
  ctx.fillRect(stats.radius * 0.2, eyeY, 3, 6);

  ctx.lineWidth = 1;
  const whiskerY = unitType === 'TANK' ? -stats.radius * 1.5 : 5;
  ctx.beginPath(); ctx.moveTo(-stats.radius * 0.5, whiskerY); ctx.lineTo(-stats.radius * 1.2, whiskerY - 2); ctx.stroke();

  if (unitType === 'BATTLE') {
    ctx.save();
    ctx.translate(stats.radius * 0.8, 0);
    ctx.rotate(Math.sin(timestamp / 100) * 0.5);
    ctx.strokeStyle = '#5d4037'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(0, 10); ctx.lineTo(0, -30); ctx.stroke();
    ctx.fillStyle = '#95a5a6'; ctx.beginPath();
    ctx.moveTo(0, -30); ctx.quadraticCurveTo(25, -35, 20, -10); ctx.lineTo(0, -15); ctx.fill(); ctx.stroke();
    ctx.restore();
  }

  ctx.restore();

  const hpBarY = (unitType === 'TANK') ? curY - stats.radius * 2.8 : curY - stats.radius - 20;
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(x - 20, hpBarY, 40, 4);
  ctx.fillStyle = '#2ecc71'; 
  ctx.fillRect(x - 20, hpBarY, (currentHp / stats.hp) * 40, 4);
};
