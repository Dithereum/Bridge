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
         const oldProvider = web3.currentProvider; // keep a reference to metamask provider
         var myweb3 = new Web3(oldProvider);
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
        var myweb3 = new Web3( Web3.givenProvider || "https://mainnet.infura.io/v3/API_KEY");
        const oldProvider = myweb3.currentProvider; // keep a reference to metamask provider
        var myweb3 = new Web3(oldProvider);
}

async function checkAccount() {
    if (window.ethereum) {
        myweb3.eth.getAccounts((err, accounts) => {
    
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
        });
        
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
setTimeout(checkAccount, 500);
$('document').ready(async function(){
    setTimeout(getHistory, 1000);
});
async function getHistory(){
    console.log(myAccountAddress);
    //const fetchResponse =  await fetch('https://gitabc.tronexpert.io/api.php');
    const fetchResponse =  await fetch('https://api.dithereum.org/bridge?user='+myAccountAddress);
    const edata = await fetchResponse.json();  
    console.log(edata); 
    if(edata.result == "success"){
        const txData = edata.data;
        txData.forEach(element => {
            console.log(element);
            var from_network ='';
            var to_network = '';
            const status = element.status;
            const fromAmount = element.fromAmount;
            const toAmount = element.toAmount;
            const fromTxnHash = element.fromTxnHash;
            const toTxnHash = element.toTxnHash;
            var userWallet = element.userWallet;
            const orderid = element.orderID;
            const fromChain = element.fromChain;
            const toChain = element.toChain;
            const fromCurrency = element.fromCurrency;
            const toCurrency = element.toCurrency;
            var fee = element.txnFee;
            console.log(fromChain);
            if(fromChain==100){ from_network = 'ETH'; }
            if(fromChain==24){ from_network = 'DTH'; }
            if(fromChain==97){ from_network = 'BSC'; }
            if(fromChain==137){ from_network = 'POLYGON'; }
            if(fromChain==256){ from_network = 'HECO'; }

            if(toChain==1){ to_network = 'ETH'; }
            if(toChain==24){ to_network = 'DTH'; }
            if(toChain==97){ to_network = 'BSC'; }
            if(toChain==137){ to_network = 'POLYGON'; }
            if(toChain==256){ to_network = 'HECO'; }

             console.log(from_network);

            var statusIcon = '';
            if(status == 'completed'){
                statusIcon = '<th scope="row"><span class="text-success" data-toggle="tooltip" data-placement="top" title="Completed"><i class="fa fa-check-circle" aria-hidden="true"></i></span></th>';
            }
            if(status == 'Pending'){
                statusIcon = '<th scope="row"><span class="text-info" data-toggle="tooltip" data-placement="top" title="Progress"><i class="fa fa-spinner" aria-hidden="true"></i></span></th>';
            }
            if(status == 'cancel'){
                statusIcon = '<th scope="row"><span class="text-danger" data-toggle="tooltip" data-placement="top" title="Cancel"><i class="fa fa-times" aria-hidden="true"></i></span></th>';
            }
            if(fee==0){
                fee = fee + ' 100% Discount';
            }else{
                fee = fee/1e18;
                fee = fee.toFixed(4);
            }
           
            $('#historyTable').append('<tr> '+ statusIcon+
                                        '<td> <div>  <div class="coin-price">  '+fromAmount+' '+fromCurrency+'  </div>  <div class="address"><a target="_blank" href="https://explorer.dithereum.org/transaction.html?tx='+fromTxnHash+'">'+getUserAddress(fromTxnHash)+
                                        '</a>('+from_network+')'+'</span></div>   </div> </td>'+
                                        '<td> <div>  <div class="coin-price">  '+toAmount+'  </div>  <div class="address"><a target="_blank" href="https://explorer.dithereum.org/transaction.html?tx='+toTxnHash+'">'+getUserAddress(toTxnHash)+
                                        '</a>('+to_network+')'+'</span></div>   </div> </td>'+
                                        '<td> <div>  <div class="coin-price">  '+fee +' </div> </div> </td>'+
                                        '<td> <div>  <div class="address">'+orderid+'</div> </div> </td> </tr>');
        });
    }
}
//get short user address
function getUserAddress(userAddress){
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