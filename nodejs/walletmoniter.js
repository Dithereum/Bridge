/*
CREATE VIEW 
	AdminWalletsView  
	AS SELECT  `autoid`, `walletid`, `walletpk`, `chainid`, `networkid` FROM AdminWallets WHERE isFrozen==0
	
// For only_full_group_by error	
	set global sql_mode='STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
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

ADMIN_WALLET_ARY='0x6077516eea959B7fb04bB211AD0569351f3eBDbc';
ADMIN_WALLET_ARY_PK='8342678b959589fb5ad3cc593b410d892c8cb243363b2a30ee817070a89e8e8b';

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


/// This will remove/unfreeze maximum two wallets if present in noncetable and freezed/locked 
db_select_frozenWallets().then((frozenWallets)=>{		
		   console.log("Frozen Wallet Length >>>>",frozenWallets.length);      
			if(frozenWallets.length > 0){					
				// for - frozenWallets[0]
				checkif_allnonce_transactions_confirmed_then_remove_from_nonce_table(frozenWallets[0]).then((transcount)=>{
					console.log(">>>>> Transaction Count >>>>>",transcount, frozenWallets[0]);
					console.log(">>>>>>> frozenWallets[0].chainid, frozenWallets[0].walletid >>>>>", frozenWallets[0].chainid, frozenWallets[0].walletid);
					var data = db_select_noncetable(frozenWallets[0].chainid, frozenWallets[0].walletid).catch(console.log);
					data.then((w)=>{ 
						if(w.length > 0){
							if(parseInt(w[0].maxnonce) <= parseInt(transcount)){
								console.log(">>>>> Removing from noncetable and unfreezing for >>> w[0].walletid, w[0].chainid, w[0].networkid, w[0].maxnonce >>>", w[0].walletid, w[0].chainid, w[0].networkid, w[0].maxnonce);
								remove_from_noncetable_and_ufreeze(w[0].walletid, w[0].chainid, w[0].networkid, w[0].maxnonce);
							}
						} 
					});										
				});
				
				// for - frozenWallets[1]				
				if(frozenWallets[1]){
					checkif_allnonce_transactions_confirmed_then_remove_from_nonce_table(frozenWallets[1]).then((transcount1)=>{
						console.log(">><< Transaction Count1 >><<",transcount1, frozenWallets[1]);
						console.log(">><< frozenWallets[0].chainid, frozenWallets[0].walletid >><<", frozenWallets[1].chainid, frozenWallets[1].walletid);
						var mydata = db_select_noncetable(frozenWallets[1].chainid, frozenWallets[1].walletid).catch(console.log);
						mydata.then((wx)=>{ 
							if(wx.length > 0){
								if(parseInt(wx[0].maxnonce) <= parseInt(transcount1)){
									console.log(">>>>> Removing from noncetable and unfreezing for >>> wx[0].walletid, wx[0].chainid, wx[0].networkid, wx[0].maxnonce >>>", wx[0].walletid, wx[0].chainid, wx[0].networkid, wx[0].maxnonce);
									remove_from_noncetable_and_ufreeze(wx[0].walletid, wx[0].chainid, wx[0].networkid, wx[0].maxnonce);
								}
							} 
						});										
					});
				}
			}
}).catch(console.log);


async function	db_select_frozenWallets(){
	var con = mysql.createConnection({
  		host: "localhost",
  		user: "root",
  		password: "Admin@1234",
  		database: "dithereumbacked",
  		connectTimeout: 100000,
  		port:3306
	});
	const query = util.promisify(con.query).bind(con);	
	try{	
			var select_query = "SELECT walletid, walletpk, chainid, networkid from AdminWallets where isFrozen=1";						
			var wallets = await query(select_query);	
			
			//console.log(">>>>> wallets >>>>", wallets);
			return wallets;
	}catch(e){
			console.log("ERROR SQL>>Catch",e);
	}finally{
			con.end();			
	}
}


async function checkif_allnonce_transactions_confirmed_then_remove_from_nonce_table(mywallet){		
		console.log(">>>>>> mywallet.walletid, mywallet.chainid, mywallet.networkid >>>>", mywallet.walletid, mywallet.chainid, mywallet.networkid);		
		//console.log(">>>>>> mywallet.chainid >>>>", mywallet.chainid);
		//console.log(">>>>>> mywallet.networkid >>>>", mywallet.networkid);
		return await web3.eth.getTransactionCount(mywallet.walletid).catch(console.log);
}

// Unfreeze wallet and remove from noncetable  
async function remove_from_noncetable_and_ufreeze(_walletid, _chainid, _networkid, _maxnonce){
	console.log(">>>> In REMOVE function >>>>,_walletid, _chainid, _networkid, _maxnonce  >>>>",_walletid, _chainid, _networkid, _maxnonce);
	var con3 = mysql.createConnection({
  		host: "localhost",
  		user: "root",
  		password: "Admin@1234",
  		database: "dithereumbacked",
  		connectTimeout: 100000,
  		port:3306
	});
	const query3 = util.promisify(con3.query).bind(con3);
	const query4 = util.promisify(con3.query).bind(con3);	
	try{
			var update_query = "UPDATE AdminWallets SET isFrozen=0 where walletid='"+_walletid+"' AND chainid="+_chainid;
			console.log(">>>> Update Query >>>>", update_query);			
			await query3(update_query).catch(console.log);	
			
			var delete_query = "Delete from noncetable where walletid='"+_walletid+"' AND chainid="+_chainid;
			console.log(">>>> Delete Query >>>>", delete_query);			
			await query4(delete_query).catch(console.log)		
	}catch(e){
			console.log("ERROR SQL>>Catch",e);
	}finally{
			con3.end();			
	}	
}

var getwsprovider = () =>{     
	 var httpprovider = new Web3(new Web3.providers.HttpProvider(INFURA_PROVIDER, options));     
    return httpprovider
}

let web3 = new Web3(getwsprovider());

//db_select_all_networks();
/*
[
  RowDataPacket {
    autoid: 1,
    networkid: 'rinkeby',
    web3providerurl: 'https://rinkeby.infura.io/v3/8102c6c81e12418588c89d69ac7a3f04',
    chainid: 4
  },
  RowDataPacket {
    autoid: 2,
    networkid: 'google',
    web3providerurl: 'http://google.com',
    chainid: 989
  }
]
*/

