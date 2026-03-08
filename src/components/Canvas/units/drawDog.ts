import { type UnitStats } from '../../../constants/gameStats';

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
  const bob = Math.sin(timestamp / 50) * 5; // 跳ねるアニメーション
  const curY = y + bob;

  ctx.save();
  ctx.translate(x, curY);
  ctx.scale(-1, 1); // 敵軍は常に左向き

  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.fillStyle = stats.color;

  // 1. 体の描画 (少し楕円)
  ctx.beginPath(); ctx.ellipse(0, 0, stats.radius * 1.2, stats.radius, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  // 2. 耳の描画 (垂れ耳)
  ctx.fillStyle = '#2c3e50';
  ctx.beginPath(); ctx.arc(-stats.radius * 0.8, -stats.radius * 0.5, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(stats.radius * 0.8, -stats.radius * 0.5, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  // 3. 鼻の描画
  ctx.fillStyle = '#17202a';
  ctx.beginPath(); ctx.arc(stats.radius * 0.6, 5, 4, 0, Math.PI * 2); ctx.fill();

  // 4. 目の描画 (赤く光る)
  ctx.fillStyle = '#ff0000';
  ctx.beginPath(); ctx.arc(stats.radius * 0.3, -5, 4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(-stats.radius * 0.1, -5, 4, 0, Math.PI * 2); ctx.fill();

  ctx.restore();

  // 5. HPバー
  const hpBarY = curY - stats.radius - 20;
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(x - 20, hpBarY, 40, 4);
  ctx.fillStyle = '#e74c3c'; // 敵は赤
  ctx.fillRect(x - 20, hpBarY, (currentHp / stats.hp) * 40, 4);
};
