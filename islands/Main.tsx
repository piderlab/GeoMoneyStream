import { signal } from "@preact/signals";

import Map from "../islands/Map.tsx";
import MoneyRouter from "../islands/MoneyRouter.tsx";

// state管理
// 1. 初期状態        walletAddress=null, flowRate={in: 0, out: 0}
//  ↓ ウォレット接続
// 2. 車スタート      walletAddress=...., flowRate={in: ..., out: ...}
//  ↓ 10秒経過
// 3. incomingエリアやoutcomingエリアに出たり入ったりする
//
// 4. 終了            walletAddress=...., flowRate={in: 0, out: 0}

const walletAddress = signal<string | null>(null);
const distanceToParking = signal<number>(0);
const flowRate = signal<{ in: number; out: number }>({ in: 0, out: 0 });

export default function Main() {
  return (
    <div class="flex w-full text-gray-800">
      <Map
        flowRate={flowRate}
        distanceToParking={distanceToParking}
        walletAddress={walletAddress}
      />
      <MoneyRouter
        flowRate={flowRate}
        distanceToParking={distanceToParking}
        walletAddress={walletAddress}
      />
    </div>
  );
}
