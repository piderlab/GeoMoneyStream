import { useState } from "preact/hooks";

import CurrentBalance from "./CurrentBalance.tsx";
import { walletAddress } from "./signals.ts";

interface MoneyRouterProps {
  distanceToParking: number;
}

export default function MoneyRouter(props: MoneyRouterProps) {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const flow = calcFlowRate(props.distanceToParking);
  const childClass = "px-1 mx-4 my-8 bg-white rounded shadow";
  const flexChildClass = "p-1 rounded";
  return (
    <div class="w-1/2 bg-gray-100 overflow-y-scroll shadow-inner">
      <div class={childClass}>
        <h2 class="text-2xl py-3">1. Connect Wallet</h2>
        First you need to connect a wallet such as Metamask.
        <button
          class="m-4 p-1 rounded shadow text-white bg-[#16A34A]"
          // onClick={() => setIsWalletConnected(true)}
          onClick={() => walletAddress.value = "aaa"}
        >
          Connect Wallet
        </button>
      </div>
      <div class={childClass}>
        <h2 class="text-2xl px-1 py-3">2. Start Payment</h2>
        <div class="flex items-center justify-center pb-4">
          <div
            class={`text-center text-sm bg-blue-100 ${flexChildClass}`}
          >
            <img src="/system.png" class="w-12 block" />
            System
          </div>
          <div
            class={`text-center w-12 ${
              flow.in ? "text-purple-500" : "text-gray-400"
            } ${flexChildClass}`}
          >
            <div class="text-lg">in</div>
            <div class="text-5xl leading-5 -mx-8 text-center">→</div>
            <div>{flow.in}</div>
          </div>
          <div
            class={`w-[14em] p-2 bg-gradient-to-rb from-green-600 to-indigo-800 text-sm text-white ${flexChildClass}`}
          >
            balance: <CurrentBalance flowRate={flow.out - flow.in} />
            <div>{Math.round(props.distanceToParking)}m to goal</div>
            flowRate: {flow.out} - {flow.in} = {flow.out - flow.in}
            <h3 class="font-bold text-center text-sm pt-2">Your Wallet</h3>
          </div>
          <div
            class={`text-center w-12 ${
              flow.out ? "text-blue-500" : "text-gray-400"
            } ${flexChildClass}`}
          >
            <div class="text-lg">out</div>
            <div class="text-5xl leading-5 -mx-8 text-center">→</div>
            <div>{flow.out}</div>
          </div>
          <div
            class={`text-center text-sm bg-blue-100 ${flexChildClass}`}
          >
            <img src="/system.png" class="w-12 block" />
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
