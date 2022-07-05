pragma solidity ^0.5.16;

contract Election{
    //state variable is accessible inside our contract
    string public candidate;

    //constructor -> run when we initialize our contract using migration
    //store and read candidate value
    // constructor () public{
    //     candidate = "candidate 1";
    // }
    //now we have to model a candidate
    //Store candidate
    //Fetch candidates
    //Store candidates count

    //modelled the candidate inside the contract
    struct Candidate{
        uint id;
        string name;
        uint voteCount;
    }
    //now we need a way to store these candidate.
    //NOTE: When we are adding a candidate to this mapping, we are changing the state of our contract and writing to the blockchain 
    //key:value pairs
    mapping(uint=>Candidate) public candidates;

    //to keep the count of the candidates
    //we are explicitely maintaining the count of the candidates because 
    //in the solidity mapping there is no way to find the length of the mapping 
    //and no way to iterate over the mapping either.
    //Reason : because, if we dont have any candidate declared and we try to access it then it will automatically return 
    //to us the blank candidate 
    uint public candidateCount; //default value is 0

    //constructor to initially add the candidate to the list of the exisiting candidate
    constructor () public{
        addCandidate("Ayush");
        addCandidate("Rohan");
    }
 
    //now to add a candidate to the mapping
    //private because we dont want anybody else to add the candidate to the list but only the address from which the contract
    //was deployed
    function addCandidate(string memory name) private{
        candidateCount++;
        candidates[candidateCount] = Candidate(candidateCount, name, 0);
    }
}