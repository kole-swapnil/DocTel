import Web3 from "web3";

const getWeb3 = async () => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    return web3;
  }

  if (window.web3) {
    return window.web3;
  }

  const provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
  return new Web3(provider);
};

export default getWeb3;
