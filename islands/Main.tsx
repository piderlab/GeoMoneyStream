import { useEffect, useRef, useState } from "preact/hooks";
import { signal, useSignal } from "@preact/signals";

import Map from "../islands/Map.tsx";
import MoneyRouter from "../islands/MoneyRouter.tsx";

export default function Main() {
  // const distanceToParking = useSignal(0);
  const [distanceToParking, setDistanceToParking] = useState(0);
  return (
    <div class="flex w-full">
      <Map setDistanceToParking={setDistanceToParking} />
      <MoneyRouter distanceToParking={distanceToParking} />
    </div>
  );
}
