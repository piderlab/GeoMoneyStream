import { useEffect, useRef } from "preact/hooks";

interface CurrentBalanceProps {
  /**wei/秒*/
  flowRate: number;
}

const 残高の初期値 = 10000; // 適当

export default function CurrentBalance(props: CurrentBalanceProps) {
  const balanceRef = useRef(残高の初期値);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let shouldContinue = true;
    let preTime = performance.now();
    // 残高を計算してアップデートする
    (async () => {
      while (shouldContinue) {
        const time = await requestAnimationFramePromise();
        const pastTime = Math.max(0, time - preTime) / 1000;
        balanceRef.current -= props.flowRate * pastTime;
        if (balanceRef.current < 0) {
          shouldContinue = false;
          balanceRef.current = 0;
        }
        spanRef.current!.textContent = `${round10(balanceRef.current)}`;
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

function round10(num: number) {
  return Math.round(num * (10 ** 5)) / (10 ** 5);
}
