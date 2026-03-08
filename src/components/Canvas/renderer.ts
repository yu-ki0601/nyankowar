import { type UnitStats, CANVAS_WIDTH, CANVAS_HEIGHT, type StageConfig } from '../../constants/gameStats';
import { drawCat } from './units/drawCat';
import { drawDog } from './units/drawDog';
import { drawBackground } from './stage/drawBackground';
import { drawCastle } from './stage/drawCastle';

interface Unit {
  id: number; x: number; y: number; type: 'ally' | 'enemy';
  unitType: string; stats: UnitStats; currentHp: number;
}

export const drawGame = (ctx: CanvasRenderingContext2D, s: any, stage: StageConfig, timestamp: number) => {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  
  // 1. ステージ背景
  drawBackground(ctx, stage, timestamp);

  // 2. 城
  drawCastle(ctx, 40, '#d5dbdb', '#3498db');
  drawCastle(ctx, CANVAS_WIDTH - 120, '#566573', '#e74c3c');

  // 3. HPゲージ
  drawHpBars(ctx, s.baseHp, s.enemyBaseHp, stage);

  // 4. ユニット
  s.units.forEach((u: Unit) => {
    if (u.type === 'ally') {
      drawCat(ctx, u.x, u.y, u.stats, u.unitType, u.currentHp, timestamp);
    } else {
      drawDog(ctx, u.x, u.y, u.stats, u.currentHp, timestamp);
    }
  });

  // 5. UI
  drawUiOverlay(ctx, s.money, s.walletLevel);

  if (s.isCannonFiring) {
    drawCannonEffect(ctx);
  }
};

const drawHpBars = (ctx: CanvasRenderingContext2D, baseHp: number, enemyBaseHp: number, stage: StageConfig) => {
  ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 1;
  ctx.fillRect(30, CANVAS_HEIGHT - 175, 100, 8); ctx.strokeRect(30, CANVAS_HEIGHT - 175, 100, 8);
  ctx.fillStyle = '#3498db'; ctx.fillRect(30, CANVAS_HEIGHT - 175, (baseHp / stage.baseHp) * 100, 8);
  ctx.fillStyle = '#fff';
  ctx.fillRect(CANVAS_WIDTH - 130, CANVAS_HEIGHT - 175, 100, 8); ctx.strokeRect(CANVAS_WIDTH - 130, CANVAS_HEIGHT - 175, 100, 8);
  ctx.fillStyle = '#e74c3c'; ctx.fillRect(CANVAS_WIDTH - 130, CANVAS_HEIGHT - 175, (enemyBaseHp / stage.enemyBaseHp) * 100, 8);
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
