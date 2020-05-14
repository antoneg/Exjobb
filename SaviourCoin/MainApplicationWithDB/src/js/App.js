import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import SaviourCoin from '../../build/contracts/SaviourCoin.json'
import Content from './Content'
import 'bootstrap/dist/css/bootstrap.css'
import equal from 'fast-deep-equal'

//In form props used to pass date down to child component
//Uses data to check if have voted

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      accounts: [],
      blogs: [],
      from: '0x0',
      to: '0x0',
      balanceTo: 0,
      balanceFrom: 0,
      testState: false,
    }

    this.transferCurrency = this.transferCurrency.bind(this)
    this.updateUser = this.updateUser.bind(this)

  this.Web3 = require('web3')
  this.web3 = new Web3('HTTP://127.0.0.1:7545')

  this.contractJson = require('../../build/contracts/SaviourCoin.json')
  this.contractAddress = this.contractJson.networks[5777].address //Osäker på om den här är hårdkodad

  this.contract = new this.web3.eth.Contract(this.contractJson.abi, this.contractAddress)
  }

  componentDidMount() {
    this.updateUser()
  }
 
  updateUser() {
    this.web3.eth.getAccounts().then((accs) => {
      this.setState({ accounts: accs })

      this.setState({ from: this.state.accounts[0] })
      this.setState({ to: this.state.accounts[1] })
      
      this.contract.methods.balanceOf(this.state.to).call( (err, result) => {
        this.setState({ balanceTo: result })
      })
      this.contract.methods.balanceOf(this.state.from).call( (err, result) => {
        this.setState({ balanceFrom: result })
      })
  })
  }

  transferCurrency(to, from, value) {
    this.contract.methods.transfer(to, value).send({from: from})
    .once('receipt', (receipt) => {console.log('\n' + "Transaction successfull!")});

    this.updateUser()
  }

  render() {
    return (
      <div>
        <div>
          <h1>App.js</h1>
          <br/>
          <Content 
            from={this.state.from}
            to={this.state.to}
            balanceFrom={this.state.balanceFrom}
            balanceTo={this.state.balanceTo}
            blogs={this.state.blogs}
          />
        </div>
      </div>
    )
  }
}

ReactDOM.render(
   <App />,
   document.querySelector('#root')
)