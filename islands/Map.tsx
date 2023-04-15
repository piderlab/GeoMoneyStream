import { IS_BROWSER } from "$fresh/runtime.ts";
import { useEffect, useRef } from "preact/hooks";
import type { Signal } from "@preact/signals";

const leafletUrl = "https://esm.sh/leaflet@1.9.3/";

let L: typeof import("https://esm.sh/leaflet@1.9.3/");
let blueIcon: ReturnType<typeof L.icon>;
let carIcon: ReturnType<typeof L.icon>;
if (IS_BROWSER) {
  L = await import("https://esm.sh/leaflet@1.9.3/");
  await import("../lib/MovingMarker.js");

  // default icon
  blueIcon = L.icon({
    iconUrl: `${leafletUrl}dist/images/marker-icon.png`,
    iconRetinaUrl: `${leafletUrl}dist/images/marker-icon-2x.png`,
    shadowUrl: `${leafletUrl}dist/images/marker-shadow.png`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
  });
  carIcon = L.icon({
    iconUrl: `/car_icon.png`,
    shadowUrl: `${leafletUrl}dist/images/marker-shadow.png`,
    iconSize: [60, 60],
    iconAnchor: [30, 30],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [60, 50],
  });

  // init stylesheet
  const styleUrl = `${leafletUrl}dist/leaflet.css`;
  const leafletStyleElement = document.createElement("link");
  leafletStyleElement.type = "text/css";
  leafletStyleElement.rel = "stylesheet";
  leafletStyleElement.href = styleUrl;
  document.head.append(leafletStyleElement);
}

const points = {
  地図中心: [35.664883, 139.725265],
  虎ノ門ヒルズ: [35.6671145, 139.7499026],
  渋谷: [35.6579364, 139.7017251],
  pointA: [35.68, 139.72], //hh
  pointB: [35.64, 139.74], //hh
} satisfies Record<string, [number, number]>;
const スタート地点 = points.渋谷;
const ゴール地点 = points.虎ノ門ヒルズ;

const defaultFlowRate = { in: 0, out: 40 };

interface Area {
  center: [number, number];
  flowRateList: {
    radius: number;
    flowRate: { in: number; out: number };
    color: string;
    fillColor: string;
  }[];
}

const areas: Area[] = [
  {
    // 中心座標
    center: points.虎ノ門ヒルズ,
    flowRateList: [{
      // 半径2000m以内の時は、追加で10トークンのincoming
      radius: 2000,
      flowRate: { in: 10, out: 0 },
      color: "blue",
      fillColor: "#93C5FD",
    }, {
      radius: 1000,
      flowRate: { in: 20, out: 0 },
      color: "green",
      fillColor: "#A7F3D0",
    }, {
      radius: 500,
      flowRate: { in: 30, out: 0 },
      color: "red",
      fillColor: "#FCA5A5",
    }],
  },
];

interface MapProps {
  flowRate: Signal<{ in: number; out: number }>;
  distanceToParking: Signal<number>;
  walletAddress: Signal<string | null>;
}

export default function Map(props: MapProps) {
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const map = L.map(divRef.current!).setView(points.地図中心, 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    L.control.scale().addTo(map);

    // アイコン追加
    L.marker(points.虎ノ門ヒルズ, { icon: blueIcon }).addTo(map);
    L.marker(points.渋谷, { icon: blueIcon }).addTo(map);
    L.marker(points.pointA, { icon: blueIcon }).addTo(map); //hh
    L.marker(points.pointB, { icon: blueIcon }).addTo(map); //hh

    // 円を追加
    for (const area of areas) {
      for (const { radius, color, fillColor } of area.flowRateList) {
        L.circle(area.center, {
          radius,
          color,
          fillColor,
          fillOpacity: 0.5,
          weight: 0,
        }).addTo(map);
      }
    }

    // 車のアイコン
    const carMarker = L.Marker
      .movingMarker([スタート地点, ゴール地点], [20000], {
        draggable: true,
        icon: carIcon,
      }).addTo(map)
      .on("mousedown", () => carMarker.stop())
      .on("mouseup", () => carMarker.moveTo(ゴール地点, 20000))
      .on("move", (e: unknown) => {
        const { latlng } = e as L.LeafletMouseEvent;
        props.flowRate.value = flowRateFromLatLng(latlng);
        props.distanceToParking.value = latlng.distanceTo(ゴール地点);
      });

    props.walletAddress.subscribe((newValue) => {
      if (newValue) {
        carMarker.start();
      }
    });
  }, []);
  return <div class="w-1/2 h-screen" ref={divRef}></div>;
}

function flowRateFromLatLng(latlng: L.LatLng) {
  const res = areas.map((area) => {
    const distance = latlng.distanceTo(area.center);
    let areaFlowRate = { in: 0, out: 0 };
    let minRadius = Infinity;
    for (const { radius, flowRate } of area.flowRateList) {
      if (distance < radius && radius < minRadius) {
        areaFlowRate = flowRate;
        minRadius = radius;
      }
    }
    return areaFlowRate;
  }).reduce((prev, current) => ({
    in: prev.in + current.in,
    out: prev.out + current.out,
  }), defaultFlowRate);

  if (res.out < res.in) {
    // 収入の方が大きい場合はNG(バグ)
    // outにclampする
    return { in: res.out, out: res.out };
  }
  return res;
}
