const Tx = require('ethereumjs-tx').Transaction
const Web3 = require('web3')
const web3 = new Web3('https://ropsten.infura.io/v3/')

const account = ''
const privateKey = Buffer.from('', 'hex')


const contractAddress = ''
const abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_word",
				"type": "string"
			}
		],
		"name": "changeWord",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "_word",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getWord",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]

// pragma solidity >=0.4.25 <0.6.0;
 
// contract HelloWorld {
//   string word;
 
//   constructor(string memory _word) public {
//       word = _word;
//   }
 
//   function getWord() public view returns(string memory) {
//       return word;
//   }
  
//   function changeWord(string memory _word) public {
//       word = _word;
//   }
 
// }

const contract = new web3.eth.Contract(abi, contractAddress)
const contractFunction = contract.methods.changeWord("Star family")
const functionAbi = contractFunction.encodeABI()

web3.eth.getTransactionCount(account).then(_nonce => {
 
  const txParams = {
      nonce: web3.utils.toHex(_nonce),
      gasPrice: web3.utils.toHex(web3.utils.toWei('4', 'gwei')),
      gasLimit: web3.utils.toHex(210000),
      from: account,
      to: contractAddress,
      data: functionAbi
  };

  const tx = new Tx(txParams, { 'chain': 'ropsten' })
  tx.sign(privateKey)

  const serializedTx = tx.serialize()

  contract.methods.getWord().call()
  .then(v => console.log("Value before increment: " + v))

  web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
      .on('receipt', receipt => {
          console.log(receipt);
          contract.methods.getWord().call()
          .then(v => console.log("Value after increment: " + v))
      })

})

