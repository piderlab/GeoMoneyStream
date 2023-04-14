import { useState } from "preact/hooks";

import CurrentBalance from "../islands/CurrentBalance.tsx";

interface MoneyRouterProps {
  distanceToParking: number;
}

export default function MoneyRouter(props: MoneyRouterProps) {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const flow = calcFlowRate(props.distanceToParking);
  const childClass = "m-4 bg-white rounded shadow";
  const flexChildClass = "p-1 rounded";
  return (
    <div class="w-1/2 bg-gray-100 overflow-y-scroll shadow-inner">
      <div class={childClass}>
        <h2 class="text-2xl p-1">1. Connect wallet</h2>
        <button
          class="m-4 p-1 rounded shadow text-white bg-[#16A34A]"
          onClick={() => setIsWalletConnected(true)}
        >
          Connect Wallet
        </button>
      </div>
      <div class={childClass}>
        <h2 class="text-2xl p-1">2. Money streaming</h2>
        <div class="flex items-center justify-center p-1">
          <div
            class={`text-center text-sm bg-blue-300 text-white ${flexChildClass}`}
          >
            <img src="/system.png" class="w-16 block" />
            System
          </div>
          <div class={`text-center w-12 ${flexChildClass}`}>
            <span class="text-xl">in</span>
            <br />
            <span class="font-bold text-lg">→</span>
            <br />
            {flow.in}
          </div>
          <div class={`w-[12em] p-2 bg-[#BEF264] ${flexChildClass}`}>
            <h3 class="font-bold">Your Wallet</h3>
            <div>
              {Math.round(props.distanceToParking)}m to goal
            </div>
            <CurrentBalance flowRate={flow.out - flow.in} />
          </div>
          <div class={`text-center w-10 ${flexChildClass}`}>
            <span class="text-xl">out</span>
            <br />
            <span class="font-bold text-lg">→</span>
            <br />
            {flow.out}
          </div>
          <div
            class={`text-center text-sm bg-blue-300 text-white ${flexChildClass}`}
          >
            <img src="/system.png" class="w-16 block" />
            System
          </div>
        </div>
      </div>
    </div>
  );
}

function calcFlowRate(distance: number) {
  if (distance <= 0) {
    return { in: 0, out: 0 };
  }
  if (2000 < distance) {
    return { in: 0, out: 40 };
  }
  if (1000 <= distance) {
    return { in: 10, out: 40 };
  }
  if (500 <= distance) {
    return { in: 20, out: 40 };
  }
  return { in: 30, out: 40 };
}

// 1. ウォレット接続
// 2. 車スタート
// 3. 目的地に借りたい人が出現
// 0になるまで継続
