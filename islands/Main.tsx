import { signal } from "@preact/signals";

import Map from "../islands/Map.tsx";
import MoneyRouter from "../islands/MoneyRouter.tsx";
// import { distanceToParking } from "./signals.ts";
// state管理
// 1. 初期状態        walletAddress=null, distanceToParking=0
//  ↓ ウォレット接続
// 2. 車スタート      walletAddress=...., distanceToParking=....
//  ↓ 10秒経過
// 3. 目的地に借りたい人が出現
//  ↓ OKボタン押下
// 4. トークン受け取り開始
//  → 0になるまで継続
// 5. 終了            walletAddress=...., distanceToParking=0

export const walletAddress = signal<string | null>(null);
export const distanceToParking = signal<number>(0);

export default function Main() {
  return (
    <div class="flex w-full text-gray-800">
      <Map
        distanceToParking={distanceToParking}
        walletAddress={walletAddress}
      />
      <MoneyRouter
        distanceToParking={distanceToParking}
        walletAddress={walletAddress}
      />
    </div>
  );
}
