pragma solidity ^0.5.0;

contract Election {

    //set of States
    enum StateType { Pre, Live, Post }

    StateType public State;
    address private EC;
    //uint public CandidateCount;
    uint public ConstituencyCount;
    //uint public PartyCount;
    //mapping(uint => Candidate) public candidates;
    mapping(string => uint) private PartySeats;
    mapping(uint => Constituency) private Constituencies;
    mapping(address => uint) private Caddlist;

    // Model a Candidate
    struct Candidate {
        uint id;
        string name;
        string party;
        uint voteCount;
    }

    // Model a Constituency
    struct Constituency{
        uint id;
        string name;
        address Cadd;
        uint candidatesCount;
        string WinParty;
        mapping(uint=>Candidate) candidates;
    }

    function changeState() public onlyEC(){
        if(State == StateType.Pre)
            State = StateType.Live;
        else
            State = StateType.Post;
    }

    function addConstituency(string memory _name, address _Cadd) public onlyEC() PreEl(){
        ConstituencyCount++;
        Caddlist[_Cadd] = ConstituencyCount;
        Constituencies[ConstituencyCount] = Constituency(ConstituencyCount, _name, _Cadd, 0, "");
    }

    function addCandidate(uint _id,string memory _name, string memory _party) public onlyEC() PreEl(){
        Constituencies[_id].candidatesCount++;
        uint CC = Constituencies[_id].candidatesCount;
        Constituencies[_id].candidates[CC] = Candidate(CC, _name, _party, 0);
    }

    function vote(uint _Constid, uint _Candid) public LiveEl(){
        require(Caddlist[msg.sender] == _Constid,"Cannot Vote for Different Constituency");
        require(_Candid > 0 && _Candid < Constituencies[_Constid].candidatesCount,"Invalid Candidate");

        Constituencies[_Constid].candidates[_Candid].voteCount++;
    }
    
    function results(uint _Constid) PostEl() onlyEC() public view returns(Candidate){
        Constituency memory C = Constituencies[_Constid];
        uint maxvotes = 0;
        uint winner = 0;
        for(uint i=1; i<=C.candidatesCount; i++){
            if(C.candidates[i].voteCount>maxvotes){
                winner = i;
            }
        }
        return C.candidates[winner];
    }

    //Modifier List
    modifier onlyEC(){
        require(msg.sender == EC,"Only EC can perform this Operation ");
        _;
    }

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
