//we will be using lite-server provided by the pet-shop box of truffle, to build all of our client side assets

//bs-config.json file has the info for giving us the access to json files for our artifacts/contracts abstraction and
//it's also going to reload the content on the page as the "server" for bs-config has ./src as a dependency
//so any changes in any of the files of the ./src will lead to reload of the server
App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  //we first initialize our app, and when we do this, we will initialize Web3
  init: function(){
    return App.initWeb3();
  },
    //initializing web3 connects our client side application to local blockchain or the one being provided by our metamask extension
  initWeb3: function(){
    if(typeof web3!=='undefined')
    {
      //web3 instance being provided by metamask
      App.web3Provider = window.ethereum;
      web3 = new Web3(App.web3Provider);
    }
    else
    {
      //Specifying the default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
      console.log('came intitweb3');
    }
     
  },

  //after we initialize web3, we will initialize our contract
  //here we are loading our contract into the frontend application, so that we can
  //interact with it
  initContract:function(){

    //NOTE: This getJSON function (below) works for Election.json file due to the browser sync package, that came with truffle box
    //browser sync package is configured to read the files out of the build/contracts directory.

    //the bytecode gets compiled and run on the ethereum virtual machine

    //loading the JSON file of our election artifact, and we will use it
    //to generate our truffle contract
    $.getJSON("Election.json",(election)=>{

      //this truffle contract is the actual contract that we can intract with inside of our app
      App.contracts.Election = TruffleContract(election);

      //then, we will set the provider for this contract (truffle contract) to the provider that we created in the contracts fucntion
      App.contracts.Election.setProvider(App.web3Provider);

      console.log('came initContract');
      //once these things are done we will return our app
      return App.render();
    })
  },

  //render function to render all the layout on the page
  //1) Display the account that we are connected to the blockchain with
  //2)List out all of the candidates in our election
  render:function(){
    var electionInstance;
    //keeping track of our loading template and content element, so that we can show and hide them
    //during the different points of execution due to the asynchronous nature of solidity
    var loader = $('loader');
    var content = $('content');

    //showing and hiding them as required
    loader.show();
    content.hide();

    //now we will first load the account
    //getCoinbase() that provides us with the account that we are currently connected to the blockchain to.
    web3.eth.getCoinbase((err,acc)=>{
      //injecting the account into the (err,acc) above
      if(err===null)
      {
        //setting and displaying the current account into the accountAddress id of html
        App.account = acc;
        $("#accountAddress").html("Your Account: " + acc);
      }
    })
    //loading the candidates into our html page

  //this first line is the getting the copy of our deployed contract
  App.contracts.Election.deployed().then(function(instance){
    electionInstance = instance;

    //getting the candidates count
    return electionInstance.candidateCount();
  }).then(function(candidateCount){
    var candidatesResults = $("#candidatesResults");
    candidatesResults.empty();

    //to list out each candidate in our mapping, we r looping through it
    for(var i=0;i<=candidateCount;i++)
    {
      electionInstance.candidates(i).then(function(candidate){
        var id = candidate[0];
        var name = candidate[1];
        var voteCount = candidate[2];

        console.log('looping here');
        //rendering the result
        var candidateTemplate = "<tr><th>" + id + "</th></td>" + name + "</td><td>" + voteCount + "</td></tr>";

        //appending th table on the page
        candidatesResults.append(candidateTemplate);
      })
    }
    console.log('came render here after looping');
    loader.hide();
    content.show();
  }).catch((err)=>{
    console.log(err);
  })
  }
}




//initializing the App whenever the window loads
$(function(){
  $(window).load(function(){
    App.init();
  })
})