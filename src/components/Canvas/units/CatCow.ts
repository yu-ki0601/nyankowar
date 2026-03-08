import { type UnitStats } from '../../../types/game';

export const drawCatCow = (ctx: CanvasRenderingContext2D, stats: UnitStats) => {
  // 足元の影
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.beginPath(); ctx.ellipse(0, 12, stats.radius * 1.3, 6, 0, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = stats.color;
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2.5;
  
  // 体
  ctx.beginPath(); ctx.ellipse(0, 0, stats.radius * 1.3, stats.radius * 0.9, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  
  // 牛柄 (ランダム風)
  ctx.fillStyle = '#333';
  ctx.beginPath(); ctx.arc(-10, -5, 6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(5, 5, 5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(15, -2, 4, 0, Math.PI * 2); ctx.fill();
  
  // 角 (金色のグラデーション)
  const hornGrad = ctx.createLinearGradient(0, -15, 0, -25);
  hornGrad.addColorStop(0, '#f1c40f'); hornGrad.addColorStop(1, '#f39c12');
  ctx.fillStyle = hornGrad;
  ctx.beginPath(); ctx.moveTo(-12, -12); ctx.lineTo(-18, -28); ctx.lineTo(-6, -18); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(12, -12); ctx.lineTo(18, -28); ctx.lineTo(6, -18); ctx.fill(); ctx.stroke();
  
  // 目 (キリッとした表情)
  ctx.fillStyle = '#333';
  ctx.fillRect(-8, -3, 4, 2); ctx.fillRect(4, -3, 4, 2);
};
