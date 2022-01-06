pragma solidity ^0.5.0;

import "./ERC721Full.sol";


// Here we create the ERC721 tokens for the tokens we will collect during the game
  // MemoryToken contract INHERITS from ERC721Full contract
contract MemoryToken is ERC721Full {
  // 1st Naming Logic
  // Give the contract a name by declaring a state variable 
    // State variables apply to the entire contract not just a function
    // It is stored on the blockchain
  // string public name = "Memory Token";

  // 2nd Naming Logic
    // We use a constructor which is a function that is run everytime a smart contract is created or put on the blockchain
    // We are implementing the constructor that is inherited from the ERC721Full contract
    // We include ERC721Full after the constructor as this is how we tell our contract to give the same arguments as ERC721
      // ERC721 takes to args, both strings... name ("Memory Token") and symbol ("MEMORY") that we pass thru our constructor
      // Thus we are naming our contract by using the arguments that we inherit from ERC721Full
        // ERC721Full takes a name as an arg, so we simply use that here
  constructor () ERC721Full ("Memory Token", "MEMORY") public {
    // We leave this empty as there is no logic required at the moment
  }

}
