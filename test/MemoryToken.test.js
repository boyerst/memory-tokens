// Import the contract
const MemoryToken = artifacts.require('./MemoryToken.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()


// contract function used to create the tests
  // Takes two arguments
    // 1. Name of the contract
    // 2. A function that gives you a parameter with a list of accounts that your environment provided for testing
contract('Memory Token', (accounts) => {
  // First thing we want to do is declare the token...
    // This is simply a var that we can asign the token to when we fetch it back from the blockchain <- for example when you are interacting with the Truffle console you want to be able to use this var
  let token

  // Here we create a hook using a before() block so that BEFORE every test, the code in the block will be run
    // This is especially helpful for repeat functions - in this case we need to fetch the token for each test, so we just throw it in this hook

  // Fetch the token from the blockchain before each test
    // Here we are accessing an instance of the contact which is the artifact
  before(async () => {
    // We use the exact same code that we do in the Truffle console 
    // We store the value of the contract in the token var
    token = await MemoryToken.deployed()
  })

  // Test successful deployment and check basic attributes of the token
  // describe() takes two arguments
    // 1. Description of the test
    // 2. The actual test
  describe('deployment', async () => {
    it('deploys successfully', async () => {


      // We check the address
      const address = token.address
      // Ensure that the address exists, and that it is not blank
        // We want to check that the address is present and this is how we do it
        // We don't know what the address will be bc everytime we put a new smart contract on the blockchain the address changes
      // Assert is keyword we use to check the validity of a test
      // Tell me it is not a blank address
      assert.notEqual(address, 0x0)
      // Tell me that it is not an empty string
      assert.notEqual(address, '')
      // Tell me that it is not null
      assert.notEqual(address, null)
      // Tell me that it is not undefined
      assert.notEqual(address, undefined)
    })
    // Name test
    // We want to fetch the memory token name before we write more tests
    it('has a name', async () => {
      const name = await token.name()
      assert.equal(name, 'Memory Token')
    })
    // Symbol test
    it('has a symbol', async () => {
      const symbol = await token.symbol()
      assert.equal(symbol, 'MEMORY')
    })
  })

  // Test token mint
  describe('token distribution', async () => {
    // Declare variable value 'let result'
    let result
    it('mints tokens', async () => {
      // Call the mint function and inspect the results
        // Just like we do in the console
      // We pass the _mint() test function the same args that the _mint() function takes
      // 1. _to = accounts[0]
        // At the top of the contract is the accounts variable that is injected by Truffle
          // accounts[0] represents the first account in the accounts array that is given to us by Truffle
            // This is the _to value (the address, person that we are creating the token for) from our _mint() function
      // 2. _tokenURI = see URL below
        // We use an arbitrary URL for testing purposes, it could be anything we want it to be
      await token.mint(accounts[0], 'https://www.token-uri.com/nft')


      // IT INCREASES THE TOTAL SUPPLY
        // we call the totalSupply() function that is exposed by ERC721Full contract
          // We can do this because our Memory Token contract inherits ERC721Full contract
      result = await token.totalSupply()
      // Check if the total supply = 1 because we have created 1 token
        // assert wether the total supply (result, which is a number converted to a string) = 1
          // If the first and second arguments are equal, give us the 3rd argument which is our message
      assert.equal(result.toString(), '1', 'total supply is correct')


      // IT INCREMENTS THE OWNER BALANCE
        // We call the balanceOf(the _to address of person receiving new token) function that is exposed by ERC721Full contract 
      result = await token.balanceOf(accounts[0])
      // Assert that the balance of the _to address (converted to string) is equal to 1
      assert.equal(result.toString(), '1', 'balanceOf if correct')


      // THE TOKEN BELONGS TO THE OWNER
        // result = await token.ownerOf(ID #1)
      result = await token.ownerOf('1')
      // Check if the owner of token with Id #1 belongs to the account that we minted it for
        // assert that the address of the owner of token with Id #1 (converted to string) is equal to the address if the account at index 0 (converted to string)
      assert.equal(result.toString(), accounts[0].toString(), 'ownerOf is correct')
      // ❓NO EXPLAN for this yet...
      result = await token.tokenOfOwnerByIndex(accounts[0], 0)


      // OWNER CAN SEE ALL OF THE TOKENS
        // Check how my tokens the owner account has by calling balanceOf()
      let balanceOf = await token.balanceOf(accounts[0])
      // Using JavaScript, loop through ALL of the tokens to fetch each individual token that the owner has
      let tokenIds = []
      // Start at 0 and loop all the way to balanceOf
        // Then increment them by 1
      for (let i = 0; i < balanceOf; i++) {
        // As we loop, we want to fetch all of the tokenIds that belong to the owner
          // We use the tokenOfOwnerByIndex() function that is provided by the smart contract
          // tokenOfOwnerByIndex takes two args...
              // 1. the owners address
              // 2. the index numbers 
          // tokenOfOwnerByIndex with return all of the tokens from the account we pass to it, which is accounts[0]
            // ...by taking in each i index number starting from 0 -> balanceOf #
            // The function return the tokenId of that index number of that account 
        let id = await token.tokenOfOwnerByIndex(accounts[0], i)
        // Push each of these ids to the tokenIds array (convert to string)
        tokenIds.push(id.toString())
      }
      // We will expect 1 to return because the owner should only have 1 token
        // If they had more, we could write let expected = ['1', '2', '3', '4']
      let expected = ['1']
      // Assert that the let expected array is equal to the tokenIds array
      assert.equal(tokenIds.toString(), expected.toString(), 'tokenIds are correct')


      // TOKEN URI IS CORRECT
      let tokenURI = await token.tokenURI('1')
      // Make sure the URI is equal to the same URI we arbitrarily inserted above
      assert.equal(tokenURI, 'https://www.token-uri.com/nft')
    })
  })


})














