const WebSocket = require('ws');
require('dotenv').config();
const Web3 = require("web3");
var Tx = require('ethereumjs-tx').Transaction;

async function getGasAmount(_fromWallet, _toWallet, _amt, company_bridgeinstance){        
    var z = await company_bridgeinstance.methods.returnCoin(_toWallet,_amt).estimateGas({from: _fromWallet});
    return z;
}

async function company_bridge_send_method(_toWallet, _amt){
    let bridgeweb3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/c5147069a6de4315aed6494e1fa53266"));
    web3.eth.handleRevert = true
    const company_bridgeinstance = new bridgeweb3.eth.Contract(JSON.parse(process.env.COMPANY_BRIDGE_ABI), process.env.COMPANY_BRIDGE_ADDR);    
    var mydata = company_bridgeinstance.methods.returnCoin(_toWallet,_amt).encodeABI();    
    var requiredGas = await company_bridgeinstance.methods.returnCoin(_toWallet,_amt).estimateGas({from: process.env.BRIDGE_ADMIN_WALLET});    
    //console.log("MYDATA >>>>",mydata);       
    //console.log(">>>>> REQUIRED GAS <<<<<",requiredGas);       
        bridgeweb3.eth.getTransactionCount(process.env.BRIDGE_ADMIN_WALLET,"pending").then((mynonce)=>{                            
            (async function(){                       
                    bridgeweb3.eth.getGasPrice().then(gasPrice=>{                                                                 
                            const myrawTx = {   
                                nonce: web3.utils.toHex(mynonce),                    
                                gasPrice: web3.utils.toHex(gasPrice),
                                gasLimit: requiredGas,
                                to: _toWallet,                        
                                value: 0x0, 
                                data: mydata                  
                            };                              
                            //console.log("MY RAW TX >>>>>>",myrawTx);                                            
                            var tx = new Tx(myrawTx, {'chain':'ropsten'});
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

var myevents = () =>{     
    const myinstance = new web3.eth.Contract(JSON.parse(process.env.COMPANY_CONTRACT_ABI), process.env.COMPANY_CONTRACT_ADDR);
    
    /*
    myinstance.events.Transfer().on('data', (event)=>{
        console.log(">>>>>>>>");
        console.log(event);   
        var res = event.returnValues;     
        var _transaction_from = res.from;
        var _transaction_to = res.to;
        var _transaction_val = res.value;
        console.log(_transaction_from, _transaction_to, _transaction_val);
        company_bridge_send_method(_transaction_from, _transaction_to, _transaction_val)        
        .then(x=>{})
        .catch(e=>{console.log(e)});        
    }).on('error', console.error);
    */
    myinstance.events.Transfer({}, function(error, event){ console.log(event); })
    .on("connected", function(subscriptionId){
        console.log(subscriptionId);
    })
    .on('data', function(event){
        console.log(event); // same results as the optional callback above
    })
    .on('changed', function(event){
        // remove event from local database
    })
    .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
        console.log("Errrrrr", error)
    });
}

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
    var _url = "wss://dex.binance.org/api/ws/bnb17zw3mqjx64x4dxtwqjqz5tssql6qp2m0cgv06x";
    //const wsprovider = new Web3.providers.WebsocketProvider(process.env.COMPANY_CONTRACT_URL, options);
    const wsprovider = new Web3.providers.WebsocketProvider(_url, options);

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

//let web3 = new Web3(getwsprovider());
//myevents();


const conn = new WebSocket("wss://testnet-dex.binance.org/api/ws");
//console.log(">>>>> Contract Addr >>>>",conn);

var keepalive = ()=>{
    conn.onopen = function(evt) {
        //console.log("EVENT >>>>",evt);
        evt.isAlive = true;        
        conn.send(JSON.stringify({ method: "subscribe", topic: "Transfer", address: 0x3093a9468dbbf1a04ab3e624b77ce09393fabdcf }));    
    }
    conn.onmessage = function(evt) {
        console.info('received data', evt.data);
    }
    conn.onerror = function(evt) {
        console.error('an error occurred', evt);
    }
    conn.onclose = function(evt){
        console.log("closing ...")
    }    
}

keepalive();