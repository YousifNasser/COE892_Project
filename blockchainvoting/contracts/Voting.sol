 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    mapping(string => uint256) public votes;
    mapping(address => bool) public hasVoted; // tracks if an address has voted

    function vote(string memory candidate) public {
        // Check if the sender has already voted
        require(!hasVoted[msg.sender], "You have already voted!");
        votes[candidate] += 1;
        hasVoted[msg.sender] = true; // mark the sender as having voted
    }

    function getVotes(string memory candidate) public view returns (uint256) {
        return votes[candidate];
    }
}