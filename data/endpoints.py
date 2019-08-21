import azure.cosmos.cosmos_client as cosmos_client
from azure.cosmos.database import Database
from flask import Flask, jsonify
from flask_cors import cross_origin

app = Flask(__name__)

config = {
    'ENDPOINT': 'https://votedata.documents.azure.com:443/',
    'PRIMARYKEY': 'jHBJjbijjtPfOOmz5ZrIMUCWUFJQywY1MBQvwy7OenwHUHtzrYL6TzKgA3ZyLq9htTHqjiDzEnULL1Xd72QUIw==',
    'DATABASE': 'votedata',
    'CONTAINER1': 'Voters',
    'CONTAINER2': 'Candidates',
    'CONTAINER3': 'Stats',
    'CONTAINER4': 'Constituency'
}

# Initialize the Cosmos client
client = cosmos_client.CosmosClient(url_connection=config['ENDPOINT'], auth={
                                    'masterKey': config['PRIMARYKEY']})

# access container
database = Database(client, config['DATABASE'])
container1 = database.get_container(config['CONTAINER1'])
container2 = database.get_container(config['CONTAINER2'])
container3 = database.get_container(config['CONTAINER3'])
container4 = database.get_container(config['CONTAINER4'])

@app.route("/user/<aadhar>")
@cross_origin()
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
@cross_origin()
def graphs_stats():
    
    query = {'query': 'SELECT * FROM server s'}  
   
    options = {}
    options['enableCrossPartitionQuery'] = True
    options['maxItemCount'] = 2
    
    result_iterable = client.QueryItems(container3.container_link, query, options)
      
    return jsonify(
    stats_info= list(result_iterable)
    )
    
@app.route("/candidate/<constituency>")
@cross_origin()
def candidate_info(constituency):
    
    # Query in SQL
    query = {'query': 'SELECT * FROM server s where s.ConstituencyID = "{}"'.format(constituency)}
   
    options = {}
    options['enableCrossPartitionQuery'] = True
    options['maxItemCount'] = 2
    
    result_iterable = client.QueryItems(container2.container_link, query, options)
        
    return jsonify(
    candidates_info= list(result_iterable)
    )

@app.route("/constituency/<id>")
@cross_origin()
def constituency_info(id):
    
    # Query in SQL
    query = {'query': 'SELECT * FROM server s where s.ConstituencyID = "{}"'.format(id)}
   
    options = {}
    options['enableCrossPartitionQuery'] = True
    options['maxItemCount'] = 2
    
    result_iterable = client.QueryItems(container4.container_link, query, options)
        
    return jsonify(
    constituency_info= list(result_iterable)
    )    

@app.route("/constituency")
@cross_origin()
def constituency_all_info():
    
    # Query in SQL
    query = {'query': 'SELECT * FROM server s'}
   
    options = {}
    options['enableCrossPartitionQuery'] = True
    options['maxItemCount'] = 2
    
    result_iterable = client.QueryItems(container4.container_link, query, options)
        
    return jsonify(
    constituency_all_info= list(result_iterable)
    )

@app.route("/vote/<aadhar>/<candidateid>", methods=['POST'])
@cross_origin()
def vote_cast(aadhar, candidateid):
        
    # Query in SQL
    user_query = {'query': 'SELECT * FROM server s where s.AadharNo = "{}"'.format(aadhar)}
       
    options = {}
    options['enableCrossPartitionQuery'] = True
    options['maxItemCount'] = 2
        
    result_iterable = client.QueryItems(container1.container_link, user_query, options)
    
    updated_user = {}
    # storing user's info
    for item in iter(result_iterable):
        gender = item['Gender']
        last = int((item['Last_voted_candidate']))
        age = int((item['Age']))
        constituencyid = int(item['ConstituencyID'])
        id1 = item['id']
        updated_user = item


    stat_query = {'query': 'SELECT * FROM server s where s.ConstituencyID = "{}"'.format(constituencyid)}
    stat_iter = client.QueryItems(container3.container_link, stat_query, options)

    updated_stat = {}
    # stats data
    for item in iter(stat_iter):
        total = int(item['TotalVotes'])
        male = int(item['MaleVotes'])
        female = int((item['FemaleVotes']))
        id3 = item['id']
        updated_stat = item
    
    # candidate data
    candidate_query = {'query': 'SELECT * FROM server s where s.CandidateID = "{}" and s.ConstituencyID = "{}"'.format(candidateid,constituencyid)}
    candidate_iter = client.QueryItems(container2.container_link, candidate_query, options)

    candidate_update = {}
    for item in iter(candidate_iter):
        vote_count = int(item['VoteCount'])
        id2 = item['id']
        candidate_update = item

       
    if age>=18:
        candidate_update['VoteCount'] = str(vote_count+1)
        container2.replace_item(id2,candidate_update)
        
        if last==0:
            updated_stat['TotalVotes'] = str(total+1)
            if gender == 'F':
                updated_stat['FemaleVotes'] = str(female+1)
            else:
                updated_stat['MaleVotes'] = str(male+1)
            container3.replace_item(id3,updated_stat)

        else:
            # if the user is changing vote
            prev_query = {'query': 'SELECT * FROM server s where s.CandidateID = "{}" and s.ConstituencyID = "{}"'.format(last,constituencyid)}
            prev_iter = client.QueryItems(container2.container_link, prev_query, options)
            sub_vote = {}
            for item in iter(prev_iter):
                prev_count = int(item['VoteCount'])
                id4 = item['id']
                sub_vote = item
            sub_vote['VoteCount'] = str(prev_count-1)
            container2.replace_item(id4,sub_vote)

        # updating last_voted field
        updated_user['Last_voted_candidate'] = str(candidateid)
        container1.replace_item(id1,updated_user)

        return("vote casted successfully")
        
    else:
        return("You are not eligible to vote")

        

if __name__ == "__main__":
    app.run(host='0.0.0.0',debug=True)