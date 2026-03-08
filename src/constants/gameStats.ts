/**
 * ゲームの基本定数とユニット性能の定義ファイル
 * 
 * ゲームの難易度調整や新キャラ追加の際は、主にこのファイルを編集します。
 */

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 400;

/**
 * ユニットの基本性能を定義するインターフェース
 */
export interface UnitStats {
  name: string;    // 表示名
  cost: number;    // 召喚コスト
  hp: number;      // 最大体力
  speed: number;   // 移動速度
  damage: number;  // 秒間攻撃力 (DPS)
  color: string;   // ボディの色
  cooldown: number;// 再生産時間 (ミリ秒)
  radius: number;  // 当たり判定の大きさ (ピクセル)
  range: number;   // 攻撃射程 (ピクセル)
}

/**
 * 各ユニット種別のステータス設定
 */
export const UNIT_TYPES: Record<string, UnitStats> = {
  // 基本にゃんこ: 安価でバランスが良い。数で攻める基本戦力。
  BASIC: { name: 'にゃんこ', cost: 50, hp: 150, speed: 1.0, damage: 30, color: '#ffffff', cooldown: 2500, radius: 18, range: 60 },
  // タンクねこ: 体力が非常に高い壁役。移動は遅い。
  TANK: { name: 'タンク', cost: 150, hp: 500, speed: 0.6, damage: 10, color: '#f0f0f0', cooldown: 6000, radius: 25, range: 35 },
  // バトルねこ: 攻撃力に特化したアタッカー。手に斧を持っている。
  BATTLE: { name: 'バトル', cost: 200, hp: 100, speed: 1.2, damage: 60, color: '#ffcccc', cooldown: 8000, radius: 18, range: 55 },
  // わんこ: 敵軍の基本戦力。ダークグレーの体。
  ENEMY: { name: 'わんこ', cost: 0, hp: 150, speed: 0.8, damage: 25, color: '#5d6d7e', cooldown: 0, radius: 18, range: 50 },
};
