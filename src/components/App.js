import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import MemoryToken from '../abis/MemoryToken.json'
import brain from '../brain.png'

// Keeps track of the names and image locations for each card
  // This will reference each image in the public folder for each tile
const CARD_ARRAY = [
  {
    name: 'fries',
    img: '/images/fries.png'
  },
  {
    name: 'cheeseburger',
    img: '/images/cheeseburger.png'
  },
  {
    name: 'ice-cream',
    img: '/images/ice-cream.png'
  },
  {
    name: 'pizza',
    img: '/images/pizza.png'
  },
  {
    name: 'milkshake',
    img: '/images/milkshake.png'
  },
  {
    name: 'hotdog',
    img: '/images/hotdog.png'
  },
  {
    name: 'fries',
    img: '/images/fries.png'
  },
  {
    name: 'cheeseburger',
    img: '/images/cheeseburger.png'
  },
  {
    name: 'ice-cream',
    img: '/images/ice-cream.png'
  },
  {
    name: 'pizza',
    img: '/images/pizza.png'
  },
  {
    name: 'milkshake',
    img: '/images/milkshake.png'
  },
  {
    name: 'hotdog',
    img: '/images/hotdog.png'
  }
]


// This is a React.js component  
class App extends Component {

  // Use React lifecycle method to call our loadWeb3 function
  async componentWillMount() {
    // Load our web3
    await this.loadWeb3()
    // Call our function that shows us we are connected to web3
    await this.loadBlockchainData()
    // Load the cards on the page
    // 'Set the cardArray array in state with the CARD_ARRAY above, but do so in a randomized fashion by using the sort() function and random() function'
    this.setState({ cardArray: CARD_ARRAY.sort(() => 0.5 - Math.random())})
  }


  async loadWeb3() {
    // Create a web3 instance and set a provider
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }


  // We use this to perform a task to ensure web3 is connected to our app
  async loadBlockchainData() {
    // Stash the web3 value
    const web3 = window.web3
    // Fetch the account we are connected to with MetaMask and log it onto the page
    const accounts = await web3.eth.getAccounts()
    // Print the Truffle account that we connected to our MetaMask
    console.log("account", accounts[0])
    this.setState({ account: accounts[0] })

    // Load the smart contract network
    // Fetch the network ID
    const networkId = await web3.eth.net.getId()
    console.log(networkId)
    // Fetch other network data
    const networkData = MemoryToken.networks[networkId]
    console.log(networkData)
    // Fetch only IF it's deployed to the blockchain
      // IF we can fetch the networkId and define networkData then fetch the address, etc.
    if(networkData) {
      // Fetch the ABI from the contract artifact
      const abi = MemoryToken.abi
      // Fetch the address from the contract artifact
      const address = networkData.address
      // Create the JS version of the smart 
      const token = new web3.eth.Contract(abi, address)
      // Set state after adding new JS verion of your contract to State object
      this.setState({ token })
      // Fetch the total supply from the artifact
        // With web3 we cannot just call the function <- You MUST ADD '.call'
        // If you don't it will just run the function, but not return the function
      const totalSupply = await token.methods.totalSupply().call()
      // Set Total Supply to State
      this.setState({ totalSupply })

      // Load all of the users' tokens
        // Similar to balanceOf() test functions EXCEPT we use call methods and do not push to an array
          // We set them in state
      // REMINDER: that we are fetching all of this data from the contract artifact, which is a JSON representation of your contract that is compiled by Solidity everytime your contract is compiled
        // This specific function originally comes from ERC721.sol (the NFT contract) that we inherit through our MemoryToken.sol contract
      let balanceOf = await token.methods.balanceOf(accounts[0]).call()
      // Loop through ALL of the tokens (From 0 -> however many total they have) that the owner has in their balance of tokens
        // i starts as 0; so long as i is less that the balance of the owners address, continue the loop; then add one more integer to i after you execute the code; restart the loop
      for (let i = 0; i < balanceOf; i++) {
        // Declare each token as an id for each iteration through the loop
          // Pass two arguments to tokenOfOwnerByIndex()
            // 1. the owners account address
            // 2. the index number of the token which is assigned during the For Loop
          // Since we are working with web3 we must add the .call() to run AND RETURN the function call
        let id = await token.methods.tokenOfOwnerByIndex(accounts[0], i).call()
        // Declare the tokenURI for each the tokens we grab from the users balance
          // We do this by calling the tokenURI() function in ERC721.sol contract - which simply takes the id that we declared and defined above and returns the tokenURI for the given Id
            // Q: at what point in the tokens creation is setTokenURI() called ❓
        let tokenURI = await token.methods.tokenURI(id).call()
        // Next, we push the tokenURI (which we fetched by calling tokenURI() with the id, which we fetched by calling tokenOfOWnerByIndex() with the account address and the index #) to our array in state
        this.setState({
          // The tokenURIs is all the URLS of the token (contains metadata, etc.)
          tokenURIs: [...this.state.tokenURIs, tokenURI]
        })
      }
    } else {
      // IF we cannot fetch the networkId and define networkData
      alert('Smart contract not deployed to the network')
    }
  }


    chooseImage = (cardId) => {
      cardId = cardId.toString()
      // Return all of the 
      return window.location.origin + '/images/blank.png'
      
    }








  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      // Refactored from 'token: {}' with empty object because better?
      token: null,
      // Since this is a uint we have to set a default value
      totalSupply: 0,
      // Default is empty array
      tokenURIs: [],
      // Will list all of the cards on the page
      cardArray: [],
      cardsChosen: [],
      cardsChosenId: [],
      cardsWon: []
    }
  }


  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
          <img src={brain} width="30" height="30" className="d-inline-block align-top" alt="" />
          &nbsp; Memory Tokens
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-muted"><span id="account">{this.state.account}</span></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1 className="d-4">Edit this file in App.js!</h1>

                <div className="grid mb-4" >

                  { this.state.cardArray.map((card, key) => {
                    return(
                      <img  
                        // The key is something that React needs to know whenever we implement multiple items with the same HTML element
                        key={key}
                        // Have yet to implement this function
                        src={this.chooseImage(key)}
                        // Give each element an Id which is the key we declared above
                        data-id={key}
                        // Whenever a card is clicked it will 
                      />       
                    )
                  })}

                </div>

                <div>

                  {/* Code goes here... */}

                  <div className="grid mb-4" >

                    {/* Code goes here... */}

                  </div>

                </div>

              </div>

            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
