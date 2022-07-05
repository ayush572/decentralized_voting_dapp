//requiring the smart contract 
//artifact is used by the truffle to create an abstraction to intereact with contract
var Election = artifacts.require('./Election.sol');

//now we declare our contract, that will inject all the accounts that exists in our development environment
//and hence we can use them for the testing purposes
contract("Election", function(accounts){

    //it -> from the mocha testing framework
    it("initializes with two candidates",async ()=>{
        const smart_con = await Election.deployed();
        const no_of_candidates = await smart_con.candidateCount();

        //assert from the chai as it is the assertion library
        assert.equal(no_of_candidates.toNumber(),2);
    });

    it("testing the candidates with the correct values",async()=>{
        const smart_con = await Election.deployed();
        var c1 = await smart_con.candidates(1);
        assert(c1.id,1,"correct ID");
        assert(c1.name,"Ayush","correct name");
        assert(c1.voteCount,0,"correct voteCount");
        var c2 = await smart_con.candidates(2);
        assert(c2.id,2,"correct ID");
        assert(c2.name,"Rohan","correct name");
        assert(c2.voteCount,0,"correct voteCount");
    })
});