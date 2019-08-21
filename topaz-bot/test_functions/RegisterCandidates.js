// Import libraries
var Web3        = require('web3'),
    contract    = require("truffle-contract"),
    path        = require('path')
    Election    = require(path.join(__dirname, 'build/contracts/Election.json'));
const CosmosClient = require('@azure/cosmos').CosmosClient

const config = require('./config')
const url = require('url')

const endpoint = config.endpoint
const key = config.key

const databaseId = 'votebasedata'
const container1Id = 'Voters'
const container2Id = 'Stats'
const container3Id = 'Candidates'
const partitionKey = { kind: 'Int', paths: ['/SerialNo'] }

const client = new CosmosClient({ endpoint, key })
process.env.NODE_TLS_REJECT_UNAUTHORIZED="0"
    
var provider    = new Web3.providers.HttpProvider("http://localhost:8545"),    
    filePath    = path.join(__dirname, 'build/contracts/Election.json');
 

var ElectionContract = contract(Election);
ElectionContract.setProvider(provider);

async function queryContainer() {
    console.log(`Querying container:\n${container3Id}`)
    const querySpec = {
      query: 'SELECT * FROM Candidates'
    }
    const { resources: results } = await client
    .database(databaseId)
    .container(container3Id)
    .items.query(querySpec)
    .fetchAll()
  for (var queryResult of results) {
    console.log("Registering Candidate:")
    var _ConstID = Number(queryResult.ConstituencyID)
    var _Name = String(queryResult.CandidateName)
    var _CandID = Number(queryResult.CandidateID)
    var _Party = String(queryResult.Party)
    console.log("ConstID: ",_ConstID," Name: ",_Name," Party :",_Party)
    Register_Cand(_ConstID, _Name, _Party)
    // let resultString = JSON.stringify(queryResult)
    // console.log(`\tQuery returned ${resultString}\n`)
  }
}
queryContainer().catch(err=>{
    console.log(err);
})
async function Register_Cand (_ConstID, _Name, _Party) {
  let instance = await ElectionContract.deployed()
  let registration = await instance.addCandidate(_ConstID, _Name, _Party, {from: config.account1})
  console.log(registration)
}

