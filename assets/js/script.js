var myAccountAddress,contractInstance;
// const ABI = JSON.parse('');
// const contractAddress = '';
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
                }
            
        }
        
        
    }
    
}
setTimeout(checkAccount, 500);

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

//connect to metamask wallet 
$("#connectWallet,#connectWallet1").click(async function(e){
    e.preventDefault();
    var accounts_;
    if(window.ethereum){
        window.ethereum.enable();
        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile && window.ethereum.isMetaMask==true){
                accounts_ = await window.ethereum.request({ method: 'eth_requestAccounts' });
                //alert(accounts_);
            
        }else{
            accounts_ = await ethereum.request({ method: 'eth_accounts' });
              console.log(accounts_);
        }
        //const accounts_ = await ethereum.request({ method: 'eth_accounts' });
        if(accounts_!=""){
            window.location.href = "";
        }
    }
});
//token select 
$('#tokenList li').click(function(){
    var name = $(this).data('name');
    var dName = "Ethereum Network";
    console.log(name);
    if(name=="eth"){
        $('#ethCheck').show();
        $('#trxCheck').hide();
        $('#solCheck').hide();
        $('#bnbCheck').hide();
        $('#maticCheck').hide();
        $('#hecoCheck').hide();
        dName = "Ethereum Network";
        $('#netwrokFromUL').html('<img class="icons" src="assets/img/eth-icon.svg"> ETH');
    }
    if(name=="bnb"){
        $('#bnbCheck').show();
        $('#ethCheck').hide();
        $('#trxCheck').hide();
        $('#solCheck').hide();
        $('#maticCheck').hide();
        $('#hecoCheck').hide();
        dName = "Binance Network";
        $('#netwrokFromUL').html('<img class="icons" src="assets/img/bnb-logo.png"> BNB');
    }
    if(name=="trx"){
        $('#trxCheck').show();
        $('#ethCheck').hide();
        $('#solCheck').hide();
        $('#bnbCheck').hide();
        $('#maticCheck').hide();
        $('#hecoCheck').hide();
        dName = "TRX Network";
        $('#netwrokFromUL').html('<img class="icons" src="assets/img/tron-logo.png"> TRX');
    }
    if(name=="matic"){
        $('#maticCheck').show();
        $('#bnbCheck').hide();
        $('#ethCheck').hide();
        $('#trxCheck').hide();
        $('#solCheck').hide();
        $('#hecoCheck').hide();
        dName = "Polygon Network";
        $('#netwrokFromUL').html('<img class="icons" src="assets/img/tether-usdt-logo.png"> MATIC');
    }
    if(name=="ht"){
        $('#hecoCheck').show();
        $('#maticCheck').hide();
        $('#bnbCheck').hide();
        $('#ethCheck').hide();
        $('#trxCheck').hide();
        $('#solCheck').hide();
        dName = "Heco Network";
        $('#netwrokFromUL').html('<img class="icons" src="assets/img/heco-logo.png"> HT');
    }
    if(name=="usdt"){
        $('#netwrokFromUL').html('<img class="icons" src="assets/img/tether-usdt-logo.png"> USDT');
    }
    if(name=="usdc"){
        $('#netwrokFromUL').html('<img class="icons" src="assets/img/usdc-logo.png"> USDC');
    }
    if(name=="busd"){
        $('#netwrokFromUL').html('<img class="icons" src="assets/img/busd-logo.png"> BUSD');
    }
    if(name=="dai"){
        $('#netwrokFromUL').html('<img class="icons" src="assets/img/dai-logo.png"> DAI');
    }
    if(name=="pax"){
        $('#netwrokFromUL').html('<img class="icons" src="assets/img/pax-logo.png"> PAX');
    }

    $('#netwrokFrom').text(dName);
});

//network From select
$(document).on('click', '#netwrokFromUL li', function () {
    var name = $(this).data('name');
    if(name=='ethNetwork'){
        name = 'Ethereum Network';
        $('#ethCheck').show();
        $('#trxCheck').hide();
        $('#solCheck').hide();
        $('#bnbCheck').hide();
        $('#maticCheck').hide();
        $('#hecoCheck').hide();
        addNetowrk('ETH');
    }
    if(name=='trxNetwork'){
        name = 'TRX Network';
        $('#trxCheck').show();
        $('#ethCheck').hide();
        $('#solCheck').hide();
        $('#bnbCheck').hide();
        $('#maticCheck').hide();
        $('#hecoCheck').hide();
        $('#trxCheckTo').attr("disabled","disabled");
        addNetowrk('TRX');
    }
    if(name=='solNetwork'){
        name = 'SOL Network';
        $('#solCheck').show();
        $('#ethCheck').hide();
        $('#trxCheck').hide();
        $('#bnbCheck').hide();
        $('#maticCheck').hide();
        $('#hecoCheck').hide();
        //addNetowrk('SOL');
    }
    if(name=='bnbNetwork'){
        name = 'Binance Network';
        $('#bnbCheck').show();
        $('#ethCheck').hide();
        $('#trxCheck').hide();
        $('#solCheck').hide();
        $('#maticCheck').hide();
        $('#hecoCheck').hide();
        addNetowrk('BNB');
    }
    if(name=='maticNetwork'){
        name = 'Polygon Network';
        $('#maticCheck').show();
        $('#bnbCheck').hide();
        $('#ethCheck').hide();
        $('#trxCheck').hide();
        $('#solCheck').hide();
        $('#hecoCheck').hide();
        addNetowrk('POLYGON');
    }
    if(name=='hecoNetwork'){
        name = 'Heco Network';
        $('#hecoCheck').show();
        $('#maticCheck').hide();
        $('#bnbCheck').hide();
        $('#ethCheck').hide();
        $('#trxCheck').hide();
        $('#solCheck').hide();
        addNetowrk('HECO');
    }

    $('#netwrokFrom').text(name);
})

//network To select
$(document).on('click', '#netwrokToUL li', function () {
    var name = $(this).data('name');
    if(name=='ethNetworkTo'){
        name = 'Ethereum Network';
        $('#ethCheckTo').show();
        $('#dithCheckTo').hide();
        $('#trxCheckTo').hide();
        $('#solCheckTo').hide();
        $('#bnbCheckTo').hide();
        $('#maticCheckTo').hide();
    }
    if(name=='dithNetworkTo'){
        name = 'Dithereum Network';
        $('#dithCheckTo').show();
        $('#trxCheckTo').hide();
        $('#solCheckTo').hide();
        $('#bnbCheckTo').hide();
        $('#ethCheckTo').hide();
        $('#maticCheckTo').hide();
    }
    if(name=='trxNetworkTo'){
        name = 'TRX Network';
        $('#trxCheckTo').show();
        $('#dithCheckTo').hide();
        $('#solCheckTo').hide();
        $('#bnbCheckTo').hide();
        $('#ethCheckTo').hide();
        $('#maticCheckTo').hide();
    }
    if(name=='solNetworkTo'){
        name = 'SOL Network';
        $('#solCheckTo').show();
        $('#dithCheckTo').hide();
        $('#trxCheckTo').hide();
        $('#bnbCheckTo').hide();
        $('#ethCheckTo').hide();
        $('#maticCheckTo').hide();
    }
    if(name=='bnbNetworkTo'){
        name = 'Binance Network';
        $('#bnbCheckTo').show();
        $('#dithCheckTo').hide();
        $('#trxCheckTo').hide();
        $('#solCheckTo').hide();
        $('#ethCheckTo').hide();
        $('#maticCheckTo').hide();
    }
    if(name=='maticNetworkTo'){
        name = 'Polygon Network';
        $('#maticCheckTo').show();
        $('#bnbCheckTo').hide();
        $('#dithCheckTo').hide();
        $('#trxCheckTo').hide();
        $('#solCheckTo').hide();
        $('#ethCheckTo').hide();
    }

    $('#netwrokTo').text(name);
})

//add networks Dithereum
function addNetowrk(network){
    //Ethereum Network
    if(network=='ETH'){
        if(window.ethereum) {
            window.web3 = new  Web3(window.ethereum)
            window.ethereum.request({method: 'eth_requestAccounts'})
            window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{ //chainId: '0x1',
                    chainName: "Ethereum Mainnet",
                    nativeCurrency: {
                    name: "Ethereum",
                    symbol: "ETH",
                    decimals: 18
                    },
                    rpcUrls: ['https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],     blockExplorerUrls: ['https://etherscan.io/']
                }]
            })
        }
    }
    //TRX Network
    if(network=='TRX'){
        if (window.tronWeb && window.tronWeb.ready){
            
        }else{
            swal('Please Login to Tronlink');
        }
    }
    //SOL Network
    if(network=='SOL'){
        if(window.ethereum) {
            window.web3 = new  Web3(window.ethereum)
            window.ethereum.request({method: 'eth_requestAccounts'})
            window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{chainId: '0xa869',
                    chainName: "SOLANA Network",
                    nativeCurrency: {
                    name: "Solana",
                    symbol: "SOL",
                    decimals: 18
                    },
                    rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],     blockExplorerUrls: ['https://cchain.explorer.avax-test.network/']
                }]
            })
        }
    }
    //BNB Network
    if(network=='BNB'){
        if(window.ethereum) {
            window.web3 = new  Web3(window.ethereum)
            window.ethereum.request({method: 'eth_requestAccounts'})
            window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{chainId: '0x38',
                    chainName: "BSC Mainnet",
                    nativeCurrency: {
                    name: "Binance Chain",
                    symbol: "BNB",
                    decimals: 18
                    },
                    rpcUrls: ['https://bsc-dataseed1.defibit.io/'],     blockExplorerUrls: ['https://bscscan.com/']
                }]
            })
        }
    }
    //Polygon Network
    if(network=='POLYGON'){
        if(window.ethereum) {
            window.web3 = new  Web3(window.ethereum)
            window.ethereum.request({method: 'eth_requestAccounts'})
            window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{chainId: '0x89',
                    chainName: "Polygon Network",
                    nativeCurrency: {
                    name: "Polygon",
                    symbol: "MATIC",
                    decimals: 18
                    },
                    rpcUrls: ['https://polygon-rpc.com'],     blockExplorerUrls: ['https://polygonscan.com/']
                }]
            })
        }
    }
    //Heco Network
    if(network=='HECO'){
        if(window.ethereum) {
            window.web3 = new  Web3(window.ethereum)
            window.ethereum.request({method: 'eth_requestAccounts'})
            window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{chainId: '0x80',
                    chainName: "Heco-Mainnet",
                    nativeCurrency: {
                    name: "Heco",
                    symbol: "HT",
                    decimals: 18
                    },
                    rpcUrls: ['https://http-mainnet-node.huobichain.com'],     blockExplorerUrls: ['https://hecoinfo.com']
                }]
            })
        }
    }

}