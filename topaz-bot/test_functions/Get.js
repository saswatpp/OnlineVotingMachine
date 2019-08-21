// Import libraries
var Web3        = require('web3'),
    contract    = require("truffle-contract"),
    path        = require('path')
    
const config      = require('./config.js')

    
var provider    = new Web3.providers.HttpProvider("http://localhost:8545");
LastVoted    = require(path.join(__dirname, 'build/contracts/LastVoted.json'));  
var LastVotedContract = contract(LastVoted);
LastVotedContract.setProvider(provider);



    filePath    = path.join(__dirname, 'build/contracts/LastVoted.json');



LastVotedContract.deployed().then(function(instance) {
    console.log("contractaddress",LastVotedContract.address,":",config.address)
    return instance.Get(1,{from: config.account1})
}).then(function(result) {
    console.log(result);
}, function(error) {
    console.log(error);
}); 
