# ゲームエンジンの設計と処理フロー

本ゲームは、React の宣言的な UI と、Canvas による命令的なゲームループを組み合わせた「ハイブリッド設計」を採用しています。

## 1. フォルダ構成
リファクタリングにより、各機能が独立したファイルに分離されています。

- **`src/constants/gameStats.ts`**
    - 役割: 全ユニットのHP、攻撃力、コスト、クールタイムなどの静的データ。
- **`src/hooks/useGameAudio.ts`**
    - 役割: Web Audio API を用いた BGM と効果音（SE）の生成・再生。
- **`src/components/Canvas/renderer.ts`**
    - 役割: Canvas への描画命令。背景、城、ユニットの描画を担当。
- **`src/components/UI/GaugeButton.tsx`**
    - 役割: 再生産待ち時間などを表示する、ゲージ演出付きの汎用ボタン。
- **`src/components/Game.tsx`**
    - 役割: メインループの管理、物理演算の実行、各コンポーネントの統合。

## 2. 状態管理 (stateRef)
`useRef` (stateRef) を「真の状態」として使用し、60fps の計算を行います。
React の `useState` は 10フレームに1回だけ更新され、ボタンの活性/非活性やテキスト表示の更新に使用されます。

## 3. 描画とサウンドの同期
描画エンジン（renderer）は、`stateRef` から直接ユニットの位置やHPを読み取ります。
サウンド（useGameAudio）は、`update` ループ内でのイベント（生産完了、攻撃ヒットなど）をトリガーにして再生されます。

## 4. 拡張性
新しいキャラクターを追加する場合、`gameStats.ts` にパラメータを追加し、`renderer.ts` の `drawUnit` に描画ロジックを追加するだけで対応可能です。
