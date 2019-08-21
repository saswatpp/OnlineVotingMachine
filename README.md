# OnlineVotingMachine
A user-friendly webapp to make voting hassle-free and secured using blockchain technology.

# Idea:
The Following features will be included in our Ethereum Blockchain Voting system

1. Votes can be given through any browser with a camera for login
2. 2-factor Authentication for identity verification
3. Face-ID verification using preregistered face data
4. Ability change Voters every 6 hours to reduce network workload and prevent misuse by voters. Only the final vote given to any candidate will be counted.
This allows users to not regret voting a particular candidate if a controversy during the election surfaces. This also allows users to fake-vote whenever they feel surrounded or being watched at work/public places. 
5. Live gender-specific Voter-turnout with graphs so that registered online-voters of specific areas/constituency can be notified to vote before the deadline if their turnout is low.
6. Voters will have constituency details stored, to ensure that they only vote for their own constituency and not any other. Hence they can vote from anywhere around the country without having to go there physically.

The Election will have the following 3 major Process:
1. Registration of voters and Candidates
2. Actual Polls
3. Display Election Results 

# Tech Stack:
1. Azure Blockchain Service
2. Truffle-Contract and Truffle Suite
3. Solidity for smart contracts
4. CosmosDB with Flask-SQL and Node-SQL
5. React-js

# Process of Voting:

1. User Logs in through Aadhar number and Password
2. The Face ID(not implemented) verifies the User
3. The Voter can Vote any candidate and can even change his/her vote(once in 2 hours)
4. They User and also View the live Turnout reports of any constituency

# How Topaz-bot Works:
Topaz-bot is consists of admin tools like initiating register candidates function, register constituency and change State of Election Function
Admin Tools : 
These can be Executed with Simple Post requests with User_id and Password as x-form data to the Topaz-bot host.
1. Register Constituency
	Fethes Data from the Azure CosmosDB from the Constituency Container and Registers them on the Blockchain. 
2. Register Candidates
	Fethes Data from the Azure CosmosDB from the Constituency Container and Registers them on the Blockchain. 
3. Change State of Election
	Can Change the State from Pre Election to Live and then to Post Election State.
4. Get Results
	Updates Results to the CosmosDB . Can only be called in Post Election Stage
Automatic Bot Scheduled Job:
1. Vote Function
	It fetches the VoteCount from each candidate from the DataBase. (This vote Count is actually Delta(V) ; The  change in Vote to a particular Candidate. This can be Negative also. ) This then Resets the VoteCount Back to Zero.
	It uses node-cron to run every 6 hours and is Automatic. 
	After Fetching the voteCount, It Calls the Vote Transaction Function of the Blockchain. It connects to the Network using Truffle HD Wallet provider
