const WebSocket = require('ws');
require('dotenv').config();
const Web3 = require("web3");
var Tx = require('ethereumjs-tx').Transaction;

async function getGasAmount(_fromWallet, _toWallet, _amt, company_bridgeinstance){        
    var z = await company_bridgeinstance.methods.returnCoin(_toWallet,_amt).estimateGas({from: _fromWallet});
    return z;
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

async function company_bridge_send_method(_toWallet, _amt){
    let bridgeweb3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/c5147069a6de4315aed6494e1fa53266"));
    web3.eth.handleRevert = typeofrequest                                                                                                           
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
    //https://data-seed-prebsc-1-s1.binance.org:8545/    
    const myinstance = new web3.eth.Contract(JSON.parse(process.env.COMPANY_CONTRACT_ABI), process.env.COMPANY_CONTRACT_ADDR);    

    console.log("HEREERERERE >>>>>>>00");
    /*
    var z = myinstance.events.allEvents()
    .on("connected", function(subscriptionId){
        console.log("connected >>>>>");
        console.log(subscriptionId);
    }).on("data", function(log){
        console.log(log);
    }).on("changed", function(log){
        console.log(">>>>>>");
    });     
    */
    /*
    var subscription = web3.eth.subscribe('Transfer',function(error, result){
        if (!error){
            console.log("REsult >>>>",result);
        }
        console.log("ERoor >>>>",error);
    })
    .on("connected", function(subscriptionId){
        console.log("connected >>>>>");
        console.log(subscriptionId);
    }).on("data", function(log){
        console.log(log);
    }).on("changed", function(log){
        console.log(">>>>>>");
    });      
    console.log("subscription >>>>>>",subscription);
    */
    
    myinstance.events.Approval()
    .on('data', (event)=>{
        console.log(">>>>>>>>");
        console.log(event);   
        var res = event.returnValues;     
        var _transaction_from = res.from;
        var _transaction_to = res.to;
        var _transaction_val = res.value;
        console.log(_transaction_from, _transaction_to, _transaction_val);                      
        /*
        company_bridge_send_method(_transaction_from, _transaction_to, _transaction_val)        
        .then(x=>{})
        .catch(e=>{console.log(e)});                            
        */
    }).on('error', console.error);     
    
    /*
    myinstance.events.Approval({}, function(error, event){ console.log(event); })
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
    */  
}



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

function getEventData(_fromBlock, _toBlock){ // HERE is some random contract i choosen from bscscan
    if(parseInt(process.env.lastBSCLatestBlockNumber) < parseInt(_fromBlock)){
        setTimeout(()=>{        
            checkLatestBlock();
            getEventData(_fromBlock, _toBlock);
        }, 1000);        
        console.log("Paused ... ");
    }else{
        setTimeout(()=>{
            console.log("Get event Data block ...");
            zz = '[{"inputs":[{"internalType":"contract ComptrollerInterface","name":"comptroller_","type":"address"},{"internalType":"contract InterestRateModel","name":"interestRateModel_","type":"address"},{"internalType":"uint256","name":"initialExchangeRateMantissa_","type":"uint256"},{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"},{"internalType":"uint8","name":"decimals_","type":"uint8"},{"internalType":"address payable","name":"admin_","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"cashPrior","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"interestAccumulated","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"borrowIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalBorrows","type":"uint256"}],"name":"AccrueInterest","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"borrower","type":"address"},{"indexed":false,"internalType":"uint256","name":"borrowAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"accountBorrows","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalBorrows","type":"uint256"}],"name":"Borrow","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"error","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"info","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"detail","type":"uint256"}],"name":"Failure","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"liquidator","type":"address"},{"indexed":false,"internalType":"address","name":"borrower","type":"address"},{"indexed":false,"internalType":"uint256","name":"repayAmount","type":"uint256"},{"indexed":false,"internalType":"address","name":"vTokenCollateral","type":"address"},{"indexed":false,"internalType":"uint256","name":"seizeTokens","type":"uint256"}],"name":"LiquidateBorrow","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"minter","type":"address"},{"indexed":false,"internalType":"uint256","name":"mintAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"mintTokens","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"oldAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"NewAdmin","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract ComptrollerInterface","name":"oldComptroller","type":"address"},{"indexed":false,"internalType":"contract ComptrollerInterface","name":"newComptroller","type":"address"}],"name":"NewComptroller","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract InterestRateModel","name":"oldInterestRateModel","type":"address"},{"indexed":false,"internalType":"contract InterestRateModel","name":"newInterestRateModel","type":"address"}],"name":"NewMarketInterestRateModel","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"oldPendingAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newPendingAdmin","type":"address"}],"name":"NewPendingAdmin","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"oldReserveFactorMantissa","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newReserveFactorMantissa","type":"uint256"}],"name":"NewReserveFactor","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"redeemer","type":"address"},{"indexed":false,"internalType":"uint256","name":"redeemAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"redeemTokens","type":"uint256"}],"name":"Redeem","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"payer","type":"address"},{"indexed":false,"internalType":"address","name":"borrower","type":"address"},{"indexed":false,"internalType":"uint256","name":"repayAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"accountBorrows","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalBorrows","type":"uint256"}],"name":"RepayBorrow","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"benefactor","type":"address"},{"indexed":false,"internalType":"uint256","name":"addAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newTotalReserves","type":"uint256"}],"name":"ReservesAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"admin","type":"address"},{"indexed":false,"internalType":"uint256","name":"reduceAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newTotalReserves","type":"uint256"}],"name":"ReservesReduced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Transfer","type":"event"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":false,"inputs":[],"name":"_acceptAdmin","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"reduceAmount","type":"uint256"}],"name":"_reduceReserves","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"contract ComptrollerInterface","name":"newComptroller","type":"address"}],"name":"_setComptroller","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"contract InterestRateModel","name":"newInterestRateModel","type":"address"}],"name":"_setInterestRateModel","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address payable","name":"newPendingAdmin","type":"address"}],"name":"_setPendingAdmin","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"newReserveFactorMantissa","type":"uint256"}],"name":"_setReserveFactor","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"accrualBlockNumber","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"accrueInterest","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"internalType":"address payable","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOfUnderlying","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"borrowAmount","type":"uint256"}],"name":"borrow","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"borrowBalanceCurrent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"borrowBalanceStored","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"borrowIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"borrowRatePerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"comptroller","outputs":[{"internalType":"contract ComptrollerInterface","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"exchangeRateCurrent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"exchangeRateStored","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getAccountSnapshot","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCash","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"contract ComptrollerInterface","name":"comptroller_","type":"address"},{"internalType":"contract InterestRateModel","name":"interestRateModel_","type":"address"},{"internalType":"uint256","name":"initialExchangeRateMantissa_","type":"uint256"},{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"},{"internalType":"uint8","name":"decimals_","type":"uint8"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"interestRateModel","outputs":[{"internalType":"contract InterestRateModel","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isVToken","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"borrower","type":"address"},{"internalType":"contract VToken","name":"vTokenCollateral","type":"address"}],"name":"liquidateBorrow","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"mint","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"pendingAdmin","outputs":[{"internalType":"address payable","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"redeemTokens","type":"uint256"}],"name":"redeem","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"redeemAmount","type":"uint256"}],"name":"redeemUnderlying","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"repayBorrow","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"borrower","type":"address"}],"name":"repayBorrowBehalf","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"reserveFactorMantissa","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"liquidator","type":"address"},{"internalType":"address","name":"borrower","type":"address"},{"internalType":"uint256","name":"seizeTokens","type":"uint256"}],"name":"seize","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"supplyRatePerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalBorrows","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"totalBorrowsCurrent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalReserves","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"src","type":"address"},{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]';
            const myinstance = new web3.eth.Contract(JSON.parse(zz), "0xA07c5b74C9B40447a954e1466938b865b6BBea36");    
            myinstance.getPastEvents('Mint', {
                fromBlock: process.env.mybsclastBlock ? (process.env.mybsclastBlock+10) : _fromBlock,
                toBlock: process.env.mybsclasttoBlock ? (process.env.mybsclasttoBlock+10) : _toBlock
            }, function(error, events){ 
                //console.log(events);
            }).then(function(events){
                console.log("EVENTS >>>>",events)
            });
            process.env.mybsclastBlock = _fromBlock;    
            process.env.mybsclasttoBlock = _toBlock;
            console.log("Last fromBlock checked ..",process.env.mybsclastBlock);
            console.log("Last toBlock checked ..",process.env.mybsclasttoBlock);
            _fromBlock = _fromBlock + 10;
            _toBlock = _toBlock + 10;
            getEventData(_fromBlock, _toBlock++);
        }, 300);
    }
}

async function checkLatestBlock(){
    console.log("Setting variable ...");
    process.env.lastBSCLatestBlockNumber = await web3.eth.getBlockNumber();    
}

checkLatestBlock(); //12322224
getEventData( 12322215,  12322224);


/* This block work
zz = '[{"inputs":[{"internalType":"address","name":"admin","type":"address"},{"internalType":"address","name":"implementation","type":"address"}],"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newAdmin","type":"address"}],"name":"changeAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"implementation","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"}],"name":"upgradeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"stateMutability":"payable","type":"function"},{"stateMutability":"payable","type":"receive"}]';
const myinstance = new web3.eth.Contract(JSON.parse(zz), "0xb8e3bB633F7276cc17735D86154E0ad5ec9928C0");    
myinstance.events.allEvents({}, function(error, event){ console.log(event); })
.on("connected", function(subscriptionId){
    console.log("SubscriptionID ....",subscriptionId);
})
.on('data', function(event){
    console.log("DDDATA ....");
    console.log(event); // same results as the optional callback above
})
.on('changed', function(event){
    // remove event from local database
    console.log("EVENTSSSSSS...",event);
})
.on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
   console.log("errror ...",error);
   console.log("RECEIPT >>>",receipt);
});    
*/






/*
const myinstance = new web3.eth.Contract(JSON.parse(process.env.COMPANY_CONTRACT_ABI), process.env.COMPANY_CONTRACT_ADDR);    

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
*/
//keepalive();