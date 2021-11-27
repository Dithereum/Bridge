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

ADMIN_WALLET_ARY='0x9dD35f936298565Cc17c241fc645Eb4D1e04d895,0x6077516eea959B7fb04bB211AD0569351f3eBDbc,0x62E1960De1F9CA64d8fA578E871c2fe48b596b59,0xF420Bc88E472191B936e7904b17DFD9E6043C12e';
ADMIN_WALLET_ARY_PK='2079696c01f5e53190aa1c72e57a72b93ca4ff165bf46d6ffef3129d108a879f,8342678b959589fb5ad3cc593b410d892c8cb243363b2a30ee817070a89e8e8b,daedd37c356345aa579c5aff0a8d17e90fe9deec38054eb072fbbd10dd753942,43f92fcfbecf0aa228b427f9f3958cf12a2ef9498310bbc26216445f54e7a47b';
var filter = {'to': CONTRACT_ADDR.toString()}

// ORDERS
var myorderID = [...Array(90000).keys()].toString().split(',');

if(myorderID[0] === '0'){
	myorderID.shift();
 	//console.log(myorderID);	
} 

var WALLET_NONCE_COUNT = []; // to keep track for nonce  
var LAST_WALLET_INDEX = 0; 
var BRIDGE_ADMIN_WALLET_ARY = [];
BRIDGE_ADMIN_WALLET_ARY = ADMIN_WALLET_ARY.split(',');

BRIDGE_ADMIN_WALLET_ARY.forEach((el)=>{	
	WALLET_NONCE_COUNT[el.toString()] = 0;
})
 
var BRIDGE_ADMIN_WALLET_ARY_PK = [];
BRIDGE_ADMIN_WALLET_ARY_PK = ADMIN_WALLET_ARY_PK.split(',');
//console.log(">>>>>>>", ADMIN_WALLET_ARY);
//console.log(">>>>>>>", ADMIN_WALLET_ARY_PK);
var max_admin_wallets = BRIDGE_ADMIN_WALLET_ARY.length;
//console.log(">>>>>> max_admin_wallets >>>>>", max_admin_wallets);

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

async function getWalletTransactionCount(mywallet){
    try{			 
      	console.log(">>>> bridge_admin_wallet.toString() >>>", mywallet.toString());
	 		var _transcount = await web3.eth.getTransactionCount(mywallet);
	 		return _transcount;	 				 				  	
	 }catch(e){
			console.log("ERR getting admin wallet transaction count",e);			 
	 }
}


async function company_bridge_send_method(_toWallet, _amt, orderid, _chainid){	 
    console.log( ">>>>> WORKING ON >>>>>>",_toWallet, _amt, orderid, _chainid);	 	   
    _amt = Math.floor(_amt / 1000000000); /// JUST TO TEST SOME RANDOM AMT TO MAKE SMALL		    		           
    console.log(" Calling company bridge send coins >>>", _toWallet , _amt);    
    let bridgeweb3 = new Web3(new Web3.providers.HttpProvider(INFURA_PROVIDER));		    
    web3.eth.handleRevert = true;		    		    
	 			                              
    var mynonce = 0;
    var bridge_admin_wallet;
    var bridge_admin_walletpk;
    var transcount;
    console.log("<<<< LAST_WALLET_INDEX, max_admin_wallets >>>>",LAST_WALLET_INDEX, max_admin_wallets);
    		    
	 if(LAST_WALLET_INDEX === (max_admin_wallets-1)){			 		
	 		bridge_admin_wallet = BRIDGE_ADMIN_WALLET_ARY[0];
	 		bridge_admin_walletpk = BRIDGE_ADMIN_WALLET_ARY_PK[0];
			LAST_WALLET_INDEX = 0;			
	 }else{			 		
			LAST_WALLET_INDEX++;					
			bridge_admin_wallet = BRIDGE_ADMIN_WALLET_ARY[LAST_WALLET_INDEX];
			bridge_admin_walletpk = BRIDGE_ADMIN_WALLET_ARY_PK[LAST_WALLET_INDEX];			
	 }			   
	   console.log("~~~~~~~~~~~~~~~~~~######################~~~~~~~~~~~~~~~~~~~~~~");
		console.log(">>>> WALLET_INDEX, bridge_admin_wallet >>>>", LAST_WALLET_INDEX, bridge_admin_wallet);
		console.log("~~~~~~~~~~~~~~~~~~######################~~~~~~~~~~~~~~~~~~~~~~");										  
	 try{
    	var company_bridgeinstance = new bridgeweb3.eth.Contract(CONTRACT_ADDR_ABI, CONTRACT_ADDR.toString());		    	
    }catch(e){
		console.log(" >>>>> EEEEE >>>>",e);		    
    }
        
    var mydata = await company_bridgeinstance.methods.tokenOut(TOKEN_ADDRESS.toString(), _toWallet.toString(), _amt.toString(), orderid.toString(), _chainid.toString()).encodeABI();    
    //console.log(" >>>>> bridge_admin_wallet >>>>>>", bridge_admin_wallet);
    //web3.eth.defaultAccount = "0xF420Bc88E472191B936e7904b17DFD9E6043C12e";
    var requiredGas = await company_bridgeinstance.methods.tokenOut(TOKEN_ADDRESS, _toWallet, _amt, orderid, _chainid).estimateGas({from: bridge_admin_wallet.toString()});
    console.log(">>> Gas require >>", requiredGas);	      
    //console.log("MYDATA >>>>",mydata);       
    console.log(">>>>> REQUIRED GAS, >>> bridge_admin_wallet <<<<<",requiredGas, bridge_admin_wallet);
	 var transcount = await getWalletTransactionCount(bridge_admin_wallet);
	 var MY_TX_COUNT = WALLET_NONCE_COUNT[bridge_admin_wallet.toString()] ? (parseInt(WALLET_NONCE_COUNT[bridge_admin_wallet.toString()])+1) : 0;
	 
	 mynonce = transcount + MY_TX_COUNT;
	 console.log(" MYNonce >>>>", mynonce);	
	 WALLET_NONCE_COUNT[bridge_admin_wallet.toString()] = parseInt(WALLET_NONCE_COUNT[bridge_admin_wallet.toString()])+1;
	 console.log( " >>>>>>########<<<<<<< WALLET_NONCE_COUNT[bridge_admin_wallet.toString()] >>>>>", bridge_admin_wallet.toString(), WALLET_NONCE_COUNT[bridge_admin_wallet.toString()]);		   
	 console.log("<<< transcount, MY_TX_COUNT, mynonce, bridge_admin_wallet >>>", transcount, MY_TX_COUNT, mynonce, bridge_admin_wallet);	 	 
	 var w = await myasynCall(bridgeweb3, mynonce, bridge_admin_wallet, bridge_admin_walletpk, requiredGas, mydata);
	 return 1;
}



var getwsprovider = () =>{     
	 var httpprovider = new Web3(new Web3.providers.HttpProvider(INFURA_PROVIDER, options));     
    return httpprovider
}

let web3 = new Web3(getwsprovider());

async function myasynCall(bridgeweb3, mynonce, bridge_admin_wallet, bridge_admin_walletpk, requiredGas, mydata){	                          
     return await bridgeweb3.eth.getGasPrice().then(gasPrice=>{                    			                    				                    			                                                                  
             const myrawTx = {   
                 nonce: web3.utils.toHex(mynonce),                    
                 gasPrice: web3.utils.toHex(gasPrice),
                 gasLimit: requiredGas,
                 from: bridge_admin_wallet.toString(),
                 to: CONTRACT_ADDR.toString(),                        
                 value: '0x0', 
                 value: '0x0', 
                 data: mydata 
             };  
             
             //console.log("myrawTx >>>>",myrawTx);                                                                   		 									 
             var tx = new Tx(myrawTx, CHAIN);                            		                            		                            
             var privateKey = Buffer.from(bridge_admin_walletpk.toString(), 'hex');		                            
				 //console.log(">>>> PrivateKey, Bridge Admin Walletpk >>>>>", privateKey, bridge_admin_walletpk.toString());									 											 														 																						                            
             tx.sign(privateKey);                        
             var serializedTx = tx.serialize(); 
                                                     
             bridgeweb3.eth.sendSignedTransaction('0x'+serializedTx.toString('hex')).then((receipt)=>{
             	  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
             	  console.log("<<< bridge_admin_wallet >>>", bridge_admin_wallet);
             	  console.log("<<<< RECEIPT >>>>",JSON.stringify(receipt));              
             	  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
             }).catch(error=>{                       
                 console.log("<<< ERR, sendsigedTransaction >>>",error);         
             })	                                                                                                                                  
     }).catch(e=>{                        
         console.log("ERR, GasPrice >>>>",e);
     })                    
}

async function getEventData_CoinIn(_fromBlock, _toBlock){ 
	 const myinstance = new web3.eth.Contract(CONTRACT_ADDR_ABI, CONTRACT_ADDR.toString());
	 try{				
		 		await myinstance.getPastEvents('CoinIn',  {
		 				'filter':{'orderID': myorderID},
		 				fromBlock: _fromBlock,       
						toBlock: _toBlock
		    	},function(error,events){		    			
		 				console.log(error);		 				
		 				var eventlen = events.length;
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

async function checkLatestBlock(){
	 //######  UNCOMMENT BELOW LINE FOR 100 BLOCKS  ######//
 	 //var toblock =  await web3.eth.getBlockNumber();
 	 //var fromblock = toblock-100;
 	 
 	 // For testing 	  	  
 	 var toblock = 9668500;
 	 var fromblock = 9666300;
 	 	 
 	 console.log(">>> Getting records >>> for blocks fromblock, toblock >>", fromblock, toblock);
 	 
	 getEventData_CoinIn(fromblock, toblock);
	 getEventData_TokenIn(fromblock, toblock);	                   
}

checkLatestBlock();

async function	db_select(chainid, orderid, sendcoinsTo, amount){	
	var con = mysql.createConnection({
  		host: process.env.DB_HOST.toString(),
  		user: process.env.DB_USER.toString(),
  		password: process.env.DB_PASSWORD.toString(),
  		database: process.env.DB_DATABASE.toString(),
  		connectTimeout: 100000,
  		port:3306
	});
	const query = util.promisify(con.query).bind(con);
	const insertquery = util.promisify(con.query).bind(con);	
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
			con.end();			
	}			
}