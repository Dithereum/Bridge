/*
/// REQUIREMENT 
Script 2:
=> this will run every 10 minutes and fetch all the positive value wallets with their amounts.. 
=> Make an array of addresses and amounts and send to smart contract.. 
=> array length must not exceeds smart contracts limit.. If array is lengthy, then.. 
It will take specidied entries only.. 
Please check in the contract that, how much maximum array length is allowed in contract. 
=> then make zero value of all those records..
*/

var mysql = require('mysql');
const WebSocket = require('ws');
require('dotenv').config();
const Web3 = require("web3");
var Tx = require('ethereumjs-tx').Transaction;
var EXCLUDE_THESE = ['Transfer']
const util = require('util');
var cron = require('node-cron');
var MY_INFURA_URL = "https://ropsten.infura.io/v3/c5147069a6de4315aed6494e1fa53266";
var CHAIN = {'chain':'ropsten'}


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
let web31 = new Web3(getwsprovider());
let web32 = new Web3(getwsprovider());
let web33 = new Web3(getwsprovider());
let web34 = new Web3(getwsprovider());

var lastBlockNumber = 0;
// script1 last block number fetched

async function	db_select_deployer_commission(){	
	var con = mysql.createConnection({
  		host: process.env.DB_HOST.toString(),
  		user: process.env.DB_USER.toString(),
  		password: process.env.DB_PASSWORD.toString(),
  		database: process.env.DB_DATABASE.toString()
	});
	const query = util.promisify(con.query).bind(con);	
	try{
			return await query("SELECT total_deployer_commission, deployer_addr FROM COMMISSION_VIEW limit 0,5");					
		}finally{
			con.end();			
	}			
}

async function	db_select_referrer_commission(){	
	var con = mysql.createConnection({
  		host: process.env.DB_HOST.toString(),
  		user: process.env.DB_USER.toString(),
  		password: process.env.DB_PASSWORD.toString(),
  		database: process.env.DB_DATABASE.toString()
	});
	const query = util.promisify(con.query).bind(con);	
	try{
			return await query("SELECT total_referrer_commission, referrer_addr FROM COMMISSION_VIEW limit 0,5");					
		}finally{
			con.end();			
	}			
}

db_select_deployer_commission().then((z)=>{
	var _deployerary = [];
	var _commissionary = [];
	z.forEach((zz)=>{	
		_deployerary.push(zz.deployer_addr);
		_commissionary.push(zz.total_deployer_commission * 1000000000000000000);
		//console.log("ZZZZZZ>>>>",zz.total_deployer_commission);
		//console.log("ZZZZZZ>>>>",zz.deployer_addr);
	});
	if(_deployerary.length > 0){
		company_bridge_send_method(_deployerary, _commissionary);
	}
})

async function company_bridge_send_method(_deployersary, _commissionary){      
    let bridgeweb3 = new Web3(new Web3.providers.HttpProvider(MY_INFURA_URL));
    web3.eth.handleRevert = true;                                
    const company_bridgeinstance = new bridgeweb3.eth.Contract(JSON.parse(process.env.ROPSTEN_COMPANY_BRIDGE_ABI), process.env.ROPSTEN_COMPANY_BRIDGE_ADDR);
    /// NOTE ----
    // HERE I took First Ary Element using [0] index as sample call, Note -Change it to ary     
    var mydata = company_bridgeinstance.methods.returnCoin(_deployersary[0],_commissionary[0]).encodeABI();    
    var requiredGas = await company_bridgeinstance.methods.returnCoin(_deployersary[0],_commissionary[0]).estimateGas({from: process.env.BRIDGE_ADMIN_WALLET});    
    //console.log("MYDATA >>>>",mydata);       
    //console.log(">>>>> REQUIRED GAS <<<<<",requiredGas);           
        bridgeweb3.eth.getTransactionCount(process.env.BRIDGE_ADMIN_WALLET,"pending").then((mynonce)=>{                            
            (async function(){                       
                    bridgeweb3.eth.getGasPrice().then(gasPrice=>{                                                                 
                            const myrawTx = {   
                                nonce: web3.utils.toHex(mynonce),                    
                                gasPrice: web3.utils.toHex(gasPrice),
                                gasLimit: requiredGas,
                                to: process.env.BRIDGE_ADMIN_WALLET.toString(),                        
                                value: 0x0, 
                                data: mydata                  
                            };                              
                            //console.log("MY RAW TX >>>>>>",myrawTx);                                            
                            var tx = new Tx(myrawTx, CHAIN);
                            var privateKey = Buffer.from(process.env.BRIDGE_CONTRACT_OWNER_PK.toString(), 'hex');
                            tx.sign(privateKey);                        
                            var serializedTx = tx.serialize(); 
                                                                    
                            bridgeweb3.eth.sendSignedTransaction('0x'+serializedTx.toString('hex'))
                            .then((receipt)=>{
                                console.log(JSON.stringify(receipt));                                
                            })
                            .catch(error=>{                       
                                console.log(error);              
                            })                                                                                                                      
                    }).catch(e=>{                        
                        console.log(e);
                    })                    
            })().catch(e=>{                
                console.log(e);
            })             
        }).catch((e)=>{                        
            console.log(e);
        });             
}


/*
db_select_referrer_commission().then((z)=>{
	console.log("ZZZZZZ>>>>",z);
})
*/

cron.schedule('0,10,20,30,40,50 * * * *', () => {
   console.log('Running a task every 10 minute');
  	db_select_deployer_commission().then((z)=>{
		console.log("ZZZZZZ>>>>",z);
	});
});
