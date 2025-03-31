'use client';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function Voting() {
  const [contractAddress, setContractAddress] = useState('');
  const [candidate, setCandidate] = useState('');
  const [votes, setVotes] = useState(null);
  const [votedCandidate, setVotedCandidate] = useState('');
  const [voteData, setVoteData] = useState([]);


  const abi = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "candidates",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "hasVoted",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "votes",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "candidate",
          "type": "string"
        }
      ],
      "name": "vote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "candidate",
          "type": "string"
        }
      ],
      "name": "getVotes",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getAllCandidates",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ];

  useEffect(() => {
    async function fetchContractAddress() {
      try {
        const response = await fetch('/contractAddress.json'); // Fetch locally stored contract address
        const data = await response.json();
        setContractAddress(data.address);
      } catch (error) {
        console.error('Error fetching contract address:', error);
      }
    }
    fetchContractAddress();
  }, []);

  async function requestAccount() {
    if (!window.ethereum) {
      alert('MetaMask is required to use this app!');
      return;
    }
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }


  async function handleVote() {
    try {
      await requestAccount();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
  
      const tx = await contract.vote(candidate);
      await tx.wait();
      const count = await contract.getVotes(candidate);
      setVotes(count.toString());
      setVotedCandidate(candidate)
      alert(`Voted for ${candidate}!`);
    } catch (err) {
      if (err.message.includes("already voted") || err.message.includes("revert")) {
        alert("You have already voted! Each wallet is allowed only one vote.");
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  } 

  async function handleCheckVotes() {
    if (typeof window === 'undefined' || !window.ethereum) {
      alert('MetaMask is required to use this app!');
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);

      const count = await contract.getVotes(candidate);
      setVotes(count.toString());
      setVotedCandidate(candidate)
    } catch (err) {
      console.error('Error reading votes:', err);
    }
  }

  return (
    <div style={{ padding: '40px' }}>
      <h1>🗳️ Blockchain Voting</h1>
      <input
        placeholder="Candidate name"
        value={candidate}
        onChange={(e) => setCandidate(e.target.value)}
        style={{ padding: '10px', marginRight: '10px' }}
      />
      <button onClick={handleVote} style={{ padding: '10px', marginRight: '10px' }}>
        Vote
      </button>
      <button onClick={handleCheckVotes} style={{ padding: '10px' }}>
        Check Votes
      </button>

      {votes !== null && (
        <h2>
          {votedCandidate} has {votes} votes!
        </h2>
      )}
    </div>
  );
}