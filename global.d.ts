import type {
  BrowserProvider,
  Eip1193Provider,
} from "https://esm.sh/ethers@6.3.0/types/providers/index.d.ts";

declare global {
  interface Window {
    ethereum:
      | undefined
      | BrowserProvider & Eip1193Provider;
  }
}
