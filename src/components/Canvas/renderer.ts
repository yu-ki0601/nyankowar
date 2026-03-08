import { type Unit, CANVAS_WIDTH, CANVAS_HEIGHT, type StageConfig } from '../../types/game';
import { drawBackground } from './stage/drawBackground';
import { drawCastle } from './stage/drawCastle';

// 各ユニットの描画関数をインポート
import { drawCatBasic } from './units/CatBasic';
import { drawCatTank } from './units/CatTank';
import { drawCatBattle } from './units/CatBattle';
import { drawCatLegs } from './units/CatLegs';
import { drawCatCow } from './units/CatCow';
import { drawCatBird } from './units/CatBird';
import { drawCatFish } from './units/CatFish';
import { drawCatLizard } from './units/CatLizard';
import { drawDogEnemy } from './units/DogEnemy';

/**
 * ゲーム全体のメイン描画関数
 */
export const drawGame = (ctx: CanvasRenderingContext2D, s: any, stage: StageConfig, timestamp: number) => {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawBackground(ctx, stage, timestamp);
  drawCastle(ctx, 40, '#d5dbdb', '#3498db');
  drawCastle(ctx, CANVAS_WIDTH - 120, '#566573', '#e74c3c');
  drawHpBars(ctx, s.baseHp, s.enemyBaseHp, stage);

  s.units.forEach((u: Unit) => {
    const bob = Math.sin(timestamp / 50) * 5;
    const curY = u.y + bob;
    ctx.save();
    ctx.translate(u.x, curY);
    if (u.type === 'enemy') ctx.scale(-1, 1);
    ctx.strokeStyle = '#333'; ctx.lineWidth = 2;

    switch (u.unitType) {
      case 'BASIC': drawCatBasic(ctx, u.stats); break;
      case 'TANK':  drawCatTank(ctx, u.stats); break;
      case 'BATTLE': drawCatBattle(ctx, u.stats, timestamp); break;
      case 'LEGS':  drawCatLegs(ctx, u.stats); break;
      case 'COW':   drawCatCow(ctx, u.stats); break;
      case 'BIRD':  drawCatBird(ctx, u.stats, timestamp); break;
      case 'FISH':  drawCatFish(ctx, u.stats); break;
      case 'LIZARD': drawCatLizard(ctx, u.stats); break;
      case 'ENEMY': drawDogEnemy(ctx, u.stats); break;
    }
    ctx.restore();

    const hpBarY = (u.unitType === 'TANK') ? curY - u.stats.radius * 2.8 : curY - u.stats.radius - 20;
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(u.x - 20, hpBarY, 40, 4);
    ctx.fillStyle = u.type === 'ally' ? '#2ecc71' : '#e74c3c';
    ctx.fillRect(u.x - 20, hpBarY, (u.currentHp / u.stats.hp) * 40, 4);
  });

  drawUiOverlay(ctx, s.money, s.walletLevel);
  if (s.isCannonFiring) drawCannonEffect(ctx);
};

const drawHpBars = (ctx: CanvasRenderingContext2D, baseHp: number, enemyBaseHp: number, stage: StageConfig) => {
  ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 1;
  ctx.fillRect(30, CANVAS_HEIGHT - 175, 100, 8); ctx.strokeRect(30, CANVAS_HEIGHT - 175, 100, 8);
  ctx.fillStyle = '#3498db'; ctx.fillRect(30, CANVAS_HEIGHT - 175, Math.max(0, (baseHp / stage.baseHp) * 100), 8);
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
