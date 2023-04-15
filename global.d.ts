import type {
  providers,
  // BrowserProvider,
  // Eip1193Provider,
  // } from "https://esm.sh/ethers@5.7.2/types/providers/index.d.ts";
} from "https://esm.sh/v115/ethers@5.7.2/lib/index.d.ts";

declare global {
  interface Window {
    ethereum:
      | undefined
      // | BrowserProvider & Eip1193Provider;
      | providers.ExternalProvider;
  }
}
// .providers.ExternalProvider;
