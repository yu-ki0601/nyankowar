import { type UnitStats } from '../../../types/game';

export const drawCatTank = (ctx: CanvasRenderingContext2D, stats: UnitStats) => {
  // 足元の影 (横長)
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.beginPath(); ctx.ellipse(0, 10, stats.radius * 1.2, 6, 0, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = stats.color;
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 3;
  
  // 縦長い体
  ctx.beginPath(); ctx.roundRect(-stats.radius * 0.8, -stats.radius * 2.5, stats.radius * 1.6, stats.radius * 2.8, 12); ctx.fill(); ctx.stroke();
  
  // 耳 (高い位置)
  const earY = -stats.radius * 2.5;
  ctx.beginPath();
  ctx.moveTo(-stats.radius * 0.6, earY); ctx.lineTo(-stats.radius * 1.0, earY - 15); ctx.lineTo(-stats.radius * 0.2, earY - 10);
  ctx.moveTo(stats.radius * 0.6, earY); ctx.lineTo(stats.radius * 1.0, earY - 15); ctx.lineTo(stats.radius * 0.2, earY - 10);
  ctx.fill(); ctx.stroke();
  
  // 目 (眠そうな細い目)
  ctx.fillStyle = '#333';
  const eyeY = -stats.radius * 1.8;
  ctx.fillRect(-stats.radius * 0.4, eyeY, 4, 3); ctx.fillRect(stats.radius * 0.1, eyeY, 4, 3);
};
