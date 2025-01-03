// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract triviaHub{

    address public admin;

    struct Category{
        string catgryType;
        string ipfsHash;      
    }

    event setCategory(uint, string, string);

    constructor(){
        admin = msg.sender;
    }

    modifier onlyAdmin{
        require((msg.sender == admin),"Not authorised");
        _;
    }

     mapping(uint => Category) public Categories;

    function setCatgry(uint _ctgryId, string memory _catgryType, string memory _ipfsHash) public onlyAdmin(){
        Categories[_ctgryId] = Category(_catgryType, _ipfsHash);
        emit setCategory(_ctgryId, _catgryType, _ipfsHash);
    }
}