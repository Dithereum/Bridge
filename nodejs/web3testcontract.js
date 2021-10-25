require('dotenv').config();
const Web3 = require("web3");
var Tx = require('ethereumjs-tx').Transaction;

async function getGasAmount(_fromWallet, _toWallet, _amt, company_bridgeinstance){        
    var z = await company_bridgeinstance.methods.returnCoin(_toWallet,_amt).estimateGas({from: _fromWallet});
    return z;
}

async function company_bridge_send_method(_fromWallet, _toWallet, _amt){
    let bridgeweb3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/c5147069a6de4315aed6494e1fa53266"));
    const company_bridgeinstance = new bridgeweb3.eth.Contract(JSON.parse(process.env.COMPANY_BRIDGE_ABI), process.env.COMPANY_BRIDGE_ADDR);    
    var mydata = company_bridgeinstance.methods.returnCoin(_toWallet,_amt).encodeABI();    
    var requiredGas = await company_bridgeinstance.methods.returnCoin(_toWallet,_amt).estimateGas({from: _fromWallet});    
    //console.log("MYDATA >>>>",mydata);       
    //console.log(">>>>> REQUIRED GAS <<<<<",requiredGas);
    try{        
        bridgeweb3.eth.getTransactionCount(_fromWallet,"pending").then((mynonce)=>{    
            (async function(){                
                bridgeweb3.eth.getGasPrice().then(gasPrice=>{                                         
                    const myrawTx = {   
                        nonce: web3.utils.toHex(mynonce),                    
                        gasPrice: web3.utils.toHex(gasPrice),
                        gasLimit: requiredGas,
                        to: _toWallet,
                        from: _fromWallet,
                        value: 0x0, 
                        data: mydata                  
                    };  
                    //console.log("MY RAW TX >>>>>>",myrawTx);                                            
                    try{      
                        var tx = new Tx(myrawTx);
                        var privateKey = Buffer.from(process.env.BRIDGE_CONTRACT_OWNER_PK.toString(), 'hex');
                        tx.sign(privateKey);                        
                        var serializedTx = tx.serialize();
                        bridgeweb3.eth.sendSignedTransaction('0x'+serializedTx.toString('hex'))
                        .on('transactionHash',function(mytxhash){
                            console.log("Bridge tx hash >>>",mytxhash);
                        })                        
                        .on('error', myerror =>{
                            console.log("bridge web3 error >>>", myerror);
                        })
                        .on('receipt', receipt =>{
                            console.log("Receipt  >>>",receipt);
                        })                        
                    }catch(e){
                        console.log({"ERROR":e})                                            
                    }               
                });                 
            })();    
        });        
    }catch(e){
        console.log("<<<< Error >>>>>",e);
    }
}


var myevents = () =>{              
    const myinstance = new web3.eth.Contract(JSON.parse(process.env.COMPANY_CONTRACT_ABI), process.env.COMPANY_CONTRACT_ADDR);

    myinstance.events.Transfer().on('data', (event)=>{
        console.log(">>>>>>>>");
        console.log(event);   
        var res = event.returnValues;     
        var _transaction_from = res.from;
        var _transaction_to = res.to;
        var _transaction_val = res.value;
        console.log(_transaction_from, _transaction_to, _transaction_val);
        company_bridge_send_method(_transaction_from, _transaction_to, _transaction_val)
    }).on('error', console.error);
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

myevents();