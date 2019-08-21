// Import libraries
var Web3        = require('web3'),
    contract    = require("truffle-contract"),
    path        = require('path')
    Election    = require(path.join(__dirname, 'build/contracts/Election.json'));
    config      = require('./config.js')

    
var provider    = new Web3.providers.HttpProvider("http://localhost:8545"),    
    filePath    = path.join(__dirname, 'build/contracts/Election.json');

var ElectionContract = contract(Election);
ElectionContract.setProvider(provider);

ElectionContract.deployed().then(function(instance) {

    return instance.changeState({from: config.account1})
    
}).then(function(result) {
    console.log(result);
    
}, function(error) {
    console.log(error);
}); 
