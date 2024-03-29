//https://gitabc.tronexpert.io/api.php

var myAccountAddress,contractInstance;
var network_From = 'eth';
var network_To = 'dith';
var asset_Name = 'eth';
var asset_To = 'dith';
var global = {
	tronUserAddress : '',
	tronUserAddressHex : '',
	loggedIn : false
}
if(window.ethereum){
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile && window.ethereum.isMetaMask==true){
         var myweb3 = new Web3("https://mainnet.infura.io/v3/API_KEY");
     }else{
         var myweb3 = new Web3(window.ethereum);
     }
     
     ethereum.on('accountsChanged', handleAccountsChanged);
     function handleAccountsChanged (accounts) {
       if (accounts.length === 0) {    
         // MetaMask is locked or the user has not connected any accounts
         console.log('Please connect to MetaMask.')
       } else if (accounts[0] !== myAccountAddress) {
           window.location.href = "";
       }
    }
}else{
       // var myweb3 = new Web3( Web3.givenProvider || "https://mainnet.infura.io/v3/API_KEY");
       // const oldProvider = myweb3.currentProvider; // keep a reference to metamask provider
        var myweb3 = new Web3(window.ethereum);
}

async function checkAccount() {
    if (window.ethereum) {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    
            if (accounts == null || accounts.length == 0) {
                console.log("NO ACCOUNT CONNECTED");
            } else {
                if (myAccountAddress != accounts[0]) {
                    myAccountAddress = accounts[0];                    
                }
                const shortAddress = getUserAddress(myAccountAddress);
                $('#connectWallet,#connectWallet1').html(shortAddress);
                $('#connectWallet,#connectWallet1').attr("href", "https://etherscan.io/address/"+myAccountAddress).attr('target','_blank');
                $('#connectWallet1').hide();
                $('#walletAddress').html(myAccountAddress);
            }
    
        
        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (isMobile && window.ethereum.isMetaMask==true){
                     const accounts_ = await window.ethereum.request({ method: 'eth_requestAccounts' });
                     if (accounts_ == null || accounts_.length == 0) {
                        console.log("NO ACCOUNT CONNECTED");
                    } else {
                        if (myAccountAddress != accounts_[0]) {
                            myAccountAddress = accounts_[0];                    
                        }
                        const shortAddress = getUserAddress(myAccountAddress);
                        $('#connectWallet,#connectWallet1').html(shortAddress);
                        $('#connectWallet,#connectWallet1').attr("href", "https://etherscan.io/address/"+myAccountAddress).attr('target','_blank');
                        $('#connectWallet1').hide();
                        $('#walletAddress').html(myAccountAddress);
                    }
        } 
    }
}
setTimeout(checkAccount, 1000);
$('document').ready(async function(){
    setTimeout(getHistory, 3000);
});
async function getHistory(){
    const fetchResponse =  await fetch('https://api.dithereum.io/history?user='+myAccountAddress);
    const edata = await fetchResponse.json();  
    if(edata.result == 'success'){
        $('#historyTable').html('');
        const txData = edata.data;
        txData.forEach(element => {
            //console.log(element);
            var timeStamp = new Date(element.updationTimestamp);
            var month = parseInt(timeStamp.getMonth())+1;
            var nDate = timeStamp.getUTCFullYear()+'/'+ month+'/' +timeStamp.getDate() + ' ' + timeStamp.getHours()+':'+timeStamp.getMinutes()+':'+timeStamp.getSeconds();
            var fromAmount = element.fromAmount;
            var fromChain = element.fromChain;
            const fromCurrency = element.fromCurrency;
            const fromTxnHash = element.fromTxnHash;
            const orderID = element.orderID;
            const status = element.status;
            var toAmount = element.toAmount;
            const toChain = element.toChain;
            const toCurrency = element.toCurrency;
            const toTxnHash = element.toTxnHash;
            var fee = element.txnFee;
            const userWallet = element.userWallet;
            var to_network = "";
            var from_network = "";
            var statusIcon = '';
            if(status == 'Completed'){
                statusIcon = '<th scope="row"><span class="text-success" data-toggle="tooltip" data-placement="top" title="Completed"><i class="fa fa-check-circle" aria-hidden="true"></i></span></th>';
            }
            if(status == 'Pending'){
                statusIcon = '<th scope="row"><span class="text-info" data-toggle="tooltip" data-placement="top" title="Progress"><i class="fa fa-spinner" aria-hidden="true"></i></span></th>';
            }
            if(status == 'Cancel'){
                statusIcon = '<th scope="row"><span class="text-danger" data-toggle="tooltip" data-placement="top" title="Cancel"><i class="fa fa-times" aria-hidden="true"></i></span></th>';
            }
            if(fee==0){
                //fee = '100% Discount';
		         fee = '0.00';
            }else{
                fee = fee + ' 100% Discount';
            }
            var fromLink = '';
            var toLink = '';
            if(fromChain==ETH_TESTNET_CHAINID){
                from_network= "ETH";
                fromLink = ETHERSCAN_URL;
                if(fromCurrency=='ETH'){ fromAmount = fromAmount/decimalArr['ETH'];}  
                if(fromCurrency=='USDT'){ fromAmount = fromAmount/decimalArr[usdtEthAddress];}  
            }
            if(fromChain==CUSTOM_TESTNET_CHAINID){ from_network="DTH"; fromAmount = fromAmount/decimalArr[CUSTOM_TOKEN_SYMBOL]; fromLink = CUSTOM_SCAN_URL; }
            if(fromChain==BSC_TESTNET_CHAINID){ from_network = "BSC"; fromAmount = fromAmount/decimalArr['BSC']; fromLink = BSCSCAN_URL;} 
            if(fromChain==HECO_TESTNET_CHAINID){ from_network = "Huobi"; fromAmount = fromAmount/decimalArr['HT']; fromLink = HECOSCAN_URL;}  
            if(fromChain==POLYGON_MAINNET_CHAINID){ from_network = "Polygon"; fromAmount = fromAmount/decimalArr['MATIC']; fromLink = POLYSCAN_URL;} 

            if(toChain==ETH_TESTNET_CHAINID){  to_network= "ETH"; toAmount= toAmount/decimalArr['ETH']; toLink=ETHERSCAN_URL;}
            if(toChain==CUSTOM_TESTNET_CHAINID){ to_network=CUSTOM_TOKEN_SYMBOL; toAmount= toAmount/decimalArr[CUSTOM_TOKEN_SYMBOL]; toLink=CUSTOM_SCAN_URL; }
            if(toChain==BSC_TESTNET_CHAINID){ to_network = "BSC"; toAmount= toAmount/decimalArr['BSC']; toLink=BSCSCAN_URL;} 
            if(toChain==HECO_TESTNET_CHAINID){ to_network = "Huobi"; toAmount= toAmount/decimalArr['HT']; toLink=HECOSCAN_URL;}  
            if(toChain==POLYGON_MAINNET_CHAINID){ to_network = "Polygon";toAmount= toAmount/decimalArr['MATIC']; toLink=POLYSCAN_URL;} 

            $('#historyTable').append('<tr> '+ statusIcon+
                                      '<td> <div>  <div class="coin-price">  '+fromAmount+' '+ fromCurrency + '   </div>  <div class="address"><a href="'+fromLink+fromTxnHash+'" target="_blank">'+getUserAddress(fromTxnHash)+'</a> ('+from_network+')</span></div>   </div> </td>'+
                                      '<td> <div>  <div class="coin-price">  '+toAmount+' '+ toCurrency + '  </div>  <div class="address"><a href="'+toLink+toTxnHash+'" target="_blank">'+getUserAddress(toTxnHash)+'</a> ('+to_network+')</span></div>   </div> </td>'+
                                      '<td> <div>  <div class="coin-price">  '+fee +' </div> </div> </td>'+
                                      '<td> <div>  <div class="address">'+nDate+'</div> </div> </td> </tr>');
        });
    }else{
        $('#historyTable').html('<tr><td colspan="5">No Records Found.</td></tr>');
    }
}
//get short user address
function getUserAddress(userAddress){
    if(userAddress==""){ return '';}
    firstFive   = userAddress.substring(0 , 5); 
    lastFive    = userAddress.substr(userAddress.length - 5);
    return firstFive+'...'+lastFive;
}
function number_to_2decimals(str)
{
    str = str.toString();
    const decimalPointIndex = str.indexOf(".");
    if (decimalPointIndex === -1) return str + ".00";
    return (str+"00").substr(0, decimalPointIndex+3);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
