import { type UnitStats } from '../../../types/game';

export const drawCatFish = (ctx: CanvasRenderingContext2D, stats: UnitStats) => {
  // 足元の影
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.beginPath(); ctx.ellipse(0, 15, stats.radius * 1.5, 5, 0, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = stats.color;
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2.5;
  
  // 魚の体
  ctx.beginPath(); ctx.ellipse(0, 0, stats.radius * 1.5, stats.radius, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  
  // 尾びれ (ギザギザ)
  ctx.beginPath();
  ctx.moveTo(-stats.radius * 1.5, 0);
  ctx.lineTo(-stats.radius * 2.5, -20);
  ctx.lineTo(-stats.radius * 2.0, 0);
  ctx.lineTo(-stats.radius * 2.5, 20);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  
  // 背びれ
  ctx.beginPath(); ctx.moveTo(0, -stats.radius); ctx.lineTo(-15, -stats.radius - 12); ctx.lineTo(10, -stats.radius - 5); ctx.fill(); ctx.stroke();
  
  // 口と牙
  ctx.strokeStyle = '#333';
  ctx.beginPath(); ctx.moveTo(stats.radius * 0.8, 5); ctx.lineTo(stats.radius * 1.4, 2); ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.moveTo(stats.radius * 1.0, 4); ctx.lineTo(stats.radius * 1.1, 8); ctx.lineTo(stats.radius * 1.2, 4); ctx.fill();
  
  // 目
  ctx.fillStyle = '#333';
  ctx.beginPath(); ctx.arc(stats.radius * 0.8, -4, 3, 0, Math.PI * 2); ctx.fill();
};
