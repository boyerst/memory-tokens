import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import MemoryToken from '../abis/MemoryToken.json'
import brain from '../brain.png'


// This is a React.js component  
class App extends Component {

  // Use React lifecycle method to call our loadWeb3 function
  async componentWillMount() {
    // Load our web3
    await this.loadWeb3()
    // Call our function that shows us we are connected to web3
    await this.loadBlockchainData()
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


    } else {
      // IF we cannot fetch the networkId and define networkData
      alert('Smart contract not deployed to the network')
    }
  }


  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      // Refactored from 'token: {}' with empty object because better?
      token: null,
      // Since this is a uint we have to set a default value
      totalSupply: 0,
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

                  {/* Code goes here... */}

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
