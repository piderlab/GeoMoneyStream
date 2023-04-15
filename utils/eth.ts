import { ethers } from "https://esm.sh/ethers@5.7.2?target=es2020";

export function formatWei(balanceInWei: number) {
  return ethers.utils.formatEther(
    balanceInWei.toLocaleString("fullwide", { useGrouping: false }),
  );
}
