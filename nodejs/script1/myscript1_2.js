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
const util = require('util');
var CronJob = require('cron').CronJob;


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

async function getTransaction(){
	await db_select().then(z=>{
		var mydata = [];
		mydata[z[0].blknumber] = z[0].blk.toString('utf8');	
		//console.log(mydata[z[0].blknumber]);		
		if(mydata[z[0].blknumber]){
			getBlocksAllTransaction(z[0].blknumber, mydata[z[0].blknumber]);		
		}
	});	
}

getTransaction();
		
async function getBlocksAllTransaction(num, trans){
	console.log(">>>> Block Number >>>",num);
	var _ary = [];
	_ary = JSON.parse(trans).transactions;
	
	for(i=0; i<_ary.length -1; i++){
		getTransactionDetails(_ary[i]);		
		if(i === (_ary.length-2)){
			console.log(">>>>Deleting Block>>>>", num);
			db_delete(num);			
		}
	}	
}

// Working code .. //0xcbae1483180c2ae7b33457024e278cfe8dee34c2adcde8786c905a20d51bb2fa
async function getTransactionDetails(q){		
	//console.log("GETTING FOR  >>>>",q);	
	web3.eth.getTransaction(q).then((z)=>{		
		/// IF in to:null means is Contract creation		
		if(z.to === null){				
			var _usersGasPrice = parseInt(z.gasPrice);		
			web3.eth.getTransactionReceipt(q).then((x)=>{						
				var _deployer_addr = x.from;
				var _blockNumber = x.blockNumber;			
				var _transaction_fees_wei = _usersGasPrice * parseInt(x.gasUsed.toString());												
				console.log("Transction Fees Wei >>>>", _transaction_fees_wei);								
				var _transaction_fees_eth = web3.utils.fromWei(_transaction_fees_wei.toString(), 'ether');
				console.log("Transction Fees Ethers >>>>", _transaction_fees_eth);
				console.log("Deployer Addr >>>>", _deployer_addr);	
				console.log("Block Number >>>>>", _blockNumber);
				db_insert(_blockNumber, _deployer_addr, _transaction_fees_eth, _referrer_wallet='--', q);				
			}).catch(console.log);						
		}		
	}).catch(console.log);
}

async function	db_select(){	
	var con = mysql.createConnection({
  		host: "localhost",
  		user: "root",
  		password: "Admin@1234",
  		database: "dithereumbacked"
	});
	const query = util.promisify(con.query).bind(con);	
	try{
			return await query("SELECT * FROM script1_blocks limit 0,1");					
		}finally{
			con.end();			
	}			
}


async function	db_insert(_blockNumber, _deployer_addr, _transaction_fees_eth, _referrer_wallet, q){	
	var mycon = mysql.createConnection({
  		host: "localhost",
  		user: "root",
  		password: "Admin@1234",
  		database: "dithereumbacked"
	});
	const insertquery = util.promisify(mycon.query).bind(mycon);	
	try{				
			var insertsql = "INSERT INTO script1 (block_num, deployer_addr, trans_fee, referrer_wallet) VALUES ("+_blockNumber+",'"+_deployer_addr.toString()+"','"+_transaction_fees_eth.toString()+"','"+_referrer_wallet.toString()+"')";
			return await insertquery(insertsql);							
		}finally{
			mycon.end();			
	}			
}

async function	db_delete(_blockNumber){	
	var mycon2 = mysql.createConnection({
  		host: "localhost",
  		user: "root",
  		password: "Admin@1234",
  		database: "dithereumbacked"
	});
	const deletequery = util.promisify(mycon2.query).bind(mycon2);	
	try{
			var deletesql = "DELETE FROM script1_blocks where blknumber="+_blockNumber;
			console.log(deletesql);
			return await deletequery(deletesql);
		}finally{
			mycon2.end();			
	}			
}


var job = new CronJob('*/2 * * * *', function() {  
  getTransaction();
}, null, true, 'America/Los_Angeles');
job.start();


///// Additional blocks 
async function getTransaction2(){
	await db_select_desc().then(z=>{
		var mydata = [];
		mydata[z[0].blknumber] = z[0].blk.toString('utf8');	
		//console.log(mydata[z[0].blknumber]);		
		if(mydata[z[0].blknumber]){
			getBlocksAllTransaction(z[0].blknumber, mydata[z[0].blknumber]);		
		}
	});	
}

async function	db_select_desc(){	
	var con = mysql.createConnection({
  		host: "localhost",
  		user: "root",
  		password: "Admin@1234",
  		database: "dithereumbacked"
	});
	const query = util.promisify(con.query).bind(con);	
	try{
			var cnt = await query("SELECT count(blknumber) as totalrec FROM script1_blocks");
			if(cnt[0].totalrec > 30){
				var rec = await query("SELECT * FROM script1_blocks ORDER BY blknumber DESC limit 1");
				console.log("RECORD >>>",rec);				
			}					
		}finally{
			con.end();			
	}			
}

db_select_desc();

var job = new CronJob('*/3 * * * *', function() {  
  getTransaction2();
}, null, true, 'America/Los_Angeles');
job.start();



