/**
 * ユニットの基本性能を定義
 */
export interface UnitStats {
  name: string;
  cost: number;
  hp: number;
  speed: number;
  damage: number;
  color: string;
  cooldown: number;
  radius: number;
  range: number;
}

/**
 * ステージの背景設定を定義
 */
export interface StageBackground {
  skyTop: string;
  skyBottom: string;
  mountainFar: string;
  mountainNear: string;
  grass: string;
  dirt: string;
}

/**
 * ステージの全体構成を定義
 */
export interface StageConfig {
  id: number;
  name: string;
  baseHp: number;
  enemyBaseHp: number;
  enemySpawnRate: number;
  enemyHpMultiplier: number;
  background: StageBackground;
}
