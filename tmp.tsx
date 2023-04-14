import React, {
  useEffect,
  useState,
} from "https://esm.sh/react@18.2.0?target=es2020";
// @deno-types="https://esm.sh/v114/@superfluid-finance/sdk-core@0.6.3/dist/module/index.d.ts"
import { Framework } from "./build/superfluid.js";
import {
  Button,
  Card,
  Form,
  FormControl,
  FormGroup,
  Spinner,
} from "https://esm.sh/react-bootstrap@2.7.2?target=es2020";
// import "./updateFlow.css";
import { ethers } from "https://esm.sh/ethers@6.3.0?target=es2020";

// let account;

//where the Superfluid logic takes place
async function updateFlowAsOperator(sender, recipient, flowRate) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = provider.getSigner();

  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  const sf = await Framework.create({
    chainId: Number(chainId),
    provider: provider,
  });

  const daix = await sf.loadSuperToken("fDAIx");

  console.log("sender: ", sender);
  console.log("receiver: ", recipient);
  console.log("flow rate : ", flowRate);
  console.log("signer: ", signer);
  try {
    const updateFlowOperation = daix.updateFlowByOperator({
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

export const UpdateFlowAsOperator = () => {
  const [sender, setSender] = useState("");
  const [recipient, setRecipient] = useState("");
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [flowRate, setFlowRate] = useState("");
  const [flowRateDisplay, setFlowRateDisplay] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      // let account = currentAccount;
      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      // setupEventListener()
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });
    const chain = await window.ethereum.request({ method: "eth_chainId" });
    let chainId = chain;
    console.log("chain ID:", chain);
    console.log("global Chain Id:", chainId);
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
      // Setup listener! This is for the case where a user comes to our site
      // and ALREADY had their wallet connected + authorized.
      // setupEventListener()
    } else {
      console.log("No authorized account found");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  function calculateFlowRate(amount) {
    if (typeof Number(amount) !== "number" || isNaN(Number(amount)) === true) {
      alert("You can only calculate a flowRate based on a number");
      return;
    } else if (typeof Number(amount) === "number") {
      if (Number(amount) === 0) {
        return 0;
      }
      const amountInWei = ethers.BigNumber.from(amount);
      const monthlyAmount = ethers.utils.formatEther(amountInWei.toString());
      const calculatedFlowRate = monthlyAmount * 3600 * 24 * 30;
      return calculatedFlowRate;
    }
  }

  function UpdateButton({ isLoading, children, ...props }) {
    return (
      <Button variant="success" className="button" {...props}>
        {isButtonLoading ? <Spinner animation="border" /> : children}
      </Button>
    );
  }

  const handleSenderChange = (e) => {
    setSender(() => ([e.target.name] = e.target.value));
  };

  const handleRecipientChange = (e) => {
    setRecipient(() => ([e.target.name] = e.target.value));
  };

  const handleFlowRateChange = (e) => {
    setFlowRate(() => ([e.target.name] = e.target.value));
    let newFlowRateDisplay = calculateFlowRate(e.target.value);
    setFlowRateDisplay(newFlowRateDisplay.toString());
  };

  return (
    <div>
      <h2>Update a Flow as an Operator</h2>
      {currentAccount === ""
        ? (
          <button id="connectWallet" className="button" onClick={connectWallet}>
            Connect Wallet
          </button>
        )
        : (
          <Card className="connectedWallet">
            {`${currentAccount.substring(0, 4)}...${
              currentAccount.substring(
                38,
              )
            }`}
          </Card>
        )}
      <Form>
        <FormGroup className="mb-3">
          <FormControl
            name="sender"
            value={sender}
            onChange={handleSenderChange}
            placeholder="Enter sender address"
          >
          </FormControl>
        </FormGroup>
        <FormGroup className="mb-3">
          <FormControl
            name="recipient"
            value={recipient}
            onChange={handleRecipientChange}
            placeholder="Enter recipient address"
          >
          </FormControl>
        </FormGroup>
        <FormGroup className="mb-3">
          <FormControl
            name="flowRate"
            value={flowRate}
            onChange={handleFlowRateChange}
            placeholder="Enter a flowRate in wei/second"
          >
          </FormControl>
        </FormGroup>
        <UpdateButton
          onClick={() => {
            setIsButtonLoading(true);
            updateFlowAsOperator(sender, recipient, flowRate);
            setTimeout(() => {
              setIsButtonLoading(false);
            }, 1000);
          }}
        >
          Click to Update Stream
        </UpdateButton>
      </Form>

      <div className="description">
        <p>
          Go to the UpdateFlowAsOperator.js component and look at the{" "}
          <b>updateFlowAsOperator()</b>
          function to see under the hood. Note: you should use Goerli.
        </p>
        <div className="calculation">
          <p>Your flow will be equal to:</p>
          <p>
            <b>${flowRateDisplay !== " " ? flowRateDisplay : 0}</b> DAIx/month
          </p>
        </div>
      </div>
    </div>
  );
};
