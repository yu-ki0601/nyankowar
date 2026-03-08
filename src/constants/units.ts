import { type UnitStats } from '../types/game';

/**
 * 各ユニット種別のマスターデータ
 */
export const UNIT_TYPES: Record<string, UnitStats> = {
  BASIC: { name: 'にゃんこ', cost: 50, hp: 150, speed: 1.0, damage: 30, color: '#ffffff', cooldown: 2500, radius: 18, range: 60 },
  TANK: { name: 'タンク', cost: 150, hp: 500, speed: 0.6, damage: 10, color: '#f0f0f0', cooldown: 6000, radius: 25, range: 35 },
  BATTLE: { name: 'バトル', cost: 200, hp: 100, speed: 1.2, damage: 60, color: '#ffcccc', cooldown: 8000, radius: 18, range: 55 },
  ENEMY: { name: 'わんこ', cost: 0, hp: 150, speed: 0.8, damage: 25, color: '#5d6d7e', cooldown: 0, radius: 18, range: 50 },
};
