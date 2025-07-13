import Web3 from "web3";
import GreenLedger from "./GreenLedger.json";

const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

const contract = async () => {
  const chainId = await web3.eth.getChainId(); // ✅ CHANGED FROM getId()
  const deployedNetwork = GreenLedger.networks[chainId];

  if (!deployedNetwork || !deployedNetwork.address) {
    throw new Error(`Smart contract not deployed on chain ID ${chainId}`);
  }

  return new web3.eth.Contract(GreenLedger.abi, deployedNetwork.address);
};

export { web3, contract };
