import { type Unit, CANVAS_WIDTH, CANVAS_HEIGHT, type StageConfig } from '../../types/game';
import { drawCat } from './units/drawCat';
import { drawDog } from './units/drawDog';
import { drawBackground } from './stage/drawBackground';
import { drawCastle } from './stage/drawCastle';

/**
 * ゲーム全体のメイン描画関数
 */
export const drawGame = (ctx: CanvasRenderingContext2D, s: any, stage: StageConfig, timestamp: number) => {
  // 1. 画面のクリア
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  
  // 2. ステージ背景の描画
  drawBackground(ctx, stage, timestamp);

  // 3. 城 (拠点) の描画
  drawCastle(ctx, 40, '#d5dbdb', '#3498db'); // 自城
  drawCastle(ctx, CANVAS_WIDTH - 120, '#566573', '#e74c3c'); // 敵城

  // 4. 城のHPゲージ
  drawHpBars(ctx, s.baseHp, s.enemyBaseHp, stage);

  // 5. 全ユニットの描画
  s.units.forEach((u: Unit) => {
    if (u.type === 'ally') {
      drawCat(ctx, u.x, u.y, u.stats, u.unitType, u.currentHp, timestamp);
    } else {
      drawDog(ctx, u.x, u.y, u.stats, u.currentHp, timestamp);
    }
  });

  // 6. UIオーバーレイ (お金、レベル表示)
  drawUiOverlay(ctx, s.money, s.walletLevel);

  // 7. 特殊演出 (にゃんこ砲)
  if (s.isCannonFiring) {
    drawCannonEffect(ctx);
  }
};

const drawHpBars = (ctx: CanvasRenderingContext2D, baseHp: number, enemyBaseHp: number, stage: StageConfig) => {
  ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 1;
  ctx.fillRect(30, CANVAS_HEIGHT - 175, 100, 8); ctx.strokeRect(30, CANVAS_HEIGHT - 175, 100, 8);
  ctx.fillStyle = '#3498db'; ctx.fillRect(30, CANVAS_HEIGHT - 175, Math.max(0, (baseHp / stage.baseHp) * 100), 8);
  ctx.fillStyle = '#fff';
  ctx.fillRect(CANVAS_WIDTH - 130, CANVAS_HEIGHT - 175, 100, 8); ctx.strokeRect(CANVAS_WIDTH - 130, CANVAS_HEIGHT - 175, 100, 8);
  ctx.fillStyle = '#e74c3c'; ctx.fillRect(CANVAS_WIDTH - 130, CANVAS_HEIGHT - 175, Math.max(0, (enemyBaseHp / stage.enemyBaseHp) * 100), 8);
};

const drawUiOverlay = (ctx: CanvasRenderingContext2D, money: number, walletLevel: number) => {
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.beginPath(); ctx.roundRect(10, 10, 180, 70, 10); ctx.fill();
  ctx.fillStyle = '#f1c40f'; ctx.font = 'bold 22px Arial'; ctx.fillText(`$ ${Math.floor(money)}`, 25, 40);
  ctx.fillStyle = '#fff'; ctx.font = '14px Arial'; ctx.fillText(`Lv.${walletLevel} 働きネコ`, 25, 65);
};

const drawCannonEffect = (ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillRect(100, CANVAS_HEIGHT - 100, CANVAS_WIDTH, 40);
  ctx.strokeStyle = '#f1c40f'; ctx.lineWidth = 4;
  ctx.strokeRect(100, CANVAS_HEIGHT - 100, CANVAS_WIDTH, 40);
};
