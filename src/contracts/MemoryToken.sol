pragma solidity ^0.5.0;

import "./ERC721Full.sol";


// We create the ERC721 tokens for the tokens we will collect during the game
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


  // We want to make the token mintable and distributable to other people
    // The idea of the game is that it starts from zero - whenever a token is created the number of them starts at zero
      // We want people to collect them
  // Mint the token
    // Takes two arguments
      // 1. The address ("username") of the person we are going to give the token to
      // 2. tokenURI is the reference to the image of the token (cats, etc.)
  // Completing this function gives us a complete smart contract
    // All we need for the contract are...
      // A couple of variable values (the name and the symbol) <- in the constructor
      // A special mint() function <- below
    // This highlights how easy it is to create a smart contract using open zeppelin templates
  function mint(address _to, string memory _tokenURI) public returns (bool) {
    // Here we have to override the mint function in ERC721Full.sol because we want to create our own and do it a little bit differently
      // The standard function TAKES a tokenId but we want to MAKE a tokenId

    // Set the token Id
      // We inherit the totalSupply() function from ERC721Full.sol
      // This function returns the number of tokens that already exist
      // We use this number, and increment it to create a new tokenId without accidentally overriding a tokenId that already exists
    uint _tokenId = totalSupply().add(1);
    // Using _mint here is how we pass in the mint function from the contract we have inherited from (ERC721Full.sol)
      // The inherited function takes the address _to (the address of the person we are sending the token to) and the tokenId we set right above
      // So this is what we pass it
    _mint(_to, _tokenId);

    // Set the tokenURI
      // We inherit the _setTokenURI function from ERC721Full.sol
      // The inherited function takes the tokenId (that we set above) and the uri for the token
    _setTokenURI(_tokenId, _tokenURI);

    // Return true because the function returns a bool
    return true
  }

}
