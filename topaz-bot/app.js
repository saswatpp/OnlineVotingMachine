const express = require('express')
const app = express()
const cron = require('node-cron')
const port = 3000
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

var Web3        = require('web3'),
    contract    = require("truffle-contract"),
    path        = require('path')
    Election    = require(path.join(__dirname, 'build/contracts/Election.json'));
const CosmosClient = require('@azure/cosmos').CosmosClient

const userid = "admin"
const pass = "admin"

var provider    = new Web3.providers.HttpProvider("http://localhost:8545"),    
    filePath    = path.join(__dirname, 'build/contracts/Election.json');
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
var State_of_election = 0 

const client = new CosmosClient({ endpoint, key })
var ElectionContract = contract(Election);
ElectionContract.setProvider(provider);

///For Last Voted Smart Contract:
LastVoted = require(path.join(__dirname, 'build/contracts/LastVoted.json'));  
var LastVotedContract = contract(LastVoted);
LastVotedContract.setProvider(provider);
///

app.post('/Reg_Candidates',function(req,res){
  if(userid===req.body.user_id&&pass===req.body.password){
    Register_Candidates()
    .then(()=>{
      console.log('Registered');
      res.send('Candidates Registered.');
    }).catch(err=>{
      console.log(err);
    })
  }
  else{
    res.send("Auth failed!")
  }
})

app.post('/Reg_Constituency',function(req,res){
  if(userid===req.body.user_id&&pass===req.body.password){
    Register_Constituency().then(()=>{
      console.log("Constituency Registered")
      res.send('Registered Constituency')
    }).catch(err=>{
      console.log(err);
    })
  }
  else{
    res.send("auth failed!")
  }
})

cron.schedule('6 * * * *',()=>{
  if(State_of_election===1){
      console.log('Voting to Blockchain....')
      Vote_Blockchain().then(()=>{
        console.log("Vote Function Successfully Executed")
      }).catch(err=>{
      console.log(err);
      })
  }//implement State of Election
  else{
      console.log('Voting Cannot be Conducted Now')
  }
});

app.post('/Change_State',function(req,res){
  if(userid==req.body.user_id&&pass==req.body.password){
    ElectionContract.deployed().then(function(instance) {
        return instance.changeState({from: config.account1})
    }).then(function(result) {
        console.log(result);
        res.send("Status Of Election Changed Successfully!")
    }, function(error) {
        console.log(error);
    });
    //res.send(200, 'Changing State of Election...')
  }
  else{
    res.send("Auth failed")
  }
})

app.get('/Get_State',function(req,res){
    ElectionContract.deployed().then(function(instance) {
        return instance.State({from: config.account1})
    }).then(function(result) {
        State_of_election = Number(result);
        console.log(result);
    }, function(error) {
        console.log(error);
    });
    //res.sendStatus(200).send(State_of_election);
    res.send(200, State_of_election)
    //res.send(State_of_election)
})

app.post('/Get_Result',function(req,res){
  if(userid===req.body.user_id&&pass===req.body.password){
    Update_Result().then(()=>{
      console.log("Results Updated")
      res.send("Results Updated")
    }).catch(err=>{
        console.log(err);
    })
  }
  else{
    res.send("Auth failed!")
  }
})

app.get('/Get_LastVoted/:Aadhar',function(req,res){
  LastVotedContract.deployed().then(function(instance) {
      return instance.Get(req.params.Aadhar,{from: config.account1})
  }).then(function(result) {
      res.send(200, Number(result))
      console.log(result);
  }, function(error) {
      console.log(error);
  });
})

app.post('/Set_LastVoted/:Aadhar/:id',function(req,res){
  if(userid===req.body.user_id&&pass===req.body.password){
    LastVotedContract.deployed().then(function(instance) {
      return instance.Set(req.params.Aadhar ,req.params.id ,{from: config.account1})
    }).then(function(result){
      res.send(req.params.id)
      console.log(result);
    }, function(error) {
      console.log(error);
    });
  }
  else{
    res.send("Auth failed!")
  }
})


app.listen(port,()=>console.log('listening on',port))


async function Register_Candidates() {
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

async function Register_Cand (_ConstID, _Name, _Party) {
  let instance = await ElectionContract.deployed()
  let registration = await instance.addCandidate(_ConstID, _Name, _Party, {from: config.account1})
  console.log(registration)
}
async function Register_Constituency() {
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

async function Register_Const (_Name) {
  let instance = await ElectionContract.deployed()
  let registration = await instance.addConstituency(_Name, {from: config.account1})
  console.log(registration)
}
async function Vote_Blockchain() {
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
    console.log("Voting for Candidate:")
    var _ConstID = Number(queryResult.ConstituencyID)
    var _CandID = Number(queryResult.CandidateID)
    var _VoteCount = Number(queryResult.VoteCount)
    console.log("ConstID: ",_ConstID," Name: ",_CandID)
    Vote_Cand(_ConstID, _CandID, _VoteCount)
    resetVoteCount(queryResult)
    // let resultString = JSON.stringify(queryResult)
    // console.log(`\tQuery returned ${resultString}\n`)
  }
}

async function Vote_Cand (_ConstID, _CandID, _VoteCount) {
  let instance = await ElectionContract.deployed()
  let voting = await instance.vote(_ConstID, _CandID, _VoteCount, {from: config.account1})
  console.log(voting)
}
async function resetVoteCount(itemBody) {
  console.log(`Replacing item:\n${itemBody.id}\n`);
  // Change property 'ConstID'
  itemBody.VoteCount = "0";
 const item = await client.database(databaseId).container(container3Id).item(itemBody.id,itemBody.SerialNo).replace(itemBody);
};

async function Update_Result() {
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
async function GetResult(_ConstID) {
  let instance = await ElectionContract.deployed()
  let result = await instance.results(_ConstID, {from: config.account1})
  //console.log("Winner ID:",Number(result['0']),Number(result['1']))
  return result
}

async function UpdateResult(itemBody, _WinnerId, _Votes) {
    console.log(`Replacing item:\n${itemBody.id}\n`);
    // Change property 'ConstID'
    itemBody.WinnerId = ""+_WinnerId;
    itemBody.Votes = ""+_Votes;
   const item = await client.database(databaseId).container(container4Id).item(itemBody.id,itemBody.SerialNo).replace(itemBody);
  };