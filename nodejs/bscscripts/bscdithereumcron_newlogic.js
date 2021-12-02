/*
CREATE TABLE
    contract_orders (
        chainid BIGINT,
        orderid BIGINT,        
);
*/

var mysql = require('mysql');
const util = require('util');
const WebSocket = require('ws');
require('dotenv').config();
const Web3 = require("web3");
var Tx = require('ethereumjs-tx').Transaction;
var Contract = require('web3-eth-contract');
var CHAIN = {'chain':'rinkeby'};

var INFURA_PROVIDER = "https://rinkeby.infura.io/v3/8102c6c81e12418588c89d69ac7a3f04";
var CONTRACT_ADDR = '0xB6495879f4f88D3563B52c097Cb009E286586137';
var CONTRACT_ADDR_ABI = [{"anonymous":!1,"inputs":[{"indexed":!0,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":!0,"internalType":"address","name":"user","type":"address"},{"indexed":!1,"internalType":"uint256","name":"value","type":"uint256"}],"name":"CoinIn","type":"event"},{"anonymous":!1,"inputs":[{"indexed":!0,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":!0,"internalType":"address","name":"user","type":"address"},{"indexed":!1,"internalType":"uint256","name":"value","type":"uint256"}],"name":"CoinOut","type":"event"},{"anonymous":!1,"inputs":[{"indexed":!0,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":!0,"internalType":"address","name":"user","type":"address"},{"indexed":!1,"internalType":"uint256","name":"value","type":"uint256"}],"name":"CoinOutFailed","type":"event"},{"anonymous":!1,"inputs":[{"indexed":!0,"internalType":"address","name":"_from","type":"address"},{"indexed":!0,"internalType":"address","name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":!1,"inputs":[{"indexed":!0,"internalType":"address","name":"signer","type":"address"},{"indexed":!0,"internalType":"bool","name":"status","type":"bool"}],"name":"SignerUpdated","type":"event"},{"anonymous":!1,"inputs":[{"indexed":!0,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":!0,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":!0,"internalType":"address","name":"user","type":"address"},{"indexed":!1,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":!1,"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"TokenIn","type":"event"},{"anonymous":!1,"inputs":[{"indexed":!0,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":!0,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":!0,"internalType":"address","name":"user","type":"address"},{"indexed":!1,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":!1,"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"TokenOut","type":"event"},{"anonymous":!1,"inputs":[{"indexed":!0,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":!0,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":!0,"internalType":"address","name":"user","type":"address"},{"indexed":!1,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":!1,"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"TokenOutFailed","type":"event"},{"inputs":[],"name":"acceptOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_signer","type":"address"},{"internalType":"bool","name":"_status","type":"bool"}],"name":"changeSigner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"coinIn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"_orderID","type":"uint256"}],"name":"coinOut","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"orderID","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"signer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"tokenAmount","type":"uint256"},{"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"tokenIn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"tokenAmount","type":"uint256"},{"internalType":"uint256","name":"_orderID","type":"uint256"},{"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"tokenOut","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];
var TOKEN_ADDRESS = "0xb01f18db95f3634ac7b1f508a3850c2c80e1bdca";
var chainid = 4; // rinkeby
var networkid = "rinkeby";

// ORDERS
var myorderID = [...Array(90000).keys()].toString().split(',');

if(myorderID[0] === '0'){
	myorderID.shift();
 	//console.log(myorderID);	
} 

async function	getAvailableAdminWallet(){	
	var con5 = mysql.createConnection({
  		host: process.env.DB_HOST.toString(),
  		user: process.env.DB_USER.toString(),
  		password: process.env.DB_PASSWORD.toString(),
  		database: "dithereumbacked",
  		connectTimeout: 100000,
  		port:3306
	});
	const query5 = util.promisify(con5.query).bind(con5);	
	try{
			var select_wallet_query = "select * from AdminWalletsView where chainid="+chainid+" AND networkid='"+networkid+"' limit 1";
			console.log(">>>> Query >>>>", select_wallet_query);			
			var _adminwallet = await query5(select_wallet_query);			
			console.log("<<<< Available Wallet >>>> ", _adminwallet[0]);
			if(_adminwallet[0]){
				process.env.ADMIN_WALLET=_adminwallet[0].walletid;
				process.env.ADMIN_WALLET_PK=_adminwallet[0].walletpk;
				process.env.CHAIN_ID=_adminwallet[0].chainid;
				process.env.NETWORK_ID=_adminwallet[0].networkid;	
			}else{
				console.log(">>>>> NOTE:::::::: No Admin wallet available >>>>");				
				process.exit(1);
			}		
	}catch(e){
			console.log("ERROR SQL>>Catch",e);
	}finally{
			con5.end();			
	}			
}

process.env.lastnonce = 0;

getAvailableAdminWallet().then(()=>{
		console.log(" >>>> ADMIN_WALLET:",process.env.ADMIN_WALLET);
		//console.log(" >>>> ADMIN_WALLET_PK:",process.env.ADMIN_WALLET_PK);
		console.log(" >>>> CHAIN_ID:",process.env.CHAIN_ID);
		console.log(" >>>> NETWORK_ID:",process.env.NETWORK_ID);
		(async()=>{
			await web3.eth.getTransactionCount(process.env.ADMIN_WALLET).then((z)=>{				
				process.env.lastnonce = parseInt(z);
				freeze_wallet();	
			}).catch(console.log);	
		})();
});


var filter = {'to': CONTRACT_ADDR.toString()}

const options = {
    timeout: 30000,
    reconnect: {
      auto: true,
      delay: 5000,
      maxAttempts: 10,
      onTimeout: true,
    },
    clientConfig: {
      keepalive: true,
      keepaliveInterval: 60000,
      maxReceivedFrameSize: 100000000,
      maxReceivedMessageSize: 100000000,
    },
};

async function company_bridge_send_method(_toWallet, _amt, orderid, _chainid){	 
    _amt = Math.floor(_amt / 1000000000); /// JUST TO TEST SOME RANDOM AMT TO MAKE SMALL	    		           
    let bridgeweb3 = new Web3(new Web3.providers.HttpProvider(INFURA_PROVIDER));		    
    web3.eth.handleRevert = true;  		    

	 try{
    		var company_bridgeinstance = new bridgeweb3.eth.Contract(CONTRACT_ADDR_ABI, CONTRACT_ADDR.toString());		    	
    }catch(e){
			console.log(" >>>>> EEEEE >>>>",e);		    
    }
        
    var mydata = await company_bridgeinstance.methods.tokenOut(TOKEN_ADDRESS.toString(), _toWallet.toString(), _amt.toString(), orderid.toString(), _chainid.toString()).encodeABI();    
    var requiredGas = await company_bridgeinstance.methods.tokenOut(TOKEN_ADDRESS, _toWallet, _amt, orderid, _chainid).estimateGas({from: process.env.ADMIN_WALLET.toString()});    
    console.log(">>>>> REQUIRED GAS, >>> bridge_admin_wallet <<<<<",requiredGas, process.env.ADMIN_WALLET.toString());     		
 
  	 (async()=>{
		  await bridgeweb3.eth.getGasPrice().then(gasPrice=>{
		  	    process.env.lastnonce = parseInt(process.env.lastnonce)+1;
 	 	  		 console.log(">>>>> @@@@@ <<<<< NEW NONCE >>>>",process.env.lastnonce);                    			                    				                    			                                                                  
		       const raw_tx = {   
		           nonce: web3.utils.toHex(parseInt(process.env.lastnonce)),                    
		           gasPrice: web3.utils.toHex(gasPrice),
		           gasLimit: requiredGas,
		           from: process.env.ADMIN_WALLET.toString(),
		           to: CONTRACT_ADDR.toString(),                        
		           value: '0x0',
		           data: mydata 
		       }; 
		       
		       console.log("raw_tx >>>>",raw_tx);                                                                   		 									 
		       var tx = new Tx(raw_tx, CHAIN);                            		                            		                            
		       var privateKey = Buffer.from(process.env.ADMIN_WALLET_PK.toString(), 'hex');		                            
				 //console.log(">>>> PrivateKey, Bridge Admin Walletpk >>>>>", privateKey, process.env.ADMIN_WALLET_PK.toString());									 											 														 																						                            
		       tx.sign(privateKey);                        
		       var serializedTx = tx.serialize();
		       (async()=>{
		       	 console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
		       	 console.log(">>>> Sending Signed Transaction >>>>> In Async Function >>>>>");
		       	 console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
		       	 /*
		       	 await bridgeweb3.eth.sendSignedTransaction('0x'+serializedTx.toString('hex')).then((receipt)=>{
					     	  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");       	  
					     	  console.log("<<<< RECEIPT >>>>",JSON.stringify(receipt));              
					     	  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
					     	  insert_into_noncetable(process.env.lastnonce);					     	 
					 }).catch(error=>{                       
					        console.log("<<< ERR, sendsigedTransaction >>>",error);         
					 });
					 */
					bridgeweb3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, hash) => {
					  if (err) { 
					    console.log(err);
					    return; 
					  }else{
					    console.log("Transaction Hash >>>",hash);
					 	}
					 });				 	 		       	
		       })();		    		                                                                                                                   
		  }) 
	 })();		 
}

async function insert_into_noncetable(newnonce){
	var con7 = mysql.createConnection({
  		host: process.env.DB_HOST.toString(),
  		user: process.env.DB_USER.toString(),
  		password: process.env.DB_PASSWORD.toString(),
  		database: "dithereumbacked",
  		connectTimeout: 100000,
  		port:3306
	});
	const query7 = util.promisify(con7.query).bind(con7);	
	try{
			var insert_nonce_query = "insert into noncetable (walletid,nonce,chainid,networkid) values ('"+process.env.ADMIN_WALLET+"',"+newnonce+","+process.env.CHAIN_ID+",'"+process.env.NETWORK_ID+"')";
			console.log(">>>> Query >>>> insert_nonce_query >>>>", insert_nonce_query);			
			await query7(insert_nonce_query).catch(console.log);		
	}catch(e){
			console.log("ERROR SQL>>Catch",e);
	}finally{
			con7.end();			
	}
}

async function checkLatestBlock(){
	 //######  UNCOMMENT BELOW LINE FOR 100 BLOCKS  ######//
 	 //var toblock =  await web3.eth.getBlockNumber();
 	 //var fromblock = toblock-1000;
 	 
 	 // For testing 	  	  
 	 var toblock=9668500;
 	 var fromblock=9668200;	 
	 getEventData_CoinIn(fromblock, toblock);	 
	 getEventData_TokenIn(fromblock, toblock); 	
}

//checkLatestBlock();

async function freeze_wallet(){
	var con8 = mysql.createConnection({
  		host: process.env.DB_HOST.toString(),
  		user: process.env.DB_USER.toString(),
  		password: process.env.DB_PASSWORD.toString(),
  		database: "dithereumbacked",
  		connectTimeout: 100000,
  		port:3306
	});
	const query8 = util.promisify(con8.query).bind(con8);	
	try{
			var update_query = "UPDATE AdminWallets SET isFrozen=1, freezetime=UNIX_TIMESTAMP() where walletid='"+process.env.ADMIN_WALLET+"' AND chainid="+process.env.CHAIN_ID;			
			console.log(">>>> Query >>>> Update Query >>>>", update_query);			
			await query8(update_query).catch(console.log);
			checkLatestBlock();		
	}catch(e){
			console.log("ERROR SQL>>Catch",e);
	}finally{
			con8.end();			
	}
}

var getwsprovider = () =>{     
	 var httpprovider = new Web3(new Web3.providers.HttpProvider(INFURA_PROVIDER, options));     
    return httpprovider
}

let web3 = new Web3(getwsprovider());

async function getEventData_CoinIn(_fromBlock, _toBlock){ 
	 const myinstance = new web3.eth.Contract(CONTRACT_ADDR_ABI, CONTRACT_ADDR.toString());
	 try{				
		 		await myinstance.getPastEvents('CoinIn',  {
		 				'filter':{'orderID': myorderID},
		 				fromBlock: _fromBlock,       
						toBlock: _toBlock
		    	},function(error,events){	    	
		    		try{
		    			console.log(error);		 				
		 				var eventlen = events.length;
		 				process.env.CoinInEventLen = events.length;
		 				console.log("COIN IN >>> eventlen >>>>", eventlen);		 				
		 				
		 				for(var i=0;i<eventlen; i++){		 						 										
		 					var eve = events[i];
 				         //emit CoinIn(orderID, msg.sender, msg.value)
		 					var _blkNumber = eve.blockNumber;			 									
		 					var _orderid = eve.returnValues.orderID;							
							var _sendcoinsTo = eve.returnValues.user;
							var _amount = eve.returnValues.value;
							var _chainid = eve.returnValues.chainID ? eve.returnValues.chainID : '0';   
							
							//console.log(">>>>> CHAIN id, Order Id >>>>",_chainid, _orderid);							
							if(_chainid && (parseInt(_amount))){							
								try{
									(async()=>{																																			 		
									   var cnt = await db_select(_chainid, _orderid, _sendcoinsTo, _amount).catch(console.log);											      											   
									})();									   										   
								}catch(e){
									console.log(">>>>>Catch >>>>",e);									
								}																
							}else{
								console.log(">>>> CoinIn >>>>In for loop, _orderid, _chainid,  _amount, i >>>>", _orderid, _chainid, _amount, i);						
							}														
						}
					}catch(e){
							console.log(e);
					}					
		 		});
		 		////
		 }catch(e){	console.log("<<<< Error >>>>",e); }	 	 	 
}


async function getEventData_TokenIn(_fromBlock, _toBlock){ 
	 const myinstance = new web3.eth.Contract(CONTRACT_ADDR_ABI, CONTRACT_ADDR.toString());	 	 
	 try{
		 		await myinstance.getPastEvents('TokenIn', {	'filter':{'orderID': myorderID},	fromBlock: _fromBlock, toBlock: _toBlock },function(error,myevents){		    			
		 				console.log(error);		 				
		 				var myeventlen = myevents.length;		
		 				process.env.TokenInEventLen = myevents.length;
		 				if((parseInt(process.env.CoinInEventLen) === 0) && (parseInt(process.env.TokenInEventLen) === 0)){
		 						// UNFREEZE ROW as no events found in specified block range 
								no_records_found_unfreeze_row()
						}		 								 				
		 				console.log("TOKEN IN >>> myeventlen >>>>", myeventlen);		 				
		 				for(var k=0; k<myeventlen;k++){		 						
		 					var myeve = myevents[k];
		 					//console.log(">>> k, myeve >>>",k, myeve);							
		 					var _myblkNumber = myeve.blockNumber;					
		 					var _myorderid = myeve.returnValues.orderID;
							var _mytokenAddress = myeve.returnValues.tokenAddress;
							var _mysendcoinsTo = myeve.returnValues.user;
							var _myamount = myeve.returnValues.value;
							var _mychainid = myeve.returnValues.chainID;
							//console.log(">>>>>### TokenIn eventlen, k, CHAIN id, Order Id >>>>",myeventlen, k, _mychainid, _myorderid);
							
							if(_mychainid && (parseInt(_myamount))){							
									try{
										(async()=>{																																			 		
										   var cnt = await db_select(_mychainid, _myorderid, _mysendcoinsTo, _myamount).catch(console.log);											      											   
										})();									   										   
									}catch(e){
										console.log(">>>>>Catch >>>>",e);									
									}																
							}else{
								console.log(">>> TOKENIN >>>> In for loop, _orderid, _chainid,  _amount, i >>>>", _myorderid, _chainid, _amount, i);						
							}							
						}													 												
		 		});
		 }catch(e){	console.log("<<<< Error >>>>",e); }	 	 	 
}


async function no_records_found_unfreeze_row(){
	var con6 = mysql.createConnection({
  		host: process.env.DB_HOST.toString(),
  		user: process.env.DB_USER.toString(),
  		password: process.env.DB_PASSWORD.toString(),
  		database: "dithereumbacked",
  		connectTimeout: 100000,
  		port:3306
	});
	const query = util.promisify(con6.query).bind(con6);
	const insertquery = util.promisify(con6.query).bind(con6);	
	try{
		  	process.env.ADMIN_WALLET
			process.env.CHAIN_ID
			process.env.NETWORK_ID
			console.log(" >>>> No record found >>>>");
			var unfreeze_query = "UPDATE AdminWallets SET isFrozen=0 where walletid='"+process.env.ADMIN_WALLET+"' AND chainid="+process.env.CHAIN_ID+" AND networkid='"+process.env.NETWORK_ID+"'";
			console.log(">>>>> UNFREEZE QUERY >>>>>", unfreeze_query);			
			await query(unfreeze_query);		
	}catch(e){
			console.log("ERROR SQL>>Catch",e);
	}finally{
			con6.end();			
	}	
}

async function	db_select(chainid, orderid, sendcoinsTo, amount){	
	var con6 = mysql.createConnection({
  		host: process.env.DB_HOST.toString(),
  		user: process.env.DB_USER.toString(),
  		password: process.env.DB_PASSWORD.toString(),
  		database: process.env.DB_DATABASE.toString(),
  		connectTimeout: 100000,
  		port:3306
	});
	const query = util.promisify(con6.query).bind(con6);
	const insertquery = util.promisify(con6.query).bind(con6);	
	try{
			var select_query = "SELECT count(orderid) as rec FROM contract_orders where chainid="+parseInt(chainid)+" AND orderid="+parseInt(orderid);			
			var records = await query(select_query);			
			if(parseInt(records[0].rec) < 1){
				var insert_query = "INSERT INTO contract_orders (`chainid`,`orderid`) VALUES ("+chainid+","+orderid+")";		
				console.log(">>> Inserting record, orderid, chainid >>>",orderid, chainid);
				await insertquery(insert_query).catch(console.log);
				var z = await company_bridge_send_method(sendcoinsTo, amount, orderid, chainid).catch(console.log);				
			}else{
				console.log(">>> Skipping already in database, orderid, chainid ",orderid, chainid);
			}
	}catch(e){
			console.log("ERROR SQL>>Catch",e);
	}finally{
			con6.end();			
	}			
}