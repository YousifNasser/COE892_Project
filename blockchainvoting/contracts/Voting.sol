// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    mapping(string => uint256) public votes;
    mapping(address => bool) public hasVoted;
    string[] public candidates;  // Store candidate names

    function vote(string memory candidate) public {
        require(!hasVoted[msg.sender], "You have already voted!");
        
        // If it's a new candidate, add to the list
        if (votes[candidate] == 0) {
            candidates.push(candidate);
        }

        votes[candidate] += 1;
        hasVoted[msg.sender] = true;
    }

    function getVotes(string memory candidate) public view returns (uint256) {
        return votes[candidate];
    }

    function getAllCandidates() public view returns (string[] memory) {
        return candidates;
    }
}