# COE892_Project Blockchain Voting System
## Overview
The Blockchain Voting System is a decentralized application designed to provide a secure, transparent, and tamper-proof election process. It uses Ethereum smart contracts written in Solidity to manage the voting process, ensuring immutability and fairness.

## Features
- Decentralized Voting: Uses blockchain technology to prevent vote manipulation.
- Smart Contract-Based: Voting logic is implemented with Solidity smart contracts.
- User Authentication: Voters interact with the system using Ethereum wallets such as MetaMask.
- Real-Time Results: The application displays vote counts instantly after submission.
- Secure Transactions: Every vote is recorded as a transaction on the blockchain, ensuring integrity.

## Technologies Used
- Solidity: Smart contract programming language.
- Truffle: Development framework for Ethereum-based DApps.
- Ganache: Local Ethereum blockchain for testing.
- MetaMask: Wallet for interacting with Ethereum-based applications.
- React & Material UI: Front-end framework and UI components.
- Ethers.js: Library for interacting with the Ethereum blockchain.

## Installation and Setup
### Prerequisites
- Install Node.js
- Install Truffle
- Install Ganache
- Install MetaMask

### Steps to Run the Project
- Clone the Repository
```git clone https://github.com/yourusername/blockchain-voting-system.git```
- Install Dependencies
```npm install```
- Start Ganache and quickstart a new workspace
- Compile and Deploy the Smart Contract
```
truffle compile
truffle migrate --network development
```
- Run the Front-End Application
```
npm run dev
```
- Connect to MetaMask
  - Import a test account from Ganache into MetaMask.
  - Switch to the local blockchain network.
- You can redeploy the contract anytime to reset the candidate and votecounts and allow wallets that voted before to vote again
```
truffle migrate --reset
```

## Usage
- Users can view available candidates and vote using their Ethereum wallet.
- The system prevents duplicate voting by tracking addresses.
- Voting results are updated in real-time and displayed graphically.
