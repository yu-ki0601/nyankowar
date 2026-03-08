import { CANVAS_WIDTH, CANVAS_HEIGHT, type StageConfig } from '../../../types/game';

/**
 * ステージに応じた背景を描画する関数
 */
export const drawBackground = (ctx: CanvasRenderingContext2D, stage: StageConfig, timestamp: number) => {
  const bg = stage.background;

  // 1. 空
  const sky = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  sky.addColorStop(0, bg.skyTop);
  sky.addColorStop(1, bg.skyBottom);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // 2. 山
  ctx.fillStyle = bg.mountainFar;
  ctx.beginPath(); ctx.moveTo(-50, CANVAS_HEIGHT - 50); ctx.lineTo(150, 100); ctx.lineTo(350, CANVAS_HEIGHT - 50); ctx.fill();
  ctx.fillStyle = bg.mountainNear;
  ctx.beginPath(); ctx.moveTo(200, CANVAS_HEIGHT - 50); ctx.lineTo(450, 150); ctx.lineTo(700, CANVAS_HEIGHT - 50); ctx.fill();

  // 3. 雲
  const cloudX = (timestamp / 100) % (CANVAS_WIDTH + 200) - 100;
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  const drawSingleCloud = (cx: number, cy: number) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 20, 0, Math.PI * 2);
    ctx.arc(cx + 25, cy - 5, 25, 0, Math.PI * 2);
    ctx.arc(cx + 50, cy, 20, 0, Math.PI * 2);
    ctx.fill();
  };
  drawSingleCloud(cloudX, 50);
  drawSingleCloud(cloudX - 400, 80);

  // 4. 地面
  ctx.fillStyle = bg.grass;
  ctx.fillRect(0, CANVAS_HEIGHT - 55, CANVAS_WIDTH, 10);
  ctx.fillStyle = bg.dirt;
  ctx.fillRect(0, CANVAS_HEIGHT - 45, CANVAS_WIDTH, 45);
};
