import { type UnitStats, CANVAS_WIDTH, CANVAS_HEIGHT } from '../../constants/gameStats';

interface Unit {
  id: number; x: number; y: number; type: 'ally' | 'enemy';
  unitType: string; stats: UnitStats; currentHp: number;
}

// ユニット描画の内部関数
const drawUnit = (ctx: CanvasRenderingContext2D, unit: Unit, timestamp: number) => {
  const { x, y, stats, type, unitType } = unit;
  const bob = Math.sin(timestamp / 50) * 5;
  const curY = y + bob;

  ctx.save();
  ctx.translate(x, curY);
  if (type === 'enemy') ctx.scale(-1, 1);
  ctx.strokeStyle = '#333'; ctx.lineWidth = 2;

  if (type === 'ally') {
    ctx.fillStyle = stats.color;
    if (unitType === 'TANK') {
      ctx.beginPath(); ctx.roundRect(-stats.radius * 0.8, -stats.radius * 2.5, stats.radius * 1.6, stats.radius * 2.8, 10); ctx.fill(); ctx.stroke();
    } else {
      ctx.beginPath(); ctx.arc(0, 0, stats.radius, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    }
    ctx.fillStyle = (unitType === 'BATTLE') ? '#c0392b' : stats.color;
    const earY = unitType === 'TANK' ? -stats.radius * 2.5 : -stats.radius * 0.5;
    ctx.beginPath(); ctx.moveTo(-stats.radius * 0.6, earY); ctx.lineTo(-stats.radius * 1.0, earY - 15); ctx.lineTo(-stats.radius * 0.2, earY - 10); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(stats.radius * 0.6, earY); ctx.lineTo(stats.radius * 1.0, earY - 15); ctx.lineTo(stats.radius * 0.2, earY - 10); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#333'; const eyeY = unitType === 'TANK' ? -stats.radius * 1.8 : -2;
    ctx.fillRect(-stats.radius*0.4, eyeY, 3, 6); ctx.fillRect(stats.radius*0.2, eyeY, 3, 6);
    ctx.lineWidth = 1;
    const whiskerY = unitType === 'TANK' ? -stats.radius * 1.5 : 5;
    ctx.beginPath(); ctx.moveTo(-stats.radius*0.5, whiskerY); ctx.lineTo(-stats.radius*1.2, whiskerY-2); ctx.stroke();
    if (unitType === 'BATTLE') {
      ctx.save(); ctx.translate(stats.radius * 0.8, 0); ctx.rotate(Math.sin(timestamp / 100) * 0.5);
      ctx.strokeStyle = '#5d4037'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 10); ctx.lineTo(0, -30); ctx.stroke();
      ctx.fillStyle = '#95a5a6'; ctx.beginPath(); ctx.moveTo(0, -30); ctx.quadraticCurveTo(25, -35, 20, -10); ctx.lineTo(0, -15); ctx.fill(); ctx.stroke(); ctx.restore();
    }
  } else {
    ctx.fillStyle = stats.color; ctx.beginPath(); ctx.ellipse(0, 0, stats.radius * 1.2, stats.radius, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#2c3e50'; ctx.beginPath(); ctx.arc(-stats.radius * 0.8, -stats.radius * 0.5, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(stats.radius * 0.8, -stats.radius * 0.5, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ff0000'; ctx.beginPath(); ctx.arc(stats.radius * 0.3, -5, 4, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(-stats.radius * 0.1, -5, 4, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
  const hpBarY = (unitType === 'TANK') ? curY - stats.radius * 2.8 : curY - stats.radius - 20;
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(x - 20, hpBarY, 40, 4);
  ctx.fillStyle = type === 'ally' ? '#2ecc71' : '#e74c3c';
  ctx.fillRect(x - 20, hpBarY, (unit.currentHp / stats.hp) * 40, 4);
};

// メイン描画関数
export const drawGame = (ctx: CanvasRenderingContext2D, s: any, timestamp: number) => {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  
  const sky = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  sky.addColorStop(0, '#85c1e9'); sky.addColorStop(1, '#d6eaf8');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.fillStyle = '#5dade2'; ctx.beginPath(); ctx.moveTo(-50, CANVAS_HEIGHT-50); ctx.lineTo(150, 100); ctx.lineTo(350, CANVAS_HEIGHT-50); ctx.fill();
  ctx.fillStyle = '#3498db'; ctx.beginPath(); ctx.moveTo(200, CANVAS_HEIGHT-50); ctx.lineTo(450, 150); ctx.lineTo(700, CANVAS_HEIGHT-50); ctx.fill();

  const cloudX = (timestamp / 100) % (CANVAS_WIDTH + 200) - 100;
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  const drawCloud = (cx: number, cy: number) => {
    ctx.beginPath(); ctx.arc(cx, cy, 20, 0, Math.PI*2); ctx.arc(cx+25, cy-5, 25, 0, Math.PI*2); ctx.arc(cx+50, cy, 20, 0, Math.PI*2); ctx.fill();
  };
  drawCloud(cloudX, 50); drawCloud(cloudX - 400, 80);

  ctx.fillStyle = '#229954'; ctx.fillRect(0, CANVAS_HEIGHT - 55, CANVAS_WIDTH, 10);
  ctx.fillStyle = '#7d6608'; ctx.fillRect(0, CANVAS_HEIGHT - 45, CANVAS_WIDTH, 45);

  const drawCastle = (x: number, color: string, isAlly: boolean) => {
    ctx.fillStyle = color; ctx.fillRect(x, CANVAS_HEIGHT - 150, 80, 100);
    ctx.fillStyle = '#333'; ctx.fillRect(x + 25, CANVAS_HEIGHT - 90, 30, 40);
    ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(x-10, CANVAS_HEIGHT-150); ctx.lineTo(x+40, CANVAS_HEIGHT-200); ctx.lineTo(x+90, CANVAS_HEIGHT-150); ctx.fill();
    ctx.strokeStyle = '#333'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x+40, CANVAS_HEIGHT-200); ctx.lineTo(x+40, CANVAS_HEIGHT-230); ctx.stroke();
    ctx.fillStyle = isAlly ? '#3498db' : '#e74c3c'; ctx.fillRect(x+40, CANVAS_HEIGHT-230, 30, 20);
  };
  drawCastle(40, '#d5dbdb', true); drawCastle(CANVAS_WIDTH - 120, '#566573', false);

  ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 1;
  ctx.fillRect(30, CANVAS_HEIGHT - 175, 100, 8); ctx.strokeRect(30, CANVAS_HEIGHT - 175, 100, 8);
  ctx.fillStyle = '#3498db'; ctx.fillRect(30, CANVAS_HEIGHT - 175, (s.baseHp / 1000) * 100, 8);
  ctx.fillStyle = '#fff'; ctx.fillRect(CANVAS_WIDTH - 130, CANVAS_HEIGHT - 175, 100, 8); ctx.strokeRect(CANVAS_WIDTH - 130, CANVAS_HEIGHT - 175, 100, 8);
  ctx.fillStyle = '#e74c3c'; ctx.fillRect(CANVAS_WIDTH - 130, CANVAS_HEIGHT - 175, (s.enemyBaseHp / 1000) * 100, 8);

  s.units.forEach((u: Unit) => drawUnit(ctx, u, timestamp));

  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.beginPath(); ctx.roundRect(10, 10, 180, 70, 10); ctx.fill();
  ctx.fillStyle = '#f1c40f'; ctx.font = 'bold 22px Arial'; ctx.fillText(`$ ${Math.floor(s.money)}`, 25, 40);
  ctx.fillStyle = '#fff'; ctx.font = '14px Arial'; ctx.fillText(`Lv.${s.walletLevel} 働きネコ`, 25, 65);

  if (s.isCannonFiring) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; ctx.fillRect(100, CANVAS_HEIGHT - 100, CANVAS_WIDTH, 40);
    ctx.strokeStyle = '#f1c40f'; ctx.lineWidth = 4; ctx.strokeRect(100, CANVAS_HEIGHT - 100, CANVAS_WIDTH, 40);
  }
};
