# Starter Next/Hardhat Project

## Assessment Contract

The Assessment contract is a Solidity-based smart contract designed to manage deposits, withdrawals, and balance operations. This contract restricts certain actions to the contract owner, such as depositing, withdrawing, and modifying the balance. It also tracks account activities, including total deposits and withdrawals, and enforces a configurable withdrawal limit.

### Contract Summary

**Owner:** The creator of the contract, assigned during deployment, who has the exclusive right to perform certain actions.

**Balance:** Represents the current balance held within the contract.

**Withdrawal Limit:** A restriction on the maximum amount that can be withdrawn in a single transaction.

**Activity Tracking:** Tracks the total number of deposit and withdrawal transactions.

### Features

**Deposit Function:** Allows the owner to deposit funds and updates the balance accordingly.

**Withdraw Function:** Allows the owner to withdraw funds within a specified limit.

**Increase Balance:** Allows the owner to increase the balance by a percentage.

**Set Withdrawal Limit:** Allows the owner to set a limit on withdrawals to control fund outflow.

**View Account Activity:** Provides a summary of the total number of deposits and withdrawals.


After cloning the github, you will want to do the following to get the code running on your computer.

1. Inside the project directory, in the terminal type: npm i
2. Open two additional terminals in your VS code
3. In the second terminal type: npx hardhat node
4. In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js
5. Back in the first terminal, type npm run dev to launch the front-end.

After this, the project will be running on your localhost. 
Typically at http://localhost:3000/
