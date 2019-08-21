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
    console.log("Constituency:")
    var _ConstID = Number(queryResult.SerialNo)
    var _Name = String(queryResult.Name)
    console.log("ContituencyID :",_ConstID,"Name:",_Name)
    var result = await GetResult(_ConstID)
    var _WinnerId = Number(result['0'])
    var _Votes = Number(result['1'])
    let doit = await UpdateResult(queryResult, _WinnerId,_Votes)
    // let resultString = JSON.stringify(queryResult)
    // console.log(`\tQuery returned ${resultString}\n`)
  }
}
queryContainer().catch(err=>{
    console.log(err);
  })

async function GetResult(_ConstID) {
  let instance = await ElectionContract.deployed()
  let result = await instance.results(_ConstID, {from: config.account1})
  //console.log("Winner ID:",Number(result['0']),Number(result['1']))
  return result
}

async function UpdateResult(itemBody, _WinnerId, _Votes) {
    console.log(`Replacing item:\n${itemBody.id}\n`);
    // Change property 'ConstID'
    itemBody.WinnerId = _WinnerId;
    itemBody.Votes = _Votes;
   const item = await client.database(databaseId).container(container4Id).item(itemBody.id,itemBody.SerialNo).replace(itemBody);
  };


