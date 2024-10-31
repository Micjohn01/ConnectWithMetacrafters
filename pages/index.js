import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [percentage, setPercentage] = useState("");
  const [accountActivity, setAccountActivity] = useState({ deposits: 0, withdrawals: 0 });
  const [withdrawalLimit, setWithdrawalLimit] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer,);
    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const getAccountActivity = async () => {
    if (atm) {
      const [deposits, withdrawals] = await atm.getAccountActivity();
      setAccountActivity({ deposits: deposits.toNumber(), withdrawals: withdrawals.toNumber() });
    }
  };


  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait();
      getBalance();
      getAccountActivity();
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait();
      getBalance();
      setWithdrawalLimit("");
      getAccountActivity();
    }
  };

  const increaseBalanceByPercentage = async () => {
    if (atm && percentage) {
      let tx = await atm.increaseBalanceByPercentage(Number(percentage));
      await tx.wait();
      setPercentage("");
      getBalance();
      
    }
  };

  const setLimit = async () => {
    if (atm && withdrawalLimit) {
      let tx = await atm.setWithdrawalLimit(withdrawalLimit);
      await tx.wait();
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    if (accountActivity.deposits === 0 && accountActivity.withdrawals === 0) {
      getAccountActivity();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <p>Total Deposits: {accountActivity.deposits}</p>
        <p>Total Withdrawals: {accountActivity.withdrawals}</p>
        <div>
          <button onClick={deposit}>Deposit 1 ETH</button>
          <button onClick={withdraw}>Withdraw 1 ETH</button>
        </div>
        <div>
          <input
            type="number"
            placeholder="Increase Balance by %"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
          />
          <button onClick={increaseBalanceByPercentage}>Increase Balance</button>
        </div>
        <div>
          <input
            type="number"
            placeholder="Set Withdrawal Limit"
            value={withdrawalLimit}
            onChange={(e) => setWithdrawalLimit(e.target.value)}
          />
          <button onClick={setLimit}>Set Withdrawal Limit</button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to Micjohn Crypto ATM</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}</style>
    </main>
  );
}
