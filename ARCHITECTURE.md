# ねこねこ大戦争: アーキテクチャ設計書

本プロジェクトは、高い拡張性と保守性を実現するため、機能ごとに厳格にディレクトリを分離しています。

## 1. フォルダ構造
- **`src/types/`**: システム全体のデータ構造（ユニット、ステージ等）の型定義。
- **`src/constants/`**: 
    - `units.ts`: ユニットのマスターデータ。
    - `stages/`: ステージごとの固有定義（背景色、難易度等）。
- **`src/hooks/`**: 
    - `useGameAudio.ts`: 音声イベントの制御と AudioContext の管理。
- **`src/audio/`**: 
    - `core/`: 物理的な波形生成エンジン。
    - `se/`: 戦闘やシステム用の効果音レシピ。
    - `music/`: ステージごとの BGM 定義とメロディロジック。
- **`src/components/Canvas/`**: 
    - `renderer.ts`: 描画フローの全体管理。
    - `units/`: キャラクター個別の描画ロジック。
    - `stage/`: 環境・城の描画ロジック。
- **`src/components/UI/`**: 共通のUIパーツ（GaugeButton等）。

## 2. 音響システム (Audio Decoupling)
音声は「生成(Synth)」と「制御(Hook)」に分離されています。
`useGameAudio` は高レベルなイベント（例：ユニットが死んだ、砲を撃った）を受け取り、適切な `audio/` 以下の合成関数を呼び出します。BGMはステージIDに基づいて動的にロジックが切り替わります。

## 3. 描画パイプライン (Visual Decoupling)
Canvas 描画はレイヤーごとに分割されています。
1.  **BackgroundStage:** `drawBackground` が現在の `StageConfig` に基づいて描画。
2.  **ObjectLayer:** 城やフラッグを描画。
3.  **EntityLayer:** `drawCat` または `drawDog` がキャラクターを描画。
4.  **UILayer:** Canvas 内オーバーレイと React DOM によるボタン群。

## 4. 安定化エンジン
`useRef` を中心とした状態管理により、React のレンダリングサイクル（約16ms〜数百ms）の影響を受けずに、正確な物理演算と BGM のタイミング制御（400ms単位）を実現しています。
