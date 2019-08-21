const HDWalletProvider = require('truffle-hdwallet-provider');
const fs = require('fs');
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    votingchain: {
      network_id: "*",
      gas: 0,
      gasPrice: 0,
      provider: new HDWalletProvider(fs.readFileSync('g:\\VotingApp\\testnode1.env', 'utf-8'), "https://testnode1.blockchain.azure.com:3200/LlMtHzk9WdBbh6AVvhORtvro"),
      consortium_id: 1565779202001
    },
    topaznet: {
      network_id: "*",
      gas: 0,
      gasPrice: 0,
      provider: new HDWalletProvider(fs.readFileSync('g:\\Voting_App\\test_node.env', 'utf-8'), "https://testnode.blockchain.azure.com:3200/KR_PArQTYkg6jehCzsR0TX2Y"),
      consortium_id: 1566399435712
    }
  },
  mocha: {},
  compilers: {
    solc: {
      version: "0.5.0"
    }
  }
};
