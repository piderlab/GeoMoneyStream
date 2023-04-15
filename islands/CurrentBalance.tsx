import { useEffect, useRef } from "preact/hooks";
import { effect, type Signal } from "@preact/signals";

import { formatWei } from "../utils/eth.ts";

interface CurrentBalanceProps {
  initialBalance: Signal<number>;
  transactionWaiter: Signal<number>;
  /**wei/秒*/
  flowRate: number;
}

export default function CurrentBalance(props: CurrentBalanceProps) {
  const balanceRef = useRef(0);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let shouldContinue = true;
    let preTime = performance.now();

    // ウォレット接続されたら残高設定
    effect(() => {
      if (balanceRef.current === 0) {
        balanceRef.current = props.initialBalance.value;
      }
    });
    spanRef.current!.textContent = balanceRef.current.toString();
    // 残高を計算してアップデートする
    (async () => {
      while (shouldContinue) {
        const time = await requestAnimationFramePromise();
        if (props.flowRate === 0) {
          continue;
        }
        if (props.transactionWaiter.value !== 0) {
          continue;
        }
        const pastTime = Math.max(0, time - preTime) / 1000;
        balanceRef.current -= props.flowRate * pastTime;
        if (balanceRef.current < 0) {
          shouldContinue = false;
          balanceRef.current = 0;
        }
        spanRef.current!.textContent = formatWei(balanceRef.current);
        preTime = time;
      }
    })();

    // on effect end
    return () => {
      shouldContinue = false;
    };
  }, [props.flowRate]);
  return <span class="text-xl" ref={spanRef}></span>;
}

const requestAnimationFramePromise = () =>
  new Promise<number>((ok) => globalThis.requestAnimationFrame(ok));
