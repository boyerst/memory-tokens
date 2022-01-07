// Import the contract
const MemoryToken = artifacts.require('./MemoryToken.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()


// Contract function used to create the tests
contract('Memory Token', (accounts) => {
  // First thing we want to do is declare the token...
    // This is simply a var that we can asign the token to when we fetch it back from the blockchain <- for example when you are interacting with the Truffle console you want to be able to use this var
  let token

  // Here we create a hook using a before() block so that BEFORE every test, the code in the block will be run
    // This is especially helpful for repeat functions - in this case we need to fetch the token for each test, so we just throw it in this hook

  before(async () => {
    // We use the exact same code that we do in the Truffle console 
    // We store the value of the contract in the token var
    token = await MemoryToken.deployed()
  })


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
    // We want to fetch the memory token before we write more tests
    it('has a name', async () => {
      const name = await token.name()
      assert.equal(name, 'Memory Token')
    })
  })
})
