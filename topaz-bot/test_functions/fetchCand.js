//@ts-check
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
//console.log("the requested value is:",process.env.NODE_TLS_REJECT_UNAUTHORIZED)
/**
 * Query the container using SQL
 */
async function queryContainer() {
  console.log(`Querying container:\n${container3Id}`)

  // query to return all children in a family
  const querySpec = {
    query: 'SELECT * FROM Candidates'
    // parameters: [
    //   {
    //     name: '@lastName',
    //     value: 'Andersen'
    //   }
    // ]
  }

  const { resources: results } = await client
    .database(databaseId)
    .container(container3Id)
    .items.query(querySpec)
    .fetchAll()
  for (var queryResult of results) {
    console.log("ContituencyID :",queryResult.ConstituencyID,"CandidateID:",(Number(queryResult.CandidateID)))
    // replaceItem(queryResult)

    // let resultString = JSON.stringify(queryResult)
    // console.log(`\tQuery returned ${resultString}\n`)
  }
}
queryContainer().catch(err=>{
  console.log(err);
})
async function replaceItem(itemBody) {
  console.log(`Replacing item:\n${itemBody.id}\n`);
  // Change property 'ConstID'
  itemBody.ConstituencyID = itemBody.ConstituencyID + 1;
 const item = await client.database(databaseId).container(container3Id).item(itemBody.id,itemBody.SerialNo).replace(itemBody);
 console.log(item)
};
// /**
//  * Replace the item by ID.
//  */
// async function replaceFamilyItem(itemBody) {
//   console.log(`Replacing item:\n${itemBody.id}\n`)
//   // Change property 'grade'
//   itemBody.children[0].grade = 6
//   const { item } = await client
//     .database(databaseId)
//     .container(containerId)
//     .item(itemBody.id, itemBody.Country)
//     .replace(itemBody)
// }

// /**
//  * Delete the item by ID.
//  */
// async function deleteFamilyItem(itemBody) {
//   await client
//     .database(databaseId)
//     .container(containerId)
//     .item(itemBody.id, itemBody.Country)
//     .delete(itemBody)
//   console.log(`Deleted item:\n${itemBody.id}\n`)
// }

/**
 * Cleanup the database and collection on completion
 */
// async function cleanup() {
//   await client.database(databaseId).delete()
// }

/**
 * Exit the app with a prompt
 * @param {string} message - The message to display
 */
function exit(message) {
  console.log(message)
  console.log('Press any key to exit')
  process.stdin.setRawMode(true)
  process.stdin.resume()
  process.stdin.on('data', process.exit.bind(process, 0))
}

// createDatabase()
//   .then(() => readDatabase())
//   .then(() => createContainer())
//   .then(() => readContainer())
//   .then(() => createFamilyItem(config.items.Andersen))
//   .then(() => createFamilyItem(config.items.Wakefield))
//   .then(() => queryContainer())
//   .then(() => replaceFamilyItem(config.items.Andersen))
//   .then(() => queryContainer())
//   .then(() => deleteFamilyItem(config.items.Andersen))
//   .then(() => {
//     exit(`Completed successfully`)
//   })
//   .catch(error => {
//     exit(`Completed with error ${JSON.stringify(error)}`)
//   })
