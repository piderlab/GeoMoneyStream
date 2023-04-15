import { IS_BROWSER } from "$fresh/runtime.ts";
import { type StateUpdater, useEffect, useRef } from "preact/hooks";

import { walletAddress } from "./signals.ts";

// import * as L from "https://esm.sh/leaflet@1.9.3/";
const leafletUrl = "https://esm.sh/leaflet@1.9.3/";

let L: typeof import("https://esm.sh/leaflet@1.9.3/");
let carIcon: ReturnType<typeof L.icon>;
if (IS_BROWSER) {
  L = await import("https://esm.sh/leaflet@1.9.3/");
  await import("../lib/MovingMarker.js");

  // default icon
  const blueIcon = L.icon({
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
    // iconRetinaUrl: `${leafletUrl}dist/images/marker-icon-2x.png`,
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
  // styleElement.sheet = leafletStyle;
  // const leafletStyle = new CSSStyleSheet();
  // (async () => { // avoid tla
  //   const res = await fetch(styleUrl);
  //   leafletStyleElement.sheet!.replace(await res.text());
  // })();
}

// const defaultLat = 35.654246;
// const defaultLon = 139.741146;
const 地図中心: [number, number] = [35.664883, 139.725265];

const 虎ノ門ヒルズ: [number, number] = [35.6671145, 139.7499026];

// const 六本木ヒルズLat = 35.6594175;
// const 六本木ヒルズLon = 139.7301143;
const 渋谷: [number, number] = [35.6579364, 139.7017251];

const pointA: [number, number] = [35.68, 139.72]; //hh
const pointB: [number, number] = [35.64, 139.74]; //hh

interface MapProps {
  setDistanceToParking: StateUpdater<number>;
  // distanceToParking: Signal<number>;
}

export default function Map(props: MapProps) {
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const map = L.map(divRef.current!).setView(地図中心, 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    L.control.scale().addTo(map);

    // アイコン追加
    L.marker(虎ノ門ヒルズ).addTo(map);
    L.marker(渋谷).addTo(map);
    L.marker(pointA).addTo(map); //hh
    L.marker(pointB).addTo(map); //hh

    // 円
    L.circle(虎ノ門ヒルズ, {
      radius: 2000,
      color: "blue",
      fillColor: "#93C5FD",
      fillOpacity: 0.5,
      weight: 0,
    }).addTo(map);
    L.circle(虎ノ門ヒルズ, {
      radius: 1000,
      color: "green",
      fillColor: "#A7F3D0",
      fillOpacity: 0.5,
      weight: 0,
    }).addTo(map);
    L.circle(虎ノ門ヒルズ, {
      radius: 500,
      color: "red",
      fillColor: "#FCA5A5",
      fillOpacity: 0.5,
      weight: 0,
    }).addTo(map);
    //L.polyline([虎ノ門ヒルズ, 渋谷], {
    //  color: "#000000",
    //  weight: 3,
    //}).addTo(map);

    // 車のアイコン
    const 渋谷Marker = L.Marker.movingMarker([渋谷, 虎ノ門ヒルズ], [20000], {
      draggable: true,
      icon: carIcon!,
    })
      .addTo(map);
    渋谷Marker.on("mousedown", () => {
      渋谷Marker.stop();
    });
    渋谷Marker.on("mouseup", () => {
      渋谷Marker.moveTo(虎ノ門ヒルズ, 20000);
    });
    walletAddress.subscribe((newValue) => {
      if (newValue) {
        渋谷Marker.start();
      }
    });

    渋谷Marker.on("move", (e: unknown) => {
      const distance = (e as L.LeafletMouseEvent).latlng.distanceTo(
        虎ノ門ヒルズ,
      );
      props.setDistanceToParking(distance);
    });

    // props.setDistanceToParking(
    //   渋谷Marker.getLatLng().distanceTo(虎ノ門ヒルズ),
    // );
  }, []);
  return (
    <>
      {/* <button onClick={() => props.setDistanceToParking(100)}>aaa</button> */}
      <div class="w-1/2 h-screen" ref={divRef}></div>
    </>
  );
}