async function	db_select_all_networks(){	
	var con = mysql.createConnection({
  		host: "localhost",
  		user: "root",
  		password: "Admin@1234",
  		database: "dithereumbacked",
  		connectTimeout: 100000,
  		port:3306
	});
	const query = util.promisify(con.query).bind(con);	
	try{
			var select_query = "SELECT * FROM web3networks";			
			var networks = await query(select_query);			
			//console.log("<<<< Networks >>>> ",networks);
			var providernetworks = []; 
			networks.forEach((row)=>{			
				providernetworks[row.chainid] = {"network": row.networkid, "web3url": row.web3providerurl};  
			});
			console.log(providernetworks);
			return providernetworks;
	}catch(e){
			console.log("ERROR SQL>>Catch",e);
	}finally{
			con.end();			
	}			
}


async function	db_select_noncetable(chainid, walletid){	
	var con2 = mysql.createConnection({
  		host: "localhost",
  		user: "root",
  		password: "Admin@1234",
  		database: "dithereumbacked",
  		connectTimeout: 100000,
  		port:3306
	});
	const query2 = util.promisify(con2.query).bind(con2);	
	try{
			var select_query2 = "SELECT MAX(nonce) as maxnonce, chainid, networkid, walletid FROM noncetable where chainid="+chainid+" AND walletid='"+walletid+"'";			
			//console.log(">>>>>> @@@@ >>>>> SELECT _QUERY >>>> ", select_query2);			
			var nonces = await query2(select_query2).catch(console.log);			
			//console.log(" >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",nonces);
			return nonces;
	}catch(e){
			console.log("ERROR SQL>>Catch",e);
	}finally{
			con2.end();			
	}			
}