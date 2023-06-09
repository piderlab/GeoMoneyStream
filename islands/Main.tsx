import { IS_BROWSER } from "$fresh/runtime.ts";
import { computed, effect, type Signal, signal } from "@preact/signals";

import { ethers } from "https://esm.sh/ethers@5.7.2?target=es2020";
// @deno-types="https://esm.sh/v114/@superfluid-finance/sdk-core@0.6.3/dist/module/index.d.ts"
import { type SuperToken } from "../build/superfluid.js";

import Map from "../islands/Map.tsx";
import MoneyRouter from "../islands/MoneyRouter.tsx";

// state管理
// 1. 初期状態        walletAddress=null, flowRate={in: 0, out: 0}
//  ↓ ウォレット接続
// 2. 車スタート      walletAddress=...., flowRate={in: ..., out: ...}
//  ↓ 10秒経過
// 3. incomingエリアやoutcomingエリアに出たり入ったりする
//  ↓ ゴール到着
// 4. 終了            walletAddress=...., flowRate={in: 0, out: 0}

const USE_METAMASK = true;

const walletAddress = signal<string | null>(null);
const distanceToParking = signal<number>(0);
const flowRate = signal<{ in: number; out: number }>({ in: 0, out: 0 });
const token = signal<SuperToken | null>(null);
// トランザクション待ちの数。参照カウント方式。
const transactionWaiter = signal<number>(0);

const flowRateValue = computed(() => flowRate.value.out - flowRate.value.in);

const SYSTEM_ACCOUNT = "0xF547dB53bFA9FF57EB469Ac82cD770E1BB991EA1";
if (IS_BROWSER && USE_METAMASK) {
  // let hasFlow = false;
  let preFlowRate: number | undefined = undefined;
  flowRateValue.subscribe(async (newFlowRate) => {
    if (newFlowRate === preFlowRate) {
      return;
    }
    preFlowRate = newFlowRate;
    // console.log("flowRate update", { hasFlow });
    if (!window.ethereum) {
      alert("please get Metamask");
      return;
    }
    if (!token.value) {
      console.log("token is undefined");
      return;
    }
    if (!walletAddress.value) {
      console.log("walletAddress is undefined");
      return;
    }
    console.log("start update flowRate", newFlowRate);
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();

    const currentFlow = await token.value.getFlow({
      sender: walletAddress.value,
      receiver: SYSTEM_ACCOUNT,
      providerOrSigner: provider,
    });
    const hasFlow = Number(currentFlow.flowRate) !== 0;

    if (newFlowRate === 0) {
      if (hasFlow) {
        console.log("delete");
        const updateFlowOperation = token.value.deleteFlow({
          sender: walletAddress.value,
          receiver: SYSTEM_ACCOUNT,
        });
        transactionWaiter.value++;
        updateFlowOperation.exec(signer)
          .then((result) => {
            console.log(result);
          }).finally(() => {
            transactionWaiter.value--;
          });
        // hasFlow = false;
      }
    } else {
      if (hasFlow) {
        console.log("update");
        const updateFlowOperation = token.value.updateFlow({
          sender: walletAddress.value,
          receiver: SYSTEM_ACCOUNT,
          flowRate: `${newFlowRate}`,
        });
        transactionWaiter.value++;
        updateFlowOperation.exec(signer)
          .then((result) => {
            console.log(result);
          }).finally(() => {
            transactionWaiter.value--;
          });
      } else {
        console.log("create");
        const updateFlowOperation = token.value.createFlow({
          sender: walletAddress.value,
          receiver: SYSTEM_ACCOUNT,
          flowRate: `${newFlowRate}`,
        });
        transactionWaiter.value++;
        updateFlowOperation.exec(signer)
          .then((result) => {
            console.log(result);
          }).finally(() => {
            transactionWaiter.value--;
          });
        // hasFlow = true;
      }
    }
  });
}

export default function Main() {
  return (
    <div class="flex w-full text-gray-800">
      <Map
        flowRate={flowRate}
        distanceToParking={distanceToParking}
        walletAddress={walletAddress}
        transactionWaiter={transactionWaiter}
      />
      <MoneyRouter
        flowRate={flowRate}
        flowRateValue={flowRateValue}
        distanceToParking={distanceToParking}
        walletAddress={walletAddress}
        token={token}
        transactionWaiter={transactionWaiter}
      />
    </div>
  );
}
