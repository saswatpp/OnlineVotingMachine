import azure.cosmos.cosmos_client as cosmos_client
from azure.cosmos.database import Database
from flask import Flask, jsonify


app = Flask(__name__)

config = {
    'ENDPOINT': 'https://votingdb.documents.azure.com:443/',
    'PRIMARYKEY': 'jOv6kAG9x4DpuExpsDxQmx2FkXaqeOmWcm2S6z3BldwleGK7zFEaVaXJwXHd22OZh8fuMcm0XWExELaHGEdNUw==',
    'DATABASE': 'votingdb',
    'CONTAINER1': 'candidates',
    'CONTAINER2': 'constituency',
    'CONTAINER3': 'stats'
}

# Initialize the Cosmos client
client = cosmos_client.CosmosClient(url_connection=config['ENDPOINT'], auth={
                                    'masterKey': config['PRIMARYKEY']})

# access container
database = Database(client, config['DATABASE'])
container1 = database.get_container(config['CONTAINER1'])
container2 = database.get_container(config['CONTAINER2'])
container3 = database.get_container(config['CONTAINER3'])

@app.route("/user/<aadhar>")
def user_info(aadhar):

    # Query in SQL
    query = {'query': 'SELECT * FROM server s where s.AadharNo = "{}"'.format(aadhar)}
   
    options = {}
    options['enableCrossPartitionQuery'] = True
    options['maxItemCount'] = 2
    
    result_iterable = client.QueryItems(container1.container_link, query, options)
        
    return jsonify(
    voter_info= list(result_iterable)
    )
    
@app.route("/stats")
def graphs_stats():
    
    # Query in SQL
    query = {'query': 'SELECT * FROM server s'}
   
    options = {}
    options['enableCrossPartitionQuery'] = True
    options['maxItemCount'] = 2
    
    result_iterable = client.QueryItems(container3.container_link, query, options)
        
    return jsonify(
    voter_info= list(result_iterable)
    )
    
@app.route("/candidate/<constituency>")
def candidate_info(constituency):
    
    # Query in SQL
    query = {'query': 'SELECT * FROM server s where s.ConstituencyID = "{}"'.format(constituency)}
   
    options = {}
    options['enableCrossPartitionQuery'] = True
    options['maxItemCount'] = 2
    
    result_iterable = client.QueryItems(container2.container_link, query, options)
        
    return jsonify(
    voter_info= list(result_iterable)
    )
    

if __name__ == "__main__":
    app.run(host='0.0.0.0',debug=True)
    