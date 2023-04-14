// @ts-check

// @deno-types="https://esm.sh/v114/@superfluid-finance/sdk-core@0.6.3/dist/module/index.d.ts"
import { Framework } from "./build/superfluid.js";
import { ethers } from "https://esm.sh/ethers@5.6.5?target=es2020";
// import { ethers } from "https://esm.sh/hardhat@2.13.1?target=es2020";

/// <reference path="./global.d.ts" />

//where the Superfluid logic takes place
export async function updateFlowAsOperator(sender, recipient, flowRate) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = provider.getSigner();

  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  const sf = await Framework.create({
    chainId: Number(chainId),
    provider: provider,
  });

  // const daix = await sf.loadSuperToken("fDAIx");
  const daix = await sf.loadSuperToken("ETHx");
  console.log({ daix });

  console.log("sender: ", sender);
  console.log("receiver: ", recipient);
  console.log("flow rate : ", flowRate);
  console.log("signer: ", signer);
  try {
    // const updateFlowOperation = daix.updateFlowByOperator({
    //   sender: sender,
    //   receiver: recipient,
    //   flowRate: flowRate,
    //   // userData?: string
    // });

    //
    const updateFlowOperation = daix.createFlowByOperator({
      sender: sender,
      receiver: recipient,
      flowRate: flowRate,
      // userData?: string
    });

    console.log(updateFlowOperation);

    console.log("Updating your stream...");

    const result = await updateFlowOperation.exec(signer);
    console.log(result);

    console.log(
      `Congrats - you've just updated your money stream!
    View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}
    Network: Goerli
    Super Token: DAIx
    Sender: 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721
    Receiver: ${recipient},
    FlowRate: ${flowRate}
    `,
    );
  } catch (error) {
    console.log(
      "Hmmm, your transaction threw an error. Make sure that this stream exists, and that you've entered a valid Ethereum address!",
    );
    console.error(error);
  }
}

Object.assign(globalThis, { updateFlowAsOperator });
