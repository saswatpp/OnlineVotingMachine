pragma solidity ^0.5.0;

contract LastVoted
{
    mapping(uint=>uint) private Record;

    // call this function to send a request
    function Get(uint _Aadhar) public view returns(uint)
    {
        return Record[_Aadhar];
    }

    // call this function to send a response
    function Set(uint _Aadhar, uint _Vote) public
    {
        Record[_Aadhar] = _Vote;
    }
}