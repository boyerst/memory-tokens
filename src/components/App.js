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
    // Load the cards on the page by putting them in the cardArray in state
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



    // Function that is executed when we map out all of the cards in the cardArray onto the page
      // In the mapping below - the cards' key is passed to this.chooseImage
        // But choose image takes cardId, so does the function just use the key as a cardId❓
    chooseImage = (cardId) => {
      // Convert the cardId (which is the key passed to chooseImage in the mapping❓) to string
      cardId = cardId.toString()
      // If the card is in the cardsWon array (has already been matched, you have collected the token), then show the blank image
      if(this.state.cardsWon.includes(cardId)) {
        return window.location.origin + '/images/white.png'
      }
      // If this card has been chosen/flipped, then show the card 
      else if(this.state.cardsChosenId.includes(cardId)) {
        return CARD_ARRAY[cardId].img
      } else {
        // If the above isn't true and it hasn't been matched, then display the blank image
        return window.location.origin + '/images/blank.png'
      }
    }

    // Async function to which we pass in the flipped card Id
    flipCard = async (cardId) => {
      // Give var a value of how many cards that have already been chosen
      let alreadyChosen = this.state.cardsChosen.length
      // Update state with card chosen to flip
        // We use the spread syntax in order to add on new items which keeping the current items in the arrays
      this.setState({
        // Update the choseCard array in state to include this card that was just flipped
          // We target the flipped card by referencing the cardArray array with cardId and name
        cardsChosen: [...this.state.cardsChosen, this.state.cardArray[cardId].name],
        // We pass it the specific id that we assigned as the 'data-id' value which was assigned the 'key' value
        cardsChosenId: [...this.state.cardsChosenId, cardId]
      })
      // If the user has already chosen a card before this one (giving the alreadyChosen var a value of 1), then check for a match because we now have two cards that we can compare
      if (alreadyChosen === 1) {
        setTimeout(this.checkForMatch, 100)
      }
    }




    checkForMatch = async () => {
      // This var equals the card that is in the first index of the cardsChosenId array
        // The cards are stored in that array under their cardIds <- which derive from data-id <- which derive from key <- which derive from the 'id' that React gives each value as they are map()ed in the render() function
      const optionOneId = this.state.cardsChosenId[0]
      // This var equals the card that is in the second index of the cardsChosenId array
      const optionTwoId = this.state.cardsChosenId[1]
      // Logic for when a match is found
      // Why do we have two conditional checks for match here (in 'if' and 'else if')❓❓❓
      // FIRST condition: checks if the ids in the cardsChosenId array are matching❓
      if(optionOneId == optionTwoId) {
        alert('You have clicked the same image!')
        // SECOND condition: checks if the Id AND name are matching❓
      } else if (this.state.cardsChosen[0] === this.state.cardsChosen[1]) {
        alert('You found a match!')
        // REFACTOR: to implement the blockchain and collect tokens after matching
        // Call the mint() function on the token contract
          // Same as we did in the test but with web3.js
          // The mint() function in ERC721.sol takes 2 arguments - an account and a URI
            // REMINDER: In the ERC721.sol function it took address to, uint256 tokenId - but we are oveerriding this function to tailor it to our app
        this.state.token.methods.mint(
          // 1st ARG = account
            // Passed as the 'account' or the account we connected to the blockchain with
          this.state.account, 
          // 2nd ARG = URI
            // The URI is parsed by building a URL using...
              // 1. window.location.origin = current location = localhost:3000
              // 2. The img from the card from the cards' object in CARD_ARRAY, converted to string
              // Ex. 'localhost:3000/images/hotdog.png'
          window.location.origin + CARD_ARRAY[optionOneId].img.toString()
        )
        // REMINDER: with web3.js when we are triggering a tx on the blockchain we must include .send for the function to fully execute the method - in this case, minting
        // 'Send from the account we are connected to the blockchain with'
        .send({ from: this.state.account })
        // Wait for tx hash to come back from the blockchain
          // When this is received...execute these tasks...
        .on('transactionHash', (hash) => {
          // Set state with matching cards
          this.setState({
            // Add the chosen and matching card Ids to cardsWon array
            // They will be cleared out of cardsChosen below          
            cardsWon: [...this.state.cardsWon, optionOneId, optionTwoId],
            // Add the URI of the token we collected to the tokenURIs array
              // This will allow us to reload the page, play mutliple times and store our collected token forever on the blockchain
            tokenURIs: [...this.state.tokenURIs, CARD_ARRAY[optionOneId].img]
          })
        })
      } else {
        alert('Sorry, please try again')
      }
      // Reset the arrays for the next round of guessing
      this.setState({
        cardsChosen: [],
        cardsChosenId: []
      })
      // Alerts user if they have found all matches
        // If the amount of matching cards in the cardsWon array is the same as the principle array
      if(this.state.cardsWon.lenth === CARD_ARRAY.length) {
        alert('Congratulations! You found them all!')
      }
    }
    





  constructor(props) {
    super(props)
    this.state = {
      // This is the account we are connected to the blockchain with
      account: '0x0',
      // Refactored from 'token: {}' with empty object because better?
      token: null,
      // Since this is a uint we have to set a default value
      totalSupply: 0,
      // Default is empty array
        // Stores the URIs of the tokens that are minted when matches are made
      tokenURIs: [],
      // Stores all of the cards on the page
        // Stores via cardId AND name
      cardArray: [],
      // Stores the cards that have been flipped
        // Stores via cardId and name
        // When the array is equal to one, this signifies that the user has already chosen one, and thus the current (second) card has another card that can be checked for a match
        // When does this array reset to zero❓❓❓
      cardsChosen: [],
      // Stores the chosen cards
        // Stores via Id
        // The Id is set when the cards are render()ed and derives from the data-id which derives from the key that react gives it
        // We use this array in checkForMatch() to check for matches when the cardsChosen array already has 1 card in it at the time of flipping a second card
      cardsChosenId: [],
      // Stores the matching cards
        // Stores viaId
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
                <h1 className="d-4">The Blockchain Game</h1>

                <div className="grid mb-4" >

                  { this.state.cardArray.map((card, key) => {
                    return(
                      <img  
                        // The key is something that React needs to know whenever we implement multiple items with the same HTML element
                        key={key}
                        // Since we are dynamically chosen our images, the code will change our src automatically
                        // These have already been randomized into the cardArray in state with logic in componentWillMount
                        // Whenever we are dynamically choosing our images and find our matches, a blank white square will be shown
                        src={this.chooseImage(key)}
                        // Give each element an Id which is the key we declared above
                        data-id={key}
                        // Whenever a card is clicked we want to fire this function
                        onClick={(event) => {
                          // Define card Id by targeting data-id which was defined as key which was defined as key
                          let cardId = event.target.getAttribute('data-id')
                          // Using logical negation...
                            // 'Read this cardId as a string, and if it is NOT in the cardsWon array in state, then flip it over'
                          if(!this.state.cardsWon.includes(cardId.toString())) {
                            this.flipCard(cardId)
                          }
                        }}
                      />       
                    )
                  })}

                </div>

                <div>

                  {/* Code goes here... */}

                  <div className="grid mb-4" >
                    {/* Loops through the tokenURIs array to display the collected tokens earned and minted upon matches*/}
                    { this.state.tokenURIs.map((tokenURI, key) => {
                      return(
                        // Since this is React we use keys when listing elements
                        <img
                          key={key}
                          src={tokenURI}
                        />
                      )
                    })}

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
