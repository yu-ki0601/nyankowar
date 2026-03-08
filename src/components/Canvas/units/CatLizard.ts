import { type UnitStats } from '../../../types/game';

/**
 * ネコトカゲを描画する関数
 * 攻撃時に口から勢いよく火を噴く演出を追加
 */
export const drawCatLizard = (ctx: CanvasRenderingContext2D, stats: UnitStats, timestamp: number) => {
  // 攻撃アニメーションの計算 (約2秒周期)
  const attackCycle = (timestamp % 2000) / 2000;
  const isFiring = attackCycle > 0.6 && attackCycle < 0.9;
  const firePower = isFiring ? Math.sin((attackCycle - 0.6) * Math.PI / 0.3) : 0;

  // 足元の影
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.beginPath(); ctx.ellipse(0, 15, stats.radius * 2, 6, 0, 0, Math.PI * 2); ctx.fill();

  ctx.save();
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2.5;
  ctx.fillStyle = stats.color;

  // 1. しなる長い尻尾
  const tailSwing = Math.sin(timestamp / 80) * 10;
  ctx.beginPath();
  ctx.moveTo(-15, 0);
  ctx.quadraticCurveTo(-45, -35 + tailSwing, -70, 10 + tailSwing);
  ctx.stroke();

  // 2. 胴体
  ctx.beginPath();
  ctx.ellipse(0, 5, stats.radius * 1.8, stats.radius * 0.8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 3. 背中のトゲ
  ctx.fillStyle = '#1e8449';
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(-15 + i * 15, -2);
    ctx.lineTo(-7 + i * 15, -18);
    ctx.lineTo(0 + i * 15, -2);
    ctx.fill();
    ctx.stroke();
  }

  // 4. 頭部 (攻撃時に前に突き出す)
  ctx.save();
  ctx.translate(firePower * 10, 0);
  ctx.fillStyle = stats.color;
  ctx.beginPath();
  ctx.arc(stats.radius * 1.6, -8, stats.radius * 0.75, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 5. ネコ耳
  ctx.beginPath();
  ctx.moveTo(stats.radius * 1.3, -14); ctx.lineTo(stats.radius * 1.0, -24); ctx.lineTo(stats.radius * 1.7, -18);
  ctx.moveTo(stats.radius * 1.9, -14); ctx.lineTo(stats.radius * 2.2, -24); ctx.lineTo(stats.radius * 1.5, -18);
  ctx.fill();
  ctx.stroke();

  // 6. 目
  ctx.fillStyle = '#333';
  ctx.beginPath(); ctx.arc(stats.radius * 1.9, -10, 2.5, 0, Math.PI * 2); ctx.fill();

  // 7. 火を噴くエフェクト
  if (isFiring) {
    const headX = stats.radius * 2.2;
    const headY = -8;
    
    // メインの炎
    const fireGrad = ctx.createRadialGradient(headX, headY, 5, headX + firePower * 60, headY, firePower * 40);
    fireGrad.addColorStop(0, '#f1c40f'); // 黄
    fireGrad.addColorStop(0.5, '#e67e22'); // 橙
    fireGrad.addColorStop(1, 'rgba(231, 76, 60, 0)'); // 赤 (透明に消える)
    
    ctx.fillStyle = fireGrad;
    ctx.beginPath();
    ctx.moveTo(headX, headY);
    ctx.quadraticCurveTo(headX + firePower * 40, headY - 30, headX + firePower * 80, headY);
    ctx.quadraticCurveTo(headX + firePower * 40, headY + 30, headX, headY);
    ctx.fill();

    // 火の粉
    for (let j = 0; j < 5; j++) {
      ctx.fillStyle = '#e74c3c';
      const fx = headX + Math.random() * firePower * 80;
      const fy = headY + (Math.random() - 0.5) * 20;
      ctx.beginPath(); ctx.arc(fx, fy, 2, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.restore();

  ctx.restore();
};
