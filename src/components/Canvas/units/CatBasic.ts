import { type UnitStats } from '../../../types/game';

export const drawCatBasic = (ctx: CanvasRenderingContext2D, stats: UnitStats) => {
  // 足元の影
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.beginPath(); ctx.ellipse(0, 15, stats.radius, 5, 0, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = stats.color;
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2.5;
  
  // 体
  ctx.beginPath(); ctx.arc(0, 0, stats.radius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  
  // 耳
  ctx.beginPath();
  ctx.moveTo(-stats.radius * 0.6, -stats.radius * 0.5); ctx.lineTo(-stats.radius * 1.1, -stats.radius * 1.3); ctx.lineTo(-stats.radius * 0.2, -stats.radius * 1.0);
  ctx.moveTo(stats.radius * 0.6, -stats.radius * 0.5); ctx.lineTo(stats.radius * 1.1, -stats.radius * 1.3); ctx.lineTo(stats.radius * 0.2, -stats.radius * 1.0);
  ctx.fill(); ctx.stroke();
  
  // 目 (光あり)
  ctx.fillStyle = '#333';
  ctx.fillRect(-stats.radius * 0.4, -3, 3, 7); ctx.fillRect(stats.radius * 0.2, -3, 3, 7);
  ctx.fillStyle = '#fff';
  ctx.fillRect(-stats.radius * 0.4, -2, 1, 2); ctx.fillRect(stats.radius * 0.2, -2, 1, 2);
};
