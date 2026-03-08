import { type UnitStats, CANVAS_WIDTH, CANVAS_HEIGHT } from '../../constants/gameStats';
import { drawCat } from './units/drawCat';
import { drawDog } from './units/drawDog';

/**
 * ユニットインスタンスの定義
 */
interface Unit {
  id: number; x: number; y: number; type: 'ally' | 'enemy';
  unitType: string; stats: UnitStats; currentHp: number;
}

/**
 * ゲーム全体のメイン描画関数
 * 
 * 背景、城、そして各ユニットの描画ファイルを呼び出します。
 */
export const drawGame = (ctx: CanvasRenderingContext2D, s: any, timestamp: number) => {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  
  // 1. 背景 (空・グラデーション)
  const sky = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  sky.addColorStop(0, '#85c1e9'); sky.addColorStop(1, '#d6eaf8');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // 2. 遠景 (山)
  ctx.fillStyle = '#5dade2'; ctx.beginPath(); ctx.moveTo(-50, CANVAS_HEIGHT-50); ctx.lineTo(150, 100); ctx.lineTo(350, CANVAS_HEIGHT-50); ctx.fill();
  ctx.fillStyle = '#3498db'; ctx.beginPath(); ctx.moveTo(200, CANVAS_HEIGHT-50); ctx.lineTo(450, 150); ctx.lineTo(700, CANVAS_HEIGHT-50); ctx.fill();

  // 3. 雲 (ゆっくり流れるアニメーション)
  const cloudX = (timestamp / 100) % (CANVAS_WIDTH + 200) - 100;
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  const drawCloud = (cx: number, cy: number) => {
    ctx.beginPath(); ctx.arc(cx, cy, 20, 0, Math.PI*2); ctx.arc(cx+25, cy-5, 25, 0, Math.PI*2); ctx.arc(cx+50, cy, 20, 0, Math.PI*2); ctx.fill();
  };
  drawCloud(cloudX, 50); drawCloud(cloudX - 400, 80);

  // 4. 地面 (芝生と土)
  ctx.fillStyle = '#229954'; ctx.fillRect(0, CANVAS_HEIGHT - 55, CANVAS_WIDTH, 10);
  ctx.fillStyle = '#7d6608'; ctx.fillRect(0, CANVAS_HEIGHT - 45, CANVAS_WIDTH, 45);

  // 5. 城 (拠点) の描画
  const drawCastle = (x: number, color: string, isAlly: boolean) => {
    ctx.fillStyle = color; ctx.fillRect(x, CANVAS_HEIGHT - 150, 80, 100);
    ctx.fillStyle = '#333'; ctx.fillRect(x + 25, CANVAS_HEIGHT - 90, 30, 40);
    ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(x-10, CANVAS_HEIGHT-150); ctx.lineTo(x+40, CANVAS_HEIGHT-200); ctx.lineTo(x+90, CANVAS_HEIGHT-150); ctx.fill();
    ctx.strokeStyle = '#333'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x+40, CANVAS_HEIGHT-200); ctx.lineTo(x+40, CANVAS_HEIGHT-230); ctx.stroke();
    ctx.fillStyle = isAlly ? '#3498db' : '#e74c3c'; ctx.fillRect(x+40, CANVAS_HEIGHT-230, 30, 20);
  };
  drawCastle(40, '#d5dbdb', true); drawCastle(CANVAS_WIDTH - 120, '#566573', false);

  // 6. 城のHPゲージ
  ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 1;
  ctx.fillRect(30, CANVAS_HEIGHT - 175, 100, 8); ctx.strokeRect(30, CANVAS_HEIGHT - 175, 100, 8);
  ctx.fillStyle = '#3498db'; ctx.fillRect(30, CANVAS_HEIGHT - 175, (s.baseHp / 1000) * 100, 8);
  ctx.fillStyle = '#fff'; ctx.fillRect(CANVAS_WIDTH - 130, CANVAS_HEIGHT - 175, 100, 8); ctx.strokeRect(CANVAS_WIDTH - 130, CANVAS_HEIGHT - 175, 100, 8);
  ctx.fillStyle = '#e74c3c'; ctx.fillRect(CANVAS_WIDTH - 130, CANVAS_HEIGHT - 175, (s.enemyBaseHp / 1000) * 100, 8);

  // 7. 全ユニットの描画 (種別に応じて専門の描画関数を呼び出す)
  s.units.forEach((u: Unit) => {
    if (u.type === 'ally') {
      drawCat(ctx, u.x, u.y, u.stats, u.unitType, u.currentHp, timestamp);
    } else {
      drawDog(ctx, u.x, u.y, u.stats, u.currentHp, timestamp);
    }
  });

  // 8. お金・レベル表示ボックス (Canvasオーバーレイ)
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.beginPath(); ctx.roundRect(10, 10, 180, 70, 10); ctx.fill();
  ctx.fillStyle = '#f1c40f'; ctx.font = 'bold 22px Arial'; ctx.fillText(`$ ${Math.floor(s.money)}`, 25, 40);
  ctx.fillStyle = '#fff'; ctx.font = '14px Arial'; ctx.fillText(`Lv.${s.walletLevel} 働きネコ`, 25, 65);

  // 9. にゃんこ砲発射演出 (レーザー)
  if (s.isCannonFiring) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; ctx.fillRect(100, CANVAS_HEIGHT - 100, CANVAS_WIDTH, 40);
    ctx.strokeStyle = '#f1c40f'; ctx.lineWidth = 4; ctx.strokeRect(100, CANVAS_HEIGHT - 100, CANVAS_WIDTH, 40);
  }
};
