pragma solidity ^0.5.0;

contract Election {

    //set of States
    enum StateType { Pre, Live, Post }

    StateType public State;
    address private EC;
    uint public ConstituencyCount;
    mapping(uint => Constituency) private Constituencies;

    // Model a Candidate
    struct Candidate {
        uint id;
        string name;
        string party;
        int256 voteCount;
    }

    // Model a Constituency
    struct Constituency{
        uint id;
        string name;
        uint candidatesCount;
        // uint winningCandid;
        mapping(uint => Candidate) candidates;
    }

    function changeState() public {
        if(State == StateType.Pre)
            State = StateType.Live;
        else
            State = StateType.Post;
    }

    function addConstituency(string memory _name) public  PreEl(){
        ConstituencyCount++;
        Constituencies[ConstituencyCount] = Constituency(ConstituencyCount, _name, 0);
    }

    function addCandidate(uint _id,string memory _name, string memory _party) public PreEl(){
        Constituencies[_id].candidatesCount++;
        uint CC = Constituencies[_id].candidatesCount;
        Constituencies[_id].candidates[CC] = Candidate(CC, _name, _party, 0);
    }

    function vote(uint _Constid, uint _Candid, int256 _vote) public LiveEl() {//notEC()
        require(_Candid > 0 && _Candid <= Constituencies[_Constid].candidatesCount,"Invalid Candidate");
        int256 votes = Constituencies[_Constid].candidates[_Candid].voteCount;
        Constituencies[_Constid].candidates[_Candid].voteCount = votes + _vote;
    }

    function getConstituency(uint _Constid) public view returns(uint, string memory, uint) {
        uint _id = Constituencies[_Constid].id;
        string memory _name = Constituencies[_Constid].name;
        uint _CandCount = Constituencies[_Constid].candidatesCount;
        return (_id, _name, _CandCount);
    }

    function getCandidate(uint _Constid, uint _Candid) public view returns(uint, string memory, string memory) {
        Candidate memory C = Constituencies[_Constid].candidates[_Candid];
        return (C.id, C.name, C.party);
    }

    function results(uint _Constid) public view PostEl() returns(uint,int256) {
        Constituency storage C = Constituencies[_Constid];
        int256 maxvotes = 0;
        uint winner = 0;
        for(uint i = 1; i <= C.candidatesCount; i++){
            int256 votes = C.candidates[i].voteCount;
            if(votes>maxvotes){
                winner = i;
                maxvotes = votes;
            }
        }
        // Constituencies[_Constid].winningCandid = winner;
        return (winner,maxvotes);
    }

    //Modifier List

    modifier PreEl(){
        require(State == StateType.Pre,"This Operation can be performed in Pre Election Stage ");
        _;
    }

    modifier LiveEl(){
        require(State == StateType.Live,"Election is not Live Yet!");
        _;
    }

    modifier PostEl(){
        require(State == StateType.Post,"Polls are not Over yet !");
        _;
    }

    constructor() public{
        EC = msg.sender;
        State = StateType.Pre;
    }
}
