import { IS_BROWSER } from "$fresh/runtime.ts";
import { useEffect, useRef } from "preact/hooks";
import { computed, effect, type Signal, signal } from "@preact/signals";

// @deno-types="https://esm.sh/v114/@superfluid-finance/sdk-core@0.6.3/dist/module/index.d.ts"
import { Framework, type SuperToken } from "../build/superfluid.js";
import { ethers } from "https://esm.sh/ethers@5.7.2?target=es2020";
import { formatWei } from "../utils/eth.ts";

import CurrentBalance from "./CurrentBalance.tsx";

const initialBalance = signal(0);

interface MoneyRouterProps {
  flowRate: Signal<{ in: number; out: number }>;
  flowRateValue: Signal<number>;
  distanceToParking: Signal<number>;
  walletAddress: Signal<string | null>;
  token: Signal<SuperToken | null>;
  transactionWaiter: Signal<number>;
}

export default function MoneyRouter(props: MoneyRouterProps) {
  // useEffect(() => {
  //   let hasFlow = false;
  //   return props.flowRateValue.subscribe((newFlowRate) => {
  //     if (!IS_BROWSER) {
  //       return;
  //     }
  //     if (!window.ethereum) {
  //       alert("please get Metamask");
  //       return;
  //     }
  //     if (!token.value) {
  //       console.log("token is undefined");
  //       return;
  //     }
  //     if (!props.walletAddress.value) {
  //       console.log("walletAddress is undefined");
  //       return;
  //     }
  //     console.log("start update flowRate", newFlowRate);
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);

  //     const signer = provider.getSigner();

  //     if (newFlowRate === 0) {
  //       if (hasFlow) {
  //         const updateFlowOperation = token.value.deleteFlow({
  //           sender: props.walletAddress.value!,
  //           receiver: SYSTEM_ACCOUNT,
  //         });
  //         updateFlowOperation.exec(signer)
  //           .then((result) => console.log(result));
  //       }
  //     } else {
  //       if (hasFlow) {
  //         const updateFlowOperation = token.value.updateFlow({
  //           sender: props.walletAddress.value!,
  //           receiver: SYSTEM_ACCOUNT,
  //           flowRate: `${newFlowRate}`,
  //         });
  //         updateFlowOperation.exec(signer)
  //           .then((result) => console.log(result));
  //       } else {
  //         const updateFlowOperation = token.value.createFlow({
  //           sender: props.walletAddress.value!,
  //           receiver: SYSTEM_ACCOUNT,
  //           flowRate: `${newFlowRate}`,
  //         });
  //         updateFlowOperation.exec(signer)
  //           .then((result) => console.log(result));
  //         hasFlow = true;
  //       }
  //     }
  //   });
  // }, []);

  const flowRate = props.flowRate.value;
  const flowRateIn = formatWei(flowRate.in);
  const flowRateOut = formatWei(flowRate.out);
  const childClass = "px-1 mx-4 my-8 bg-white rounded shadow";
  const flexChildClass = "p-1 rounded";
  return (
    <div class="w-[600px] flex-grow flex-shrink-0 bg-gray-100 overflow-y-scroll shadow-inner">
      <div class={childClass}>
        <h2 class="text-2xl p-1">1. Connect wallet</h2>
        First you need to connect a wallet such as Metamask.<br />
        <button
          class="inline m-4 p-1 rounded shadow text-white bg-[#16A34A]"
          onClick={() => onWalletConnect({ ...props, initialBalance })}
        >
          Connect wallet
        </button>
        <span class="border p-1 text-sm">{props.walletAddress.value}</span>
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
            class={`text-center w-16 transition-colors duration-500 ${
              flowRate.in ? "text-[#84CC16]" : "text-gray-400"
            } ${flexChildClass}`}
          >
            <div class="text-lg">in</div>
            <div class="text-5xl leading-5 -mx-8 text-center">→</div>
            <div>{flowRateIn}</div>
          </div>
          <div
            class={`w-[18em] p-2 flex-shrink-0 bg-gradient-to-rb from-green-600 to-indigo-800 text-sm text-white ${flexChildClass}`}
          >
            <div>
              balance:<br />
              &nbsp;<CurrentBalance
                flowRate={flowRate.out - flowRate.in}
                initialBalance={initialBalance}
                transactionWaiter={props.transactionWaiter}
              />
            </div>
            <div>
              flowRate:<br />
              &nbsp;{flowRateOut} - {flowRateIn} ={" "}
              <span class="text-xl">
                {formatWei(flowRate.out - flowRate.in)}
              </span>
            </div>
            <div class="text-right">
              ({Math.round(props.distanceToParking.value)}m to goal)
            </div>
            <h3 class="font-bold text-center text-sm pt-2">Your wallet</h3>
          </div>
          <div
            class={`text-center w-16 transition-colors duration-500 ${
              flowRate.out ? "text-red-400" : "text-gray-400"
            } ${flexChildClass}`}
          >
            <div class="text-lg">out</div>
            <div class="text-5xl leading-5 -mx-8 text-center">→</div>
            <div>{flowRateOut}</div>
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

async function onWalletConnect(
  props: {
    walletAddress: Signal<string | null>;
    initialBalance: Signal<number>;
    token: Signal<SuperToken | null>;
  },
) {
  if (!window.ethereum) {
    alert("please get Metamask");
    return;
  }
  const accounts = await window.ethereum.request!({
    method: "eth_requestAccounts",
  });

  // get balance
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  // const ethbalance = await provider.getBalance(accounts[0]);
  // console.log(ethbalance);

  const chainId = await window.ethereum.request!({
    method: "eth_chainId",
  });
  const sf = await Framework.create({
    chainId: Number(chainId),
    provider: provider,
  });

  const daix = await sf.loadSuperToken("fDAIx");
  console.log(daix);
  const balance = await daix.balanceOf({
    account: accounts[0],
    providerOrSigner: provider,
  });
  console.log(balance);
  props.walletAddress.value = accounts[0];
  props.initialBalance.value = Number(balance);
  props.token.value = daix;
}
