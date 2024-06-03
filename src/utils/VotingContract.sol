// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Voting {
      struct Club {
        string name;
        uint256 votes;
    }

    Club[] public clubs;
    mapping(address => bool) public hasVoted;

    constructor(string[] memory clubNames) {
        for (uint i = 0; i < clubNames.length; i++) {
            clubs.push(Club({
                name: clubNames[i],
                votes: 0
            }));
        }
    }

    function vote(uint256 clubId) public {
        require(!hasVoted[msg.sender], "You have already voted.");
        require(clubId < clubs.length, "Invalid club ID.");

        clubs[clubId].votes++;
        hasVoted[msg.sender] = true;
    }

    function getClubVotes(uint256 clubId) public view returns (uint256) {
        require(clubId < clubs.length, "Invalid club ID.");
        return clubs[clubId].votes;
    }
}
