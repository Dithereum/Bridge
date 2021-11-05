/* REQUIREMENT
*Incentive system overview*

There will be 2 scrips.. 

Script 1:
=> this node.js script fetches all transactions from block.. 
And then filter out all the transactions as smart contract calls 
(all normal DTH transfer transactions will be ignored, only smart contracts calls transactions will be considered)

=> Lets say you got 10 smart contract transactions.. 
 Then loop through all the txns and find (1) contract address (2) contract deployer wallet
  (3) referrer wallet from contract.. We can store this data in DB,
   so we don't have to query blockchain all the time.. (4) transaction fee of that contract call. 

=> once you have all those data, then save them in the database.
 Every deployer wallet and their commission amount 
 (which will be 50% of trx fee for deployer and 10% of txn fee for referrer).
  Increment this amounts for every transaction of that particular contract deployer and contract referrer. 
*/

var mysql = require('mysql');
const WebSocket = require('ws');
require('dotenv').config();
const Web3 = require("web3");
var Tx = require('ethereumjs-tx').Transaction;
var EXCLUDE_THESE = ['Transfer']


const options = {
    timeout: 30000,
    reconnect: {
      auto: true,
      delay: 5000,
      maxAttempts: 10,
      onTimeout: false,
    },
    clientConfig: {
      keepalive: true,
      keepaliveInterval: 60000,
      maxReceivedFrameSize: 100000000,
      maxReceivedMessageSize: 100000000,
    },
};

var getwsprovider = () =>{     
    const wsprovider = new Web3.providers.WebsocketProvider(process.env.COMPANY_CONTRACT_URL, options);    
    wsprovider.on("connect", ()=>{
        console.log(" websocket connected..")        
    })
    wsprovider.on("error", (e)=>{
        console.log(" websocket error..")    
    })
    wsprovider.on("end", (e)=>{
        console.log(" websocket end..")        
    })
    wsprovider.on("close", (e)=>{
        console.log(" websocket close..")        
    })
    wsprovider.on("timeout", (e)=>{
        console.log(" websocket timeout..")        
    })
    wsprovider.on("exit", (e)=>{
        console.log(" websocket exit..")        
    })
    wsprovider.on("ready", (e)=>{
        console.log(" websocket ready..")
    })    
    return wsprovider
}

let web3 = new Web3(getwsprovider());

var lastBlockNumber = 0;
// script1 last block number fetched

var mydata = [];
process.env.script1LBN = 0;
async function getmyblock(BlokNum){
	console.log("In get my block ");	
	//web3.eth.getBlock('12189103').then(console.log);	
	//web3.eth.defaultblock = 'earliest'
	//console.log("Block Number ::::",web3.eth.defaultblock);
	/*	
	web3.eth.getBlock(BN).then((z)=>{
			console.log(">>>>>",z.number);		
			var transactionAry = z.transactions;
			transactionAry.forEach((tr)=>{
					console.log(tr);
			});			
	});
	*/
	var myblk = await web3.eth.getBlock(BlokNum);		
	mydata[myblk.number] = myblk;
	//BlokNum++;	
	//setTimeout(()=>{ getmyblock(BlokNum); },1500);
}
 
async function getTransaction(){
	setTimeout(()=>{
		//console.log(">>>> in get transaction >>>>",mydata);
		for(const [num, trans] of Object.entries(mydata)){
			//console.log("NUM >>>>",num);	
			//console.log("TRAnsaction >>>>>",trans);				
			getBlocksAllTransaction(num, trans);			
			//delete mydata[num]; // REMOVE it Done 
		}
	},5000);	
	//setTimeout(()=>{ getTransaction() }, 1500);
}

Promise.all([
		//getmyblock(process.env.script1LBN),
		getmyblock(12189103),				
		getTransaction()
]).then(([getmyblkresponse, gettransactionresponse])=>{
	//console.log(getmyblkresponse);
	//cosole.log(gettransactionresponse);
}).catch((err)=>{
	console.log(err)
})

async function getBlocksAllTransaction(num, trans){
	console.log(">>>> Num >>>",num);
	//console.log(">>>> Trans >>>",trans);
	trans.transactions.forEach((q)=>{
		getTransactionDetails(q);
	})	
}

// Working code .. //0xcbae1483180c2ae7b33457024e278cfe8dee34c2adcde8786c905a20d51bb2fa
function getTransactionDetails(q){
	console.log("GETTIGN FOR  >>>>",q);
	web3.eth.getTransaction(q.toString()).then((z)=>{
		/// IF in to:null means is Contract creation
		if(z.to === null){
			//console.log(z);				
			var _usersGasPrice = parseInt(z.gasPrice);		
			web3.eth.getTransactionReceipt(q.toString()).then((x)=>{
				console.log("XXXXX>>>>>",x);
				var _deployer_addr = x.from;
				var _blockNumber = x.blockNumber;			
				var _transaction_fees_wei = _usersGasPrice * parseInt(x.gasUsed.toString());												
				console.log("Transction Fees Wei >>>>", _transaction_fees_wei);								
				var _transaction_fees_eth = web3.utils.fromWei(_transaction_fees_wei.toString(), 'ether');
				console.log("Transction Fees Ethers >>>>", _transaction_fees_eth);
				console.log("Deployer Addr >>>>", _deployer_addr);	
				console.log("Block Number >>>>>", _blockNumber);			 
			}).catch(console.log);			
		}		
	}).catch(console.log);	
}