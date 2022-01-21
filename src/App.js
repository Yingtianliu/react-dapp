import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
const { ethers } = require("ethers");
const { useState } = require("react");
require('./App.css');

// Update with the contract address logged out to the CLI when it was deployed 
const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
function App() {
  // store greeting in local state
  const [greeting, setGreetingValue] = useState('')

  //请求account information from metamask wallets
  //request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  //call the smart contract, read the current greeting value
  async function fetchGreeting() {
    // console.log("Fetching greeting");
    // const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // await provider.send("eth_requestAccounts", []);
    // const signer = provider.getSigner();
    // console.log("Account:", await signer.getAddress());
    if (typeof window.ethererum !== undefined) {
      // 需要 Metamask Extension to be Connected, 然后继续
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      // console.log(Greeter)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        console.log("data: ", data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

  // call the smart contract, send an update
  async function setGreeting() {
    //确认用户type in了greeting
    if (!greeting) return
    if (typeof window.ethereum !== undefined) {
      //等待用户 enable accout to be used
      await requestAccount()
      // Another provider.    Provider & Signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({ provider })
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting);
      await transaction.wait();
      fetchGreeting();
      //log out new value to make sure things work
    }
  }
  // UI界面
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input
          onChange={e => setGreetingValue(e.target.value)}
          placeholder="Set greeting"
          value={greeting}
        />
      </header>
    </div>
  );
}

export default App;