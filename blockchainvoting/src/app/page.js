'use client';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { BarChart } from '@mui/x-charts/BarChart';
import styles from './page.module.css';


export default function Voting() {
  const [contractAddress, setContractAddress] = useState('');
  const [candidate, setCandidate] = useState('');
  const [votes, setVotes] = useState(null);
  const [candidateNames, setCandidateNames] = useState([]);
  const [voteCounts, setVoteCounts] = useState([]);
  const [votedCandidate, setVotedCandidate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sanitizeVotingData, setSanitizeVotingData] = useState({})

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
        },
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
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
        const response = await fetch('/contractAddress.json');
        const data = await response.json();
        setContractAddress(data.address);
      } catch (error) {
        console.error('Error fetching contract address:', error);
      }
    }
    fetchContractAddress();
  }, []);

  useEffect(() => {
    async function getCandidates() {
      if (!contractAddress) return;

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, abi, provider);

        const [candidateNames2, voteCounts2] = await contract.getAllCandidates();


        if (!candidateNames2 || candidateNames2.length === 0) {
          throw new Error("No candidates found.");
        }

        setCandidateNames([...candidateNames2]);
        setVoteCounts(voteCounts2.map(num => num.toString()));

      } catch (err) {
        setError(err.message || 'Error reading votes');
      }
    }

    getCandidates();
  }, [contractAddress]);

  useEffect(() => {
    async function sanitizeData() {
      let results = {};
      candidateNames.forEach((name, index) => {
        let voteNum = voteCounts[index];
        results[name] = voteNum;
      });

      setSanitizeVotingData((prevData) => {
        if (JSON.stringify(prevData) === JSON.stringify(results)) return prevData;
        return results;
      });
    }

    if (candidateNames.length > 0 && voteCounts.length > 0) {
      sanitizeData();
    }
  }, [voteCounts, candidateNames]);

  async function requestAccount() {
    if (!window.ethereum) {
      setError('MetaMask is required to use this app!');
      return false;
    }
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      return true;
    } catch (err) {
      setError('Failed to connect to MetaMask');
      return false;
    }
  }

  async function handleVote() {
    setError('');
    setIsLoading(true);
    try {
      if (!candidate) {
        throw new Error('Please enter a candidate name');
      }

      const isConnected = await requestAccount();
      if (!isConnected) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await contract.vote(candidate);
      await tx.wait();
      const count = await contract.getVotes(candidate);

      const [candidateNames2, voteCounts2] = await contract.getAllCandidates();


      if (!candidateNames2 || candidateNames2.length === 0) {
        throw new Error("No candidates found.");
      }

      setCandidateNames([...candidateNames2]);
      setVoteCounts(voteCounts2.map(num => num.toString()));

      setVotes(count.toString());
      setVotedCandidate(candidate);
    } catch (err) {
      if (err.message.includes("already voted") || err.message.includes("revert")) {
        setError("You have already voted! Each wallet is allowed only one vote.");
      } else {
        setError(err.message || "An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCheckVotes() {
    setError('');
    setIsLoading(true);
    try {
      if (!candidate) {
        throw new Error('Please enter a candidate name');
      }

      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask is required to use this app!');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);

      const count = await contract.getVotes(candidate);
      setVotes(count.toString());
      setVotedCandidate(candidate);
    } catch (err) {
      setError(err.message || 'Error reading votes');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.voterAndChartContainer}>
          <div className={styles.voterContainer}>
            <div className={styles.header}>
              <h1>🗳️ Blockchain Voting System</h1>
              <p className={styles.subtitle}>Secure, transparent, and tamper-proof voting powered by blockchain</p>
            </div>
            <div className={styles.card}>
              <div className={styles.inputGroup}>
                <label htmlFor="candidate">Candidate Name</label>
                <input
                  id="candidate"
                  placeholder="Enter candidate name"
                  value={candidate}
                  onChange={(e) => setCandidate(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.buttonGroup}>
                <button
                  onClick={handleVote}
                  className={`${styles.button} ${styles.primary}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Cast Vote'}
                </button>
                <button
                  onClick={handleCheckVotes}
                  className={`${styles.button} ${styles.secondary}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Check Votes'}
                </button>
              </div>

              {error && <div className={styles.error}>{error}</div>}

              {votes !== null && (
                <div className={styles.results}>
                  <h3>Voting Results</h3>
                  <div className={styles.resultCard}>
                    <span className={styles.candidateName}>{votedCandidate}</span>
                    <span className={styles.voteCount}>{votes} votes</span>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.infoSection}>
              <h3>How It Works</h3>
              <ol>
                <li>Enter a candidate name in the input field</li>
                <li>Connect your MetaMask wallet when prompted</li>
                <li>Cast your vote or check current vote counts</li>
                <li>View transparent, tamper-proof results on the blockchain</li>
              </ol>
            </div>
          </div>
          <div className={styles.barChartContainer}>
            <BarChart
              xAxis={[
                {
                  scaleType: 'band',
                  data: candidateNames,
                  sx: {
                    '.MuiChartsAxis-tickLabel': { fill: 'white' }, // X-axis labels
                    '.MuiChartsAxis-line': { stroke: 'white' } // X-axis line color
                  }
                }
              ]}
              yAxis={[
                {
                  min: 0,
                  max: Math.max(...voteCounts) + 1,
                  tickInterval: 1,
                  sx: {
                    '.MuiChartsAxis-tickLabel': { fill: 'white' }, // Y-axis labels
                    '.MuiChartsAxis-line': { stroke: 'white' } // Y-axis line color
                  }
                }
              ]}
              series={[{ data: voteCounts }]}
              width={800}
              height={600}
            />
          </div>
        </div>
      </main>
      <footer className={styles.footer}>
        <p>COE892 - Distributed Cloud Computing Project</p>
        <p>Toronto Metropolitan University - Winter 2025</p>
      </footer>
    </div>
  );
}