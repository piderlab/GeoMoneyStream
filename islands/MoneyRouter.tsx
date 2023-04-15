import { useState } from "preact/hooks";
import type { Signal } from "@preact/signals";

import CurrentBalance from "./CurrentBalance.tsx";

interface MoneyRouterProps {
  flowRate: Signal<{ in: number; out: number }>;
  distanceToParking: Signal<number>;
  walletAddress: Signal<string | null>;
}

export default function MoneyRouter(props: MoneyRouterProps) {
  const flowRate = props.flowRate.value;
  const childClass = "px-1 mx-4 my-8 bg-white rounded shadow";
  const flexChildClass = "p-1 rounded";
  return (
    <div class="w-1/2 bg-gray-100 overflow-y-scroll shadow-inner">
      <div class={childClass}>
        <h2 class="text-2xl p-1">1. Connect wallet</h2>
        First you need to connect a wallet such as Metamask.<br />
        <button
          class="m-4 p-1 rounded shadow text-white bg-[#16A34A]"
          onClick={() => props.walletAddress.value = "aaa"}
        >
          Connect wallet
        </button>
      </div>
      <div class={childClass}>
        <h2 class="text-2xl p-1">2. Money streaming</h2>
        <div class="flex items-center justify-center p-1">
          <div
            class={`text-center text-sm bg-blue-100 ${flexChildClass}`}
          >
            <img src="/system.png" class="w-12 block" />
            System
          </div>
          <div
            class={`text-center w-12 ${
              flowRate.in ? "text-[#84CC16]" : "text-gray-400"
            } ${flexChildClass}`}
          >
            <div class="text-lg">in</div>
            <div class="text-5xl leading-5 -mx-8 text-center">→</div>
            <div>{flowRate.in}</div>
          </div>
          <div
            class={`w-[14em] p-2 bg-gradient-to-rb from-green-600 to-indigo-800 text-sm text-white ${flexChildClass}`}
          >
            balance: <CurrentBalance flowRate={flowRate.out - flowRate.in} />
            <div>{Math.round(props.distanceToParking.value)}m to goal</div>
            flowRate: {flowRate.out} - {flowRate.in} ={" "}
            {flowRate.out - flowRate.in}
            <h3 class="font-bold text-center text-sm pt-2">Your wallet</h3>
          </div>
          <div
            class={`text-center w-12 ${
              flowRate.out ? "text-red-400" : "text-gray-400"
            } ${flexChildClass}`}
          >
            <div class="text-lg">out</div>
            <div class="text-5xl leading-5 -mx-8 text-center">→</div>
            <div>{flowRate.out}</div>
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
