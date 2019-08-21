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
const container4Id = 'Constituencies'
const partitionKey = { kind: 'Int', paths: ['/SerialNo'] }

const client = new CosmosClient({ endpoint, key })
process.env.NODE_TLS_REJECT_UNAUTHORIZED="0"
    
var provider    = new Web3.providers.HttpProvider("http://localhost:8545"),    
    filePath    = path.join(__dirname, 'build/contracts/Election.json');
 

var ElectionContract = contract(Election);
ElectionContract.setProvider(provider);

async function queryContainer() {
    console.log(`Querying container:\n${container4Id}`)
    const querySpec = {
      query: 'SELECT * FROM Constituencies'
    }
    const { resources: results } = await client
    .database(databaseId)
    .container(container4Id)
    .items.query(querySpec)
    .fetchAll()
  for (var queryResult of results) {
    console.log("Registering Constituency:")
    var _ConstID = Number(queryResult.SerialNo)
    var _Name = String(queryResult.Name)
    console.log("ContituencyID :",_ConstID,"Name:",_Name)
    Register_Const(_Name)
    // let resultString = JSON.stringify(queryResult)
    // console.log(`\tQuery returned ${resultString}\n`)
  }
}
queryContainer().catch(err=>{
    console.log(err);
  })

async function Register_Const (_Name) {
  let instance = await ElectionContract.deployed()
  let registration = await instance.addConstituency(_Name, {from: config.account1})
  console.log(registration)
}


