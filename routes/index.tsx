import { Head } from "$fresh/runtime.ts";
import { useState } from "preact/hooks";
// import Counter from "../islands/Counter.tsx";
import Map from "../islands/Map.tsx";
import MoneyRouter from "../islands/MoneyRouter.tsx";
import Main from "../islands/Main.tsx";

export default function Home() {
  // const [distanceToParking, setDistanceToParking] = useState(0);
  return (
    <>
      <Head>
        <title>Driving Commons</title>
        {/* <!-- Copyright 2018 Twitter, Inc and other contributors. Graphics licensed under CC-BY 4.0: https://creativecommons.org/licenses/by/4.0/ --> */}
        <link rel="icon" type="image/png" href="https://favi.deno.dev/🚗.png" />
        <link rel="apple-touch-icon" href="https://favi.deno.dev/🚗.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          {...{ crossorigin: true }}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c&amp;display=swap"
          rel="stylesheet"
          as="style"
          {...{ onload: "this.rel='stylesheet'" }}
        />
        <style>{"*{font-family: 'M PLUS Rounded 1c', sans-serif;}"}</style>
      </Head>
      {
        /* <img
          src="/logo.svg"
          class="w-32 h-32"
          alt="the fresh logo: a sliced lemon dripping with juice"
        />
        <p class="my-6">
          Welcome to `fresh`. Try updating this message in the
          ./routes/index.tsx file, and refresh.
        </p> */
      }
      {/* <Counter start={3} /> */}
      {
        /* <Map setDistanceToParking={setDistanceToParking} />
        <MoneyRouter distanceToParking={distanceToParking} /> */
      }
      <Main />
    </>
  );
}
