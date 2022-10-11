var myAccountAddress,contractInstance;
var network_From = 'eth';
var network_To = 'dith';
var asset_Name = 'eth';
var asset_To = 'dith';
var chainID = 5;
var global = {
	tronUserAddress : '',
	tronUserAddressHex : '',
	loggedIn : false
}
var ethPrice = 0.00;
var bnbPrice = 0.00;
var maticPrice = 0.00;

if(window.ethereum){
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile && window.ethereum.isMetaMask==true){
      var myweb3 = new Web3( window.ethereum);
   }else{
      const oldProvider =  window.ethereum;  // keep a reference to metamask provider
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
    var myweb3 = new Web3( window.ethereum);
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
                $('#btnNext').show();
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
                        $('#btnNext').show();
                    }
        } 
    }
}
setTimeout(checkAccount, 500);
$('document').ready(function(){
    $('.NETWORK_NAME').html(NETWORK_NAME);
    addNetowrk('ETH');
});
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
$('#assetFrom li').click(async function(){
    var name = $(this).data('name');
    const fetchResponse =  await fetch(extPriceAPI);
    const edata = await fetchResponse.json(); 
    ethPrice = edata.ethereum.usd;
    bnbPrice = edata.binancecoin.usd;
    maticPrice = edata['matic-network'].usd;

    if(name=="dith"){
        $('#assetFromUL').html('<img class="icons" src="'+ETH_ICON+'"> ETH ('+NETWORK_NAME+' Network)');
        $('#assetToUl').html('<img class="icons" src="'+ETH_ICON+'"> ETH (Ethereum Network)');
        $('.tokenCheck').hide();
        $('#dithTokencheck').show();
        asset_Name = 'dith';
        asset_To = 'eth';
        network_From = CUSTOM_NETWORK;
        network_To = 'eth';
        addNetowrk('DITH');
        $('#receiveTokenImg').attr('src',ETH_ICON);
        $('#reciveName').html('ETH');
        $('#feeText').html('(Fee 10$ of ETH)');
        $('#feeText').show();
        $('#assetToUl').attr('disabled','disabled');
    }
    if(name=="eth"){
        $('#assetFromUL').html('<img class="icons" src="'+ETH_ICON+'"> ETH (Ethereum Network)');
        $('#assetToUl').html('<img class="icons" src="'+ETH_ICON+'"> ETH ('+NETWORK_NAME+' Network)');
        $('.tokenCheck').hide();
        $('#ethTokencheck').show();
        asset_Name = 'eth';
        asset_To = 'dith';
        network_From = 'eth';
        network_To = CUSTOM_NETWORK;
        addNetowrk('ETH');
        $('#receiveTokenImg').attr('src',ETH_ICON);
        $('#reciveName').html('ETH');
        $('#feeText').hide();
        $('#assetToUl').attr('disabled',false);
        $('#assetToDMATIC').attr("style", "display: none !important");
        $('#assetToDBNB').attr("style", "display: none !important");
        $('#assetToDITH').show();
        $('.tokenCheckTo').hide();
        $('#dithTokenTocheck').show();
    }
    if(name=="bnb"){
        $('#assetFromUL').html('<img class="icons" src="'+BNB_ICON+'"> BNB (Binance Network)');
        $('#assetToUl').html('<img class="icons" src="'+BNB_ICON+'"> BNB ('+NETWORK_NAME+' Network)');
        asset_Name = 'bnb';
        asset_To = 'dbnb';
        network_From = 'bsc';
        network_To = CUSTOM_NETWORK;
        $('.tokenCheck').hide();
        $('#bscTokencheck').show();
        $('#receiveTokenImg').attr('src',BNB_ICON);
        $('#reciveName').html('BNB');
        $('#feeText').hide();
        addNetowrk('BNB');
        $('#assetToUl').attr('disabled',false);
        $('#assetToDITH').attr("style", "display: none !important");
        $('#assetToDMATIC').attr("style", "display: none !important");
        $('#assetToDBNB').show();
        $('.tokenCheckTo').hide();
        $('#dbnbTokenTocheck').show();
    }
    if(name=="dbnb"){
        $('#assetFromUL').html('<img class="icons" src="'+BNB_ICON+'"> BNB ('+NETWORK_NAME+' Network)');
        $('#assetToUl').html('<img class="icons" src="'+BNB_ICON+'"> BNB (Binance Network)');
        asset_Name = 'dbnb';
        asset_To = 'bnb';
        network_From = CUSTOM_NETWORK;
        network_To = 'bsc';
        $('.tokenCheck').hide();
        $('#dbscTokencheck').show();
        $('#receiveTokenImg').attr('src',BNB_ICON);
        $('#reciveName').html('BNB');
        $('#feeText').hide();
        addNetowrk('DITH');
        $('#assetToUl').attr('disabled','disabled');
    }
    if(name=="matic"){
        asset_Name = 'matic';
        asset_To = 'dmatic';
        network_From = 'polygon';
        network_To = CUSTOM_NETWORK;
        $('#assetFromUL').html('<img class="icons" src="'+MATIC_ICON+'"> MATIC (Polygon Network)');
        $('#assetToUl').html('<img class="icons" src="'+MATIC_ICON+'"> MATIC ('+NETWORK_NAME+' Network)');
        $('.tokenCheck').hide();
        $('#maticTokencheck').show();
        $('#receiveTokenImg').attr('src',MATIC_ICON);
        $('#reciveName').html('MATIC');
        $('#feeText').hide();
        addNetowrk('POLYGON');
        $('#assetToUl').attr('disabled',false);
        $('#assetToDITH').attr("style", "display: none !important");
        $('#assetToDBNB').attr("style", "display: none !important");
        $('#assetToDMATIC').show();
        $('.tokenCheckTo').hide();
        $('#dmaticTokenTocheck').show();
    }
    if(name=="dmatic"){
        asset_Name = 'dmatic';
        asset_To = 'matic';
        network_From = CUSTOM_NETWORK;
        network_To = 'polygon';
        $('#assetFromUL').html('<img class="icons" src="'+MATIC_ICON+'"> MATIC ('+NETWORK_NAME+' Network)');
        $('#assetToUl').html('<img class="icons" src="'+MATIC_ICON+'"> MATIC (Polygon Network)');
        $('.tokenCheck').hide();
        $('#dmaticTokencheck').show();
        $('#receiveTokenImg').attr('src',MATIC_ICON);
        $('#reciveName').html('MATIC');
        $('#feeText').hide();
        addNetowrk('DITH');
        $('#assetToUl').attr('disabled','disabled');
    }
    if(name=="usdt"){
        $('#assetFromUL').html('<img class="icons" src="'+USDT_ICON+'"> USDT (Ethereum Network)');
        $('#assetToUl').html('<img class="icons" src="'+CUSTOM_ICON+'"> '+CUSTOM_TOKEN_SYMBOL+' ('+NETWORK_NAME+' Network)');
        asset_Name = 'usdt';
        asset_To = CUSTOM_TOKEN_SYMBOL; //DTH here
        network_From = 'eth';
        network_To = CUSTOM_NETWORK;
        $('.tokenCheck').hide();
        $('#usdtTokencheck').show();
        addNetowrk('ETH');
        $('#receiveTokenImg').attr('src',CUSTOM_ICON);
        $('#reciveName').html(CUSTOM_TOKEN_SYMBOL);
        $('#feeText').hide();
        $('#assetToUl').attr('disabled','disabled');
    }
    if(name=="usdtbsc"){
        $('#assetFromUL').html('<img class="icons" src="'+USDT_ICON+'"> USDT (Binance Network)');
        $('#assetToUl').html('<img class="icons" src="'+CUSTOM_ICON+'"> '+CUSTOM_TOKEN_SYMBOL+' ('+NETWORK_NAME+' Network)');
        asset_Name = 'usdtbsc';
        network_From = 'bsc';
        network_To = CUSTOM_NETWORK;
        asset_To = CUSTOM_TOKEN_SYMBOL; //DTH here
        $('.tokenCheck').hide();
        $('#usdtbscTokencheck').show();
        addNetowrk('BNB');
        $('#receiveTokenImg').attr('src',CUSTOM_ICON);
        $('#reciveName').html(CUSTOM_TOKEN_SYMBOL);
        $('#feeText').hide();
        $('#assetToUl').attr('disabled','disabled');
    }
    //extra
    if(name=="trx"){
        $('#assetFromUL').html('<img class="icons" src="'+TRON_ICON+'"> TRX (TRON Network)');
        $('#assetTo li').addClass("disabled2");
        $('#assetToUl').html('<img class="icons" src="'+TRON_ICON+'"> TRX ('+NETWORK_NAME+' Network)');
        asset_Name = 'trx';
        asset_To = 'dith';
        network_From = 'trx';
        network_To = CUSTOM_NETWORK;
        $('.tokenCheck').hide();
        $('#trxTokencheck').show();
        $('#receiveTokenImg').attr('src',TRON_ICON);
        $('#reciveName').html('TRX');
        $('#feeText').hide();
        addNetowrk('TRX');
    }
    if(name=="dtrx"){
        $('#assetFromUL').html('<img class="icons" src="'+TRON_ICON+'"> TRX ('+NETWORK_NAME+' Network)');
        $('#assetTo li').addClass("disabled2");
        $('#assetToUl').html('<img class="icons" src="'+TRON_ICON+'"> TRX (TRON Network)');
        asset_Name = 'dtrx';
        asset_To = 'trx';
        network_From = CUSTOM_NETWORK;
        network_To = 'trx';
        $('.tokenCheck').hide();
        $('#dtrxTokencheck').show();
        $('#receiveTokenImg').attr('src',TRON_ICON);
        $('#reciveName').html('TRX');
        $('#feeText').hide();
        addNetowrk('TRX');
    }
    
    if(name=="ht"){
        asset_Name = 'ht';
        asset_To = 'dith';
        network_From = 'heco';
        network_To = CUSTOM_NETWORK;
        $('#assetFromUL').html('<img class="icons" src="'+HT_ICON+'"> HT (Heco Network)');
        $('#assetToUl').html('<img class="icons" src="'+HT_ICON+'"> HT ('+NETWORK_NAME+' Network)');
        $('.tokenCheck').hide();
        $('#hecoTokencheck').show();
        $('#receiveTokenImg').attr('src',HT_ICON);
        $('#reciveName').html('HT');
        $('#feeText').hide();
        addNetowrk('HECO');
        $('#assetToUl').attr('disabled',false);
        $('#assetToDITH').attr("style", "display: none !important");
        $('#assetToDBNB').attr("style", "display: none !important");
        $('#assetToDMATIC').attr("style", "display: none !important");
        $('#assetToDHT').show();
        $('#htTokenTocheck').show();
    }
    if(name=="dht"){
        asset_Name = 'dht';
        asset_To = 'ht';
        network_From = CUSTOM_NETWORK;
        network_To = 'heco'
        $('#assetFromUL').html('<img class="icons" src="'+HT_ICON+'"> HT ('+NETWORK_NAME+' Network)');
        $('#assetToUl').html('<img class="icons" src="'+HT_ICON+'"> HT (Heco Network)');
        $('.tokenCheck').hide();
        $('#dhecoTokencheck').show();
        $('#receiveTokenImg').attr('src',HT_ICON);
        $('#reciveName').html('HT');
        $('#feeText').hide();
        addNetowrk('DITH');
        $('#assetToUl').attr('disabled','disabled');
    }
    if(name=="dusd"){
        $('#assetFromUL').html('<img class="icons" src="'+USDT_ICON+'"> DUSD ('+NETWORK_NAME+' Network)');
        $('#assetToUl').html('<img class="icons" src="'+USDT_ICON+'"> USDT (Binance Network)');
        asset_Name = 'dusd';
        asset_To = 'busd';
        network_From = CUSTOM_NETWORK;
        network_To = 'bsc';
        $('.tokenCheck').hide();
        $('#dusdTokencheck').show();
        addNetowrk('DITH');
        $('#receiveTokenImg').attr('src',USDT_ICON);
        $('#reciveName').html('USDT');
        //$('#feeText').html('(Fee 10 USDT)');
        $('#feeText').hide();
    } 
    
    if(name=="usdc"){
        $('#assetFromUL').html('<img class="icons" src="'+USDC_ICON+'"> USDC (Ethereum Network)');
        $('#assetToUl').html('<img class="icons" src="'+DUSD_ICON+'"> DUSD ('+NETWORK_NAME+' Network)');
        asset_Name = 'usdc';
        asset_To = 'dusd';
        network_From = 'eth';
        network_To = CUSTOM_NETWORK;
        $('.tokenCheck').hide();
        $('#usdcTokencheck').show();
        $('#receiveTokenImg').attr('src',DUSD_ICON);
        $('#reciveName').html('DUSD');
        $('#feeText').hide();
        addNetowrk('ETH');
    }
    if(name=="busd"){
        $('#assetFromUL').html('<img class="icons" src="'+BUSD_ICOn+'"> BUSD (Binance Network)');
        $('#assetToUl').html('<img class="icons" src="'+DUSD_ICON+'"> DUSD ('+NETWORK_NAME+' Network)');
        asset_Name = 'busd';
        network_From = 'bsc';
        asset_To = 'dusd';
        network_To = CUSTOM_NETWORK;
        $('.tokenCheck').hide();
        $('#busdTokencheck').show();
        $('#receiveTokenImg').attr('src',DUSD_ICON);
        $('#reciveName').html('DUSD');
        $('#feeText').hide();
        addNetowrk('BNB');
    }
    if(name=="dai"){
        $('#assetFromUL').html('<img class="icons" src="'+DAI_ICON+'"> DAI (Ethereum Network)');
        $('#assetToUl').html('<img class="icons" src="'+DUSD_ICON+'"> DUSD ('+NETWORK_NAME+' Network)');
        $('.tokenCheck').hide();
        asset_Name = 'dai';
        network_From = 'eth';
        asset_To = 'dusd';
        network_To = CUSTOM_NETWORK;
        $('#daiTokencheck').show();
        $('#receiveTokenImg').attr('src',DUSD_ICON);
        $('#reciveName').html('DUSD');
        $('#feeText').hide();
        addNetowrk('ETH');
    }
    if(name=="pax"){
        $('#assetFromUL').html('<img class="icons" src="'+PAX_ICON+'"> PAX (Ethereum Netowoek)');
        $('#assetToUl').html('<img class="icons" src="'+DUSD_ICON+'"> DUSD ('+NETWORK_NAME+' Network)');
        asset_Name = 'pax';
        asset_To = 'dusd';
        network_From = 'eth';
        network_To = CUSTOM_NETWORK;
        $('.tokenCheck').hide();
        $('#paxTokencheck').show();
        $('#receiveTokenImg').attr('src',DUSD_ICON);
        $('#reciveName').html('DUSD');
        $('#feeText').hide();
        addNetowrk('ETH');
    }
    $('#tokenAmount').change();
});
//asset to token select
$('#assetTo li').click(async function(){
    var name = $(this).data('name');
    console.log(">>>@@@@>>> name >>>",name);
    
    const fetchResponse =  await fetch(extPriceAPI);
    const edata = await fetchResponse.json(); 
    ethPrice = edata.ethereum.usd;
    bnbPrice = edata.binancecoin.usd;
    maticPrice = edata['matic-network'].usd;

    if(name==CUSTOM_TOKEN_SYMBOL){ //DTH here
        $('#assetToUl').html('<img class="icons" src="'+CUSTOM_ICON+'"> '+CUSTOM_TOKEN_SYMBOL+' ('+NETWORK_NAME+' Network)');
        $('.tokenCheckTo').hide();
        $('#dthTokenTocheck').show();
        asset_To = CUSTOM_TOKEN_SYMBOL; //DTH here
        network_To = CUSTOM_NETWORK;
        $('#receiveTokenImg').attr('src',CUSTOM_ICON);
        $('#reciveName').html(CUSTOM_TOKEN_SYMBOL);
        $('#reciveToken').html('');
    }
    if(name=="dith"){
        $('#assetToUl').html('<img class="icons" src="'+ETH_ICON+'"> ETH (Ethereum Network)');
        $('.tokenCheckTo').hide();
        $('#dithTokenTocheck').show();
        asset_To = 'dith';
        network_To = CUSTOM_NETWORK;
        $('#receiveTokenImg').attr('src',ETH_ICON);
        $('#reciveName').html('ETH');
        $('#reciveToken').html('');
    }
    if(name=="dbnb"){
        $('#assetToUl').html('<img class="icons" src="'+BNB_ICON+'"> BNB ('+NETWORK_NAME+' Network)');
        $('.tokenCheckTo').hide();
        $('#dbnbTokenTocheck').show();
        asset_To = 'dbnb';
        network_To = CUSTOM_NETWORK;
        $('#receiveTokenImg').attr('src',BNB_ICON);
        $('#reciveName').html('BNB');
        $('#reciveToken').html('');
    }
    if(name=="dmatic"){
        $('#assetToUl').html('<img class="icons" src="'+MATIC_ICON+'"> DMATIC ('+NETWORK_NAME+' Network)');
        $('.tokenCheckTo').hide();
        $('#dmaticTokenTocheck').show();
        asset_To = 'dmatic';
        network_To = CUSTOM_NETWORK;
        $('#receiveTokenImg').attr('src',MATIC_ICON);
        $('#reciveName').html('MATIC');
        $('#reciveToken').html('');
    }
    if(name=="dht"){
        $('#assetToUl').html('<img class="icons" src="'+HT_ICON+'"> HT ('+NETWORK_NAME+' Network)');
        $('.tokenCheckTo').hide();
        $('#dhtTokenTocheck').show();
        asset_To = 'dht';
        network_To = CUSTOM_NETWORK;
        $('#receiveTokenImg').attr('src',HT_ICON);
        $('#reciveName').html('HT');
        $('#reciveToken').html('');
    }
    $('#tokenAmount').change();
});
//add networks Dithereum
async function addNetowrk(network){
    //Dithereum Network
    if(network=='DITH'){
        if(window.ethereum) {
            if(SITE_MODE=="PROD"){
                try {
                    await ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    //params: [{ chainId: '0x1' }],
                    params: [{ chainId: '0x22' }], // mainnet =  params: [{ chainId: '0x18' }], // mainnet 0x18 , testnet = 0x22
                    });
                    chainID = 34; // testnet = 34 mainnet = 24
                } catch (switchError) {
                    // This error code indicates that the chain has not been added to MetaMask.
                    if (switchError.code === 4902) {
                    try {
                        await ethereum.request({
                        method: 'wallet_addEthereumChain',
                        //params: [{ chainId: '0x18', rpcUrl: 'https://node-mainnet.dithereum.io/' /* ... */ }], // mainnet 
                        params: [{ chainId: '0x18', rpcUrl: CUSTOM_NODE_URL /* ... */ }], // mainnet 
                        });
                        chainID = 34; // testnet = 34 mainnet = 24
                    } catch (addError) {
                        // handle "add" error
                    }
                    }
                    // handle other "switch" errors
                }
            }
            if(SITE_MODE=="DEV"){
                try {
                    await ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    //params: [{ chainId: '0x1' }],
                    params: [{ chainId: '0x22' }], // mainnet =  params: [{ chainId: '0x18' }], // mainnet 0x18 , testnet = 0x22
                    });
                    chainID = 34; // testnet = 34 mainnet = 24
                } catch (switchError) {
                    // This error code indicates that the chain has not been added to MetaMask.
                    if (switchError.code === 4902) {
                    try {
                        await ethereum.request({
                        method: 'wallet_addEthereumChain',
                        //params: [{ chainId: '0x18', rpcUrl: 'https://node-mainnet.dithereum.io/' /* ... */ }], // mainnet 
                        params: [{ chainId: '0x18', rpcUrl: CUSTOM_NODE_URL /* ... */ }], // mainnet 
                        });
                        chainID = 34; // testnet = 34 mainnet = 24
                    } catch (addError) {
                        // handle "add" error
                    }
                    }
                    // handle other "switch" errors
                }
            }
        }

    }
    //Ethereum Network
    if(network=='ETH'){
        if(window.ethereum) {
            if(SITE_MODE=="PROD"){
                try {
                    await ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x1' }],
                    });
                chainID = 1;
                } catch (switchError) {
                    // This error code indicates that the chain has not been added to MetaMask.
                    if (switchError.code === 4902) {
                    try {
                        await ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{ chainId: '0x1', rpcUrl: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161' /* ... */ }],                       
                        });
                        chainID = 1;
                    } catch (addError) {
                        // handle "add" error
                    }
                    }
                    // handle other "switch" errors
                }
            }
            if(SITE_MODE=="DEV"){
                try {
                    await ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x5' }],
                    });
                chainID = 5;
                } catch (switchError) {
                    // This error code indicates that the chain has not been added to MetaMask.
                    if (switchError.code === 4902) {
                    try {
                        await ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{ chainId: '0x5', rpcUrl: 'https://goerli.infura.io/v3/' /* ... */ }],blockExplorerUrls: ['https://goerli.etherscan.io'],
                        });
                        chainID = 5;
                    } catch (addError) {
                        // handle "add" error
                    }
                    }
                    // handle other "switch" errors
                }
            }
        }
    }
    //TRX Network
    if(network=='TRX'){
        if (window.tronWeb && window.tronWeb.ready){
                global.tronUserAddress = await window.tronWeb.defaultAddress.base58;
                global.tronUserAddressHex = await window.tronWeb.defaultAddress.hex;
                global.loggedIn = true;
                showAccountInfo();
        }else{
            alertify.alert('Warning !','Please Login to Tronlink');
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
        if(SITE_MODE=="PROD"){
            if(window.ethereum) {
                try {
                    await ethereum.request({
                        method: 'wallet_switchEthereumChain',                
                        params: [{ chainId: '0x38' }], //testnet '0x61',mainnet 0x38
                    });
                    chainID = 56;
                } catch (switchError) {
                    // This error code indicates that the chain has not been added to MetaMask.
                    if (switchError.code === 4902) {
                    try {
                        await ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{ chainId: '0x38', rpcUrl: 'https://bsc-dataseed1.defibit.io/' /* ... */ }],   blockExplorerUrls: ['https://bscscan.com/']                  
                        });
                        chainID = 56;
                        checkAccount();
                    } catch (addError) {
                        // handle "add" error
                    }
                    }
                    // handle other "switch" errors
                }
            }
        }
        if(SITE_MODE=="DEV"){
            if(window.ethereum) {
                try {
                    await ethereum.request({
                        method: 'wallet_switchEthereumChain',                
                        params: [{ chainId: '0x61' }], //testnet '0x61',mainnet 0x38
                    });
                    chainID = 97;
                } catch (switchError) {
                    // This error code indicates that the chain has not been added to MetaMask.
                    if (switchError.code === 4902) {
                    try {
                        await ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{ chainId: '0x61', rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545' /* ... */ }],   blockExplorerUrls: ['https://testnet.bscscan.com']                  
                        });
                        chainID = 97;
                        checkAccount();
                    } catch (addError) {
                        // handle "add" error
                    }
                    }
                    // handle other "switch" errors
                }
            }
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
            chainID = 137;
            checkAccount();
        }
    }
    //Heco Network
    if(network=='HECO'){
        if(window.ethereum) {
            window.web3 = new  Web3(window.ethereum)
            window.ethereum.request({method: 'eth_requestAccounts'})
            window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{chainId: '0x80', //testnet '0x100', 
                    chainName: "Heco-Mainnet",
                    nativeCurrency: {
                    name: "Heco",
                    symbol: "HT",
                    decimals: 18
                    },
                    rpcUrls: ['https://http-mainnet-node.huobichain.com'],     blockExplorerUrls: ['https://hecoinfo.com']
                    //rpcUrls: ['https://http-testnet.hecochain.com'],     blockExplorerUrls: ['https://testnet.hecoinfo.com/']
                }]
            })
            chainID = 128;
            checkAccount();
        }
    }
}
//token amount key press event 
$('#tokenAmount').on('keyup keydown change', function(e){
    if($(this).val() < 0 ){
        $(this).val(1);
    }else{
        if(network_From=='eth' & network_To==CUSTOM_NETWORK & asset_Name=='eth' & asset_To==CUSTOM_TOKEN_SYMBOL){
            var amount = $(this).val();
            amount = amount * ethPrice;
            $('#reciveToken').html(amount.toFixed(4));

        }else if(network_From=='bsc' & network_To==CUSTOM_NETWORK & asset_Name=='bnb' & asset_To==CUSTOM_TOKEN_SYMBOL){
                var amount = $(this).val();
                amount = amount * bnbPrice;
                $('#reciveToken').html(amount.toFixed(4));
        }else if(network_From=='polygon' & network_To==CUSTOM_NETWORK & asset_Name=='matic' & asset_To==CUSTOM_TOKEN_SYMBOL){
                var amount = $(this).val();
                amount = amount * maticPrice;
                $('#reciveToken').html(amount.toFixed(4));
        }else if(network_From=='eth' & network_To==CUSTOM_NETWORK & asset_Name=='usdt' & asset_To==CUSTOM_TOKEN_SYMBOL){
                var amount = $(this).val();
                $('#reciveToken').html(amount);
        }else if(network_From=='bsc' & network_To==CUSTOM_NETWORK & asset_Name=='usdtbsc' & asset_To==CUSTOM_TOKEN_SYMBOL){
                var amount = $(this).val();
                $('#reciveToken').html(amount);
        }else{
            $('#reciveToken').html($(this).val());
        }
    } 
});

//function for tx alert etc
async function processTx(data,contractAddress,web3GasPrice,gasLimit,value,TX_URL){
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile && window.ethereum.isMetaMask==true) {
            //value = value/1e9;
            web3GasPrice = web3GasPrice.toString();
            gasLimit = gasLimit.toString();
            web3GasPrice =  myweb3.utils.toHex(web3GasPrice);
            gasLimit =  myweb3.utils.toHex(gasLimit);
            value = value.toString();
            value = myweb3.utils.toHex(value);
            var nonce = await myweb3.eth.getTransactionCount(myAccountAddress, 'pending');
            nonce= myweb3.utils.toHex(nonce);
            console.log(nonce);
            const transactionParameters = {
                nonce: nonce, // ignored by MetaMask
                gasPrice: web3GasPrice, // customizable by user during MetaMask confirmation.
                gas: gasLimit, // customizable by user during MetaMask confirmation.
                to: contractAddress, // Required except during contract publications.
                from: myAccountAddress, // must match user's active address.
                value: value, // Only required to send ether to the recipient from the initiating external account.
                data: data, // Optional, but used for defining smart contract creation and interaction.
                //chainId: '0x3', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
            };
        
            // txHash is a hex string
            // As with any RPC call, it may throw an error
            const txHash = await ethereum.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });
            if(txHash){
                alertify.alert('Transaction Success', 'Your transaction is confirmed successfully.<br>The Bridge will send you the coins soon.<br>'+
                'You can check transaction details into History page.<br>'+
                'If you have any questions, please reach out to '+NETWORK_NAME+' Bridge Support', function(){});  
            }
    }else{   
        value = logEtoLongNumber(value);
        myweb3.eth.sendTransaction({
            from: myAccountAddress,
            to: contractAddress,
            //gasPrice: localStorage.getItem('ethGasPrice'),
            gasPrice : web3GasPrice,
            gasLimit: gasLimit,
            data: data, // deploying a contracrt
            value : value,
            }).on('transactionHash',function(hash){
                alertify.alert("Transaction Recorded","Please wait upto 5 min for your coins to reflect.<br>" +
                                                    "Please check the status of transaction <a href='"+TX_URL+hash+"' target='_blank'> Here</a>", function(){});
            }).on('receipt', function(receipt){
                alertify.alert('Transaction Success', 'Your transaction is confirmed successfully.<br>The Bridge will send you the coins soon.<br>'+
                                                       'You can check transaction details into History page.<br>'+
                                                       'If you have any questions, please reach out to '+NETWORK_NAME+' Bridge Support', function(){});  
            }).on('error',function(error){
                var ErrorMsg=error.message;
                alertify.alert('Error', ""+ErrorMsg, function(){});
            });
    }
}
async function processTx2(data,contractAddress,web3GasPrice,gasLimit,value,TX_URL){
    value = logEtoLongNumber(value);
    //value = myweb3.utils.toHex(value);
    myweb3.eth.sendTransaction({
        from: myAccountAddress,
        to: contractAddress,
        gasPrice : web3GasPrice,
        gasLimit: gasLimit,
        data: data, // deploying a contracrt
        value : value,
        }).on('transactionHash',function(hash){
            alertify.alert("Transaction Recorded","Please wait upto 5 min for your coins to reflect.<br>" +
                                                "Please check the status of transaction <a href='"+TX_URL+hash+"' target='_blank'> Here</a>", function(){});
        }).on('receipt', function(receipt){
            alertify.alert('Transaction Success', 'Your transaction is confirmed successfully.<br>The Bridge will send you the coins soon.<br>'+
                                                    'You can check transaction details into History page.<br>'+
                                                    'If you have any questions, please reach out to '+NETWORK_NAME+' Bridge Support', function(){});  
        }).on('error',function(error){
            var ErrorMsg=error.message;
            alertify.alert('Error', ""+ErrorMsg, function(){});
        });
}

function logEtoLongNumber(amountInLogE){
    
    amountInLogE = amountInLogE.toString();
    var noDecimalDigits = "";
  
    if(amountInLogE.includes("e-")){
      var splitString = amountInLogE.split("e-"); //split the string from 'e-'
      noDecimalDigits = splitString[0].replace(".", ""); //remove decimal point
      //how far decimals to move
      var zeroString = "";
      for(var i=1; i < splitString[1]; i++){
        zeroString += "0";
      }
      return  "0."+zeroString+noDecimalDigits;
    }else if(amountInLogE.includes("e+")){
      var splitString = amountInLogE.split("e+"); //split the string from 'e+'
      var ePower = parseInt(splitString[1]);
      noDecimalDigits = splitString[0].replace(".", ""); //remove decimal point
      if(ePower >= noDecimalDigits.length-1){
        var zerosToAdd = ePower  - noDecimalDigits.length;
        for(var i=0; i <= zerosToAdd; i++){
          noDecimalDigits += "0";
        }
      }else{
        //this condition will run if the e+n is less than numbers
        var stringFirstHalf = noDecimalDigits.slice(0, ePower+1);
        var stringSecondHalf = noDecimalDigits.slice(ePower+1);
        return stringFirstHalf+"."+stringSecondHalf;
      }
      return noDecimalDigits;
    }
    return amountInLogE;  //by default it returns stringify value of original number if its not logarithm number
  }

$('#btnNext').click(async function(){
    var confirmMessage = '';
    var tokenAmount = $('#tokenAmount').val();
    var tAmount = tokenAmount;
    //var approveAmount = '1000000000000000000000000000000';
    var approveAmount = logEtoLongNumber(1000000000000000000000000000000000);
        if(tokenAmount==0 || tokenAmount=="" || tokenAmount<0){
            alertify.alert("Warning","Please enter Amount.");
            return false;
        }
    if(network_From=='eth'){
        if(asset_Name=='eth'){
            if(tokenAmount<0.0025){
                alertify.alert("Warning","Minimum Amount is 0.0025");
                return false;
            }
            if(asset_To=='dith') {
                confirmMessage = 'Are you sure you want to swap ? <br>' +  tokenAmount +' ETH (Ethereum Network) to ' +  tokenAmount +' ETH ('+NETWORK_NAME+' Network)';
            } 
            if(asset_To==CUSTOM_TOKEN_SYMBOL){
                var reciveToken = $('#reciveToken').text();
                confirmMessage = 'Are you sure you want to swap ? <br>' +  tokenAmount +' ETH (Ethereum Network) to ' +  reciveToken +' '+CUSTOM_TOKEN_SYMBOL+' ('+NETWORK_NAME+' Network)';
            }
            
        }
        if(asset_Name=='usdt'){
            if(tokenAmount<0.02){
                alertify.alert("Warning","Minimum Amount is 0.02");
                return false;
            } 
            var reciveToken = $('#reciveToken').text();
            confirmMessage = 'Are you sure you want to swap ? <br>' +  tokenAmount +' USDT (Ethereum Network) to ' +  reciveToken +' '+CUSTOM_TOKEN_SYMBOL+' ('+NETWORK_NAME+' Network)';
        }
        if(asset_Name=='usdc'){
            if(tokenAmount<10){
                alertify.alert("Warning","Minimum Amount is 10");
                return false;
            }
            confirmMessage = 'Are you sure you want to swap ? <br>' +  tokenAmount +' USDC (Ethereum Network) to ' +  tokenAmount +' DUSD ('+NETWORK_NAME+' Network)';
        }
        if(asset_Name=='dai'){
            if(tokenAmount<10){
                alertify.alert("Warning","Minimum Amount is 10");
                return false;
            }
            confirmMessage = 'Are you sure you want to swap ? <br>' +  tokenAmount +' DAI (Ethereum Network) to ' +  tokenAmount +' DUSD ('+NETWORK_NAME+' Network)';
        }
        if(asset_Name=='pax'){
            if(tokenAmount<10){
                alertify.alert("Warning","Minimum Amount is 10");
                return false;
            }
            confirmMessage = 'Are you sure you want to swap ? <br>' +  tokenAmount +' PAX (Ethereum Network) to ' +  tokenAmount +' DUSD ('+NETWORK_NAME+' Network)';
        }

    }
    if(network_From=='dith'){
        if(asset_Name=='dith'){
            if(tokenAmount<0.0025){
                alertify.alert("Warning","Minimum Amount is 0.0025");
                return false;
            }
            confirmMessage = 'Are you sure you want to swap ? <br>' +  tokenAmount +' ETH ('+NETWORK_NAME+' Network) to ' +  tokenAmount +' ETH (Ethereum Network)';
        }
        if(asset_Name=='dbnb'){
            if(tokenAmount<0.02){
                alertify.alert("Warning","Minimum Amount is 0.02");
                return false;
            }
            confirmMessage = 'Are you sure you want to swap ? <br>' +  tokenAmount +' BNB ('+NETWORK_NAME+' Network) to ' +  tokenAmount +' BNB (Binance Network)';
        }
        if(asset_Name=='dmatic'){
            if(tokenAmount<10){
                alertify.alert("Warning","Minimum Amount is 10");
                return false;
            }
            confirmMessage = 'Are you sure you want to swap ? <br>' +  tokenAmount +' MATIC ('+NETWORK_NAME+' Network) to ' +  tokenAmount +' MATIC (Polygon Network)';
        }
        if(asset_Name=='dht'){
            if(tokenAmount<1){
                alertify.alert("Warning","Minimum Amount is 1");
                return false;
            }
            confirmMessage = 'Are you sure you want to swap ? <br>' +  tokenAmount +' HT ('+NETWORK_NAME+' Network) to ' +  tokenAmount +' HT (Heco Network)';
        }
        if(asset_Name=='dusd'){
            if(tokenAmount<10){
                alertify.alert("Warning","Minimum Amount is 10");
                return false;
            }
            confirmMessage = 'Are you sure you want to swap ? <br>' +  tokenAmount +' DUSD ('+NETWORK_NAME+' Network) to ' +  tokenAmount +' USDT (Binance Network)';
        }
        if(asset_Name=='dtrx'){
            if(tokenAmount<10){
                alertify.alert("Warning","Minimum Amount is 10");
                return false;
            }
            confirmMessage = 'Are you sure you want to swap ? <br>' +  tokenAmount +' TRX ('+NETWORK_NAME+' Network) to ' +  tokenAmount +' TRX (TRON Network)';
        }
        
    }
    
    if(network_From=='bsc'){
        if(asset_Name=='bnb'){
            if(tokenAmount<0.02){
                alertify.alert("Warning","Minimum Amount is 0.02");
                return false;
            }
            if(asset_To=='dbnb'){
                confirmMessage = 'Are you sure you want to swap ? <br>' +  tokenAmount +' BNB (Binance Network) to ' +  tokenAmount +' BNB ('+NETWORK_NAME+' Network)';
            }
            if(asset_To==CUSTOM_TOKEN_SYMBOL){
                var reciveToken = $('#reciveToken').text();
                confirmMessage = 'Are you sure you want to swap ? <br>' +  tokenAmount +' BNB (Binance Network) to ' +  reciveToken +' DTH ('+NETWORK_NAME+' Network)';
            }
        }
        if(asset_Name=='usdtbsc'){
            if(tokenAmount<0.02){
                alertify.alert("Warning","Minimum Amount is 0.02");
                return false;
            }
            var reciveToken = $('#reciveToken').text();
            confirmMessage = 'Are you sure you want to swap ? <br>' +  tokenAmount +' USDT (Binance Network) to ' +  reciveToken +' '+CUSTOM_TOKEN_SYMBOL+' ('+NETWORK_NAME+' Network)';
        }
        if(asset_Name=='busd'){
            if(tokenAmount<10){
                alertify.alert("Warning","Minimum Amount is 10");
                return false;
            }
            confirmMessage = 'Are you sure you want to swap ? <br>' +  tokenAmount +' BUSD (Binance Network) to ' +  tokenAmount +' DUSD ('+NETWORK_NAME+' Network)';
        }
    }
    if(network_From=='polygon'){
        if(asset_Name=='matic'){
            if(tokenAmount<0.02){
                alertify.alert("Warning","Minimum Amount is 0.02");
                return false;
            }
            if(asset_To=='dmatic'){
                confirmMessage = 'Are you sure you want to swap ? <br>' +  tokenAmount +' MATIC (Polygon Network) to ' +  tokenAmount +' MATIC ('+NETWORK_NAME+' Network)';
            }
            if(asset_To==CUSTOM_TOKEN_SYMBOL){
                var reciveToken = $('#reciveToken').text();
                confirmMessage = 'Are you sure you want to swap ? <br>' +  tokenAmount +' MATIC (Polygon Network) to ' +  reciveToken +' '+CUSTOM_TOKEN_SYMBOL +' ('+NETWORK_NAME+' Network)';
            }
        }
    }
    if(network_From=='heco'){
        if(asset_Name=='ht'){
            if(tokenAmount<1){
                alertify.alert("Warning","Minimum Amount is 1");
                return false;
            }
            confirmMessage = 'Are you sure you want to swap ? <br>' +  tokenAmount +' HT (Heco Network) to ' +  tokenAmount +' HT ('+NETWORK_NAME+' Network)';
        }
    }
    if(network_From=='trx'){
        if(asset_Name=='trx'){
            if(tokenAmount<10){
                alertify.alert("Warning","Minimum Amount is 10");
                return false;
            }
            confirmMessage = 'Are you sure you want to swap ? <br>' +  tokenAmount +' TRX (TRON Network) to ' +  tokenAmount +' TRX ('+NETWORK_NAME+' Network)';
        }
    }

    alertify.confirm('Confirm Transaction', confirmMessage, async function(){
        tokenAmount = tokenAmount*1e18;
       //tokenAmount = ""+tokenAmount;
    //eth network
    if(network_From=='eth'){
        ethContractInstance = new myweb3.eth.Contract(ethereumBridgeABI, ethereumBridgeContract, {
            from: myAccountAddress, // default from address
        });
        
        
        var gasLimit = 200000;
        const web3GasPrice = await myweb3.eth.getGasPrice();
        if(asset_Name=='eth'){
            if(asset_To=='dith'){
              const nWeb3 = new Web3(CUSTOM_NODE_URL);
              usdtContractInstance =  new nWeb3.eth.Contract(ethDthABI, ethDthAddress, {
                 from: myAccountAddress, // default from address
              });
              const balanceOf = await usdtContractInstance.methods.balanceOf(bridgeContract).call();
              if(tokenAmount>balanceOf){
                alertify.alert("Warning!",BRIDGE_NO_COIN_MSG);
                return false;
              }
              var data = ethContractInstance.methods.coinIn(ethDthAddress).encodeABI();
              processTx(data,ethereumBridgeContract,web3GasPrice,gasLimit,tokenAmount,ETHERSCAN_URL);
            }
            if(asset_To==CUSTOM_TOKEN_SYMBOL){ //DTH here
                const nWeb3 = new Web3(CUSTOM_NODE_URL);
                const balanceOf = await nWeb3.eth.getBalance(bridgeContract);
                if(tokenAmount>balanceOf){
                    alertify.alert("Warning!",BRIDGE_NO_COIN_MSG);
                    return false;
                }
                var data = ethContractInstance.methods.coinIn(DEFAULT_OUTPUT_CURRENCY).encodeABI();
                processTx(data,ethereumBridgeContract,web3GasPrice,gasLimit,tokenAmount,ETHERSCAN_URL);
            }
        }
        if(asset_Name=='usdt' || asset_Name=='usdc' || asset_Name=='dai' || asset_Name=='pax'){          
            
            if(asset_Name=='usdt'){    
                usdtContractInstance =  new myweb3.eth.Contract(usdtEthABI, usdtEthAddress, {
                    from: myAccountAddress, // default from address
                });
                const nWeb3 = new Web3(CUSTOM_NODE_URL);
                const balanceOf = await nWeb3.eth.getBalance(bridgeContract);
                if(tokenAmount>balanceOf){
                    alertify.alert("Warning!",BRIDGE_NO_COIN_MSG);
                    return false;
                }
                const allowance = await usdtContractInstance.methods.allowance(myAccountAddress,ethereumBridgeContract).call();               
                if(allowance<tAmount){
                    var result = usdtContractInstance.methods.approve(ethereumBridgeContract,approveAmount).send({
                        from: myAccountAddress,
                        to: usdtEthAddress,
                        gasPrice: web3GasPrice,
                        gasLimit: gasLimit,
                        value : 0,       
                    });

                    var data = ethContractInstance.methods.tokenIn(usdtEthAddress,tokenAmount,chainID,DEFAULT_OUTPUT_CURRENCY).encodeABI();
                    processTx(data,ethereumBridgeContract,web3GasPrice,gasLimit,0,ETHERSCAN_URL);
                   
                }else{
                    var data = ethContractInstance.methods.tokenIn(usdtEthAddress,tokenAmount,chainID,DEFAULT_OUTPUT_CURRENCY).encodeABI();
                    processTx(data,ethereumBridgeContract,web3GasPrice,gasLimit,0,ETHERSCAN_URL);
                }
            }
            if(asset_Name=='usdc'){
                assetContract = usdcAddress;
                usdcContractInstance =  new myweb3.eth.Contract(usdcABI, usdcAddress, {
                    from: myAccountAddress, // default from address
                });
                const allowance = await usdcContractInstance.methods.allowance(myAccountAddress,ethereumBridgeContract).call();
                if(allowance<tAmount){
                    var result = usdcContractInstance.methods.approve(ethereumBridgeContract,tokenAmount).send({
                        from: myAccountAddress,
                        to: usdcAddress,
                        gasPrice: web3GasPrice,
                        gasLimit: gasLimit,
                        value : 0,       
                    });

                    var data = ethContractInstance.methods.tokenIn(usdcAddress,tokenAmount,chainID).encodeABI();
                    processTx(data,ethereumBridgeContract,web3GasPrice,gasLimit,0,ETHERSCAN_URL);                  
                }else{
                    var data = ethContractInstance.methods.tokenIn(usdcAddress,tokenAmount,chainID).encodeABI();
                    processTx(data,ethereumBridgeContract,web3GasPrice,gasLimit,0,ETHERSCAN_URL);
                }
            }
            if(asset_Name=='dai'){
                assetContract = daiAddress;
                daiContractInstance =  new myweb3.eth.Contract(daiABI, daiAddress, {
                    from: myAccountAddress, // default from address
                });
                const allowance = await daiContractInstance.methods.allowance(myAccountAddress,ethereumBridgeContract).call();
                if(allowance<tAmount){
                    var result =  daiContractInstance.methods.approve(ethereumBridgeContract,tokenAmount).send({
                        from: myAccountAddress,
                        to: daiAddress,
                        gasPrice: web3GasPrice,
                        gasLimit: gasLimit,
                        value : 0,       
                    });

                    var data = ethContractInstance.methods.tokenIn(daiAddress,tokenAmount,chainID).encodeABI();
                    processTx(data,ethereumBridgeContract,web3GasPrice,gasLimit,0,ETHERSCAN_URL);
                }else{
                    var data = ethContractInstance.methods.tokenIn(daiAddress,tokenAmount,chainID).encodeABI();
                    processTx(data,ethereumBridgeContract,web3GasPrice,gasLimit,0,ETHERSCAN_URL);
                }
            }
            if(asset_Name=='pax'){
                assetContract = paxAddress;
                paxContractInstance =  new myweb3.eth.Contract(usdcABI, paxAddress, {
                    from: myAccountAddress, // default from address
                });
                const allowance = await paxContractInstance.methods.allowance(myAccountAddress,ethereumBridgeContract).call();
                if(allowance<tAmount){
                    var result = paxContractInstance.methods.approve(ethereumBridgeContract,tokenAmount).send({
                        from: myAccountAddress,
                        to: paxAddress,
                        gasPrice: web3GasPrice,
                        gasLimit: gasLimit,
                        value : 0,       
                    });
                    var data = ethContractInstance.methods.tokenIn(paxAddress,tokenAmount,chainID).encodeABI();
                    processTx(data,ethereumBridgeContract,web3GasPrice,gasLimit,0,ETHERSCAN_URL);
                }else{
                    var data = ethContractInstance.methods.tokenIn(paxAddress,tokenAmount,chainID).encodeABI();
                    processTx(data,ethereumBridgeContract,web3GasPrice,gasLimit,0,ETHERSCAN_URL);
                }
            }
               
        }
    }
   
    //dith network
    if(network_From=='dith'){
        ethContractInstance = new myweb3.eth.Contract(dithereumABI, bridgeContract, {
            from: myAccountAddress, // default from address
        });
       
        var gasLimit = 200000;
        const web3GasPrice = await myweb3.eth.getGasPrice();
        if(asset_To=='eth'){
            usdtContractInstance =  new myweb3.eth.Contract(ethDthABI, ethDthAddress, {
                from: myAccountAddress, // default from address
            });
            const allowance = await usdtContractInstance.methods.allowance(myAccountAddress,x ).call();
           
            if(allowance<tAmount){
                var result = usdtContractInstance.methods.approve(bridgeContract,approveAmount).send({
                    from: myAccountAddress,
                    to: ethDthAddress,
                    gasPrice: web3GasPrice,
                    gasLimit: gasLimit,
                    value : 0,       
                });

                var data = ethContractInstance.methods.tokenIn(ethDthAddress,tokenAmount,chainID).encodeABI();
                processTx(data,bridgeContract,web3GasPrice,gasLimit,0,CUSTOM_SCAN_URL);
               
            }else{
                var data = ethContractInstance.methods.tokenIn(ethDthAddress,tokenAmount,chainID).encodeABI();
                processTx(data,bridgeContract,web3GasPrice,gasLimit,0,CUSTOM_SCAN_URL);
            }
        }
        if(asset_To=='usdt' || asset_To=='usdc' || asset_To=='dai' || asset_To=='pax'){          
            
            if(asset_To=='usdt'){ 
                usdtContractInstance =  new myweb3.eth.Contract(usdtEthABI, usdtEthAddress, {
                    from: myAccountAddress, // default from address
                });
                const allowance = await usdtContractInstance.methods.allowance(myAccountAddress,bridgeContract).call();
               
                if(allowance<tAmount){
                    var result = usdtContractInstance.methods.approve(bridgeContract,approveAmount).send({
                        from: myAccountAddress,
                        to: usdtEthAddress,
                        gasPrice: web3GasPrice,
                        gasLimit: gasLimit,
                        value : 0,       
                    });
    
                    var data = ethContractInstance.methods.tokenIn(usdtEthAddress,tokenAmount,chainID).encodeABI();
                    processTx(data,bridgeContract,web3GasPrice,gasLimit,0,CUSTOM_SCAN_URL);
                   
                }else{
                    var data = ethContractInstance.methods.tokenIn(usdtEthAddress,tokenAmount,chainID).encodeABI();
                    processTx(data,bridgeContract,web3GasPrice,gasLimit,0,CUSTOM_SCAN_URL);
                }

            }
            if(asset_To=='usdc'){
                usdcContractInstance =  new myweb3.eth.Contract(usdcABI, usdcAddress, {
                    from: myAccountAddress, // default from address
                });
                const allowance = await usdcContractInstance.methods.allowance(myAccountAddress,bridgeContract).call();
               
                if(allowance<tAmount){
                    var result = usdcContractInstance.methods.approve(bridgeContract,approveAmount).send({
                        from: myAccountAddress,
                        to: usdcAddress,
                        gasPrice: web3GasPrice,
                        gasLimit: gasLimit,
                        value : 0,       
                    });
    
                    var data = ethContractInstance.methods.tokenIn(usdcAddress,tokenAmount,chainID).encodeABI();
                    processTx(data,bridgeContract,web3GasPrice,gasLimit,0,CUSTOM_SCAN_URL);
                   
                }else{
                    var data = ethContractInstance.methods.tokenIn(usdcAddress,tokenAmount,chainID).encodeABI();
                    processTx(data,bridgeContract,web3GasPrice,gasLimit,0,CUSTOM_SCAN_URL);
                }

            }
            
            if(asset_To=='dai'){
                daiContractInstance =  new myweb3.eth.Contract(daiABI, daiAddress, {
                    from: myAccountAddress, // default from address
                });
                const allowance = await daiContractInstance.methods.allowance(myAccountAddress,bridgeContract).call();
               
                if(allowance<tAmount){
                    var result = daiContractInstance.methods.approve(bridgeContract,approveAmount).send({
                        from: myAccountAddress,
                        to: daiAddress,
                        gasPrice: web3GasPrice,
                        gasLimit: gasLimit,
                        value : 0,       
                    });
    
                    var data = ethContractInstance.methods.tokenIn(daiAddress,tokenAmount,chainID).encodeABI();
                    processTx(data,bridgeContract,web3GasPrice,gasLimit,0,CUSTOM_SCAN_URL);
                   
                }else{
                    var data = ethContractInstance.methods.tokenIn(daiAddress,tokenAmount,chainID).encodeABI();
                    processTx(data,bridgeContract,web3GasPrice,gasLimit,0,CUSTOM_SCAN_URL);
                }

            }
            if(asset_To=='pax'){
                paxContractInstance =  new myweb3.eth.Contract(paxABI, paxAddress, {
                    from: myAccountAddress, // default from address
                });
                const allowance = await paxContractInstance.methods.allowance(myAccountAddress,bridgeContract).call();
               
                if(allowance<tAmount){
                    var result = paxContractInstance.methods.approve(bridgeContract,approveAmount).send({
                        from: myAccountAddress,
                        to: paxAddress,
                        gasPrice: web3GasPrice,
                        gasLimit: gasLimit,
                        value : 0,       
                    });
    
                    var data = ethContractInstance.methods.tokenIn(paxAddress,tokenAmount,chainID).encodeABI();
                    processTx(data,bridgeContract,web3GasPrice,gasLimit,0,CUSTOM_SCAN_URL);
                   
                }else{
                    var data = ethContractInstance.methods.tokenIn(paxAddress,tokenAmount,chainID).encodeABI();
                    processTx(data,bridgeContract,web3GasPrice,gasLimit,0,CUSTOM_SCAN_URL);
                }

            }
        }

            if(asset_To=='bnb'){
                bscContractInstance = new myweb3.eth.Contract(binanceBridgeABI, binanceBridgeContract, {
                    from: myAccountAddress, // default from address
                });
                
                var gasLimit = 200000;
                const web3GasPrice = await myweb3.eth.getGasPrice();
                usdtContractInstance =  new myweb3.eth.Contract(bnbDthABI, bnbDthAddress, {
                    from: myAccountAddress, // default from address
                });
                const allowance = await usdtContractInstance.methods.allowance(myAccountAddress,bridgeContract).call();
               
                if(allowance<tAmount){
                    var result = usdtContractInstance.methods.approve(bridgeContract,approveAmount).send({
                        from: myAccountAddress,
                        to: bnbDthAddress,
                        gasPrice: web3GasPrice,
                        gasLimit: gasLimit,
                        value : 0,       
                    });
    
                    var data = ethContractInstance.methods.tokenIn(bnbDthAddress,tokenAmount,chainID).encodeABI();
                    processTx(data,bridgeContract,web3GasPrice,gasLimit,0,CUSTOM_SCAN_URL);
                   
                }else{
                    var data = ethContractInstance.methods.tokenIn(bnbDthAddress,tokenAmount,chainID).encodeABI();
                    processTx(data,bridgeContract,web3GasPrice,gasLimit,0,CUSTOM_SCAN_URL);
                }
            }
    
            if(asset_To=='usdtbsc'){
                bscContractInstance = new myweb3.eth.Contract(binanceBridgeABI, binanceBridgeContract, {
                    from: myAccountAddress, // default from address
                });
               
                var gasLimit = 200000;
                const web3GasPrice = await myweb3.eth.getGasPrice();
                usdtContractInstance =  new myweb3.eth.Contract(usdtBscABI, usdtBscAddress, {
                    from: myAccountAddress, // default from address
                });
                const allowance = await usdtContractInstance.methods.allowance(myAccountAddress,bridgeContract).call();
              
                if(allowance<tAmount){
                    var result = usdtContractInstance.methods.approve(bridgeContract,approveAmount).send({
                        from: myAccountAddress,
                        to: usdtBscAddress,
                        gasPrice: web3GasPrice,
                        gasLimit: gasLimit,
                        value : 0,       
                    });
    
                    var data = ethContractInstance.methods.tokenIn(usdtBscAddress,tokenAmount,chainID).encodeABI();
                    processTx(data,bridgeContract,web3GasPrice,gasLimit,0,CUSTOM_SCAN_URL);
                   
                }else{
                    var data = ethContractInstance.methods.tokenIn(usdtBscAddress,tokenAmount,chainID).encodeABI();
                    processTx(data,bridgeContract,web3GasPrice,gasLimit,0,CUSTOM_SCAN_URL);
                }
                    
            }
            if(asset_To=='busd'){
                                 
                var gasLimit = 200000;
                const web3GasPrice = await myweb3.eth.getGasPrice();
                usdtContractInstance =  new myweb3.eth.Contract(dusddDthABI, dusdDthAddress, {
                    from: myAccountAddress, // default from address
                });
                const allowance = await usdtContractInstance.methods.allowance(myAccountAddress,bridgeContract).call();
               
                if(allowance<tAmount){
                    var result = usdtContractInstance.methods.approve(bridgeContract,approveAmount).send({
                        from: myAccountAddress,
                        to: dusdDthAddress,
                        gasPrice: web3GasPrice,
                        gasLimit: gasLimit,
                        value : 0,       
                    });
    
                    var data = ethContractInstance.methods.tokenIn(dusdDthAddress,tokenAmount,chainID).encodeABI();
                    processTx(data,bridgeContract,web3GasPrice,gasLimit,0,CUSTOM_SCAN_URL);
                   
                }else{
                    var data = ethContractInstance.methods.tokenIn(dusdDthAddress,tokenAmount,chainID).encodeABI();
                    processTx(data,bridgeContract,web3GasPrice,gasLimit,0,CUSTOM_SCAN_URL);
                }
            }  

            if(network_To=='polygon'){
                polygonContractInstance = new myweb3.eth.Contract(polygonABI, polygonContract, {
                    from: myAccountAddress, // default from address
                });
                
                if(asset_To=='matic'){
                   
                    var gasLimit = 200000;
                    const web3GasPrice = await myweb3.eth.getGasPrice();
                    usdtContractInstance =  new myweb3.eth.Contract(maticdDthABI, maticDthAddress, {
                        from: myAccountAddress, // default from address
                    });
                    const allowance = await usdtContractInstance.methods.allowance(myAccountAddress,bridgeContract).call();
                   
                    if(allowance<tAmount){
                        var result = usdtContractInstance.methods.approve(bridgeContract,approveAmount).send({
                            from: myAccountAddress,
                            to: maticDthAddress,
                            gasPrice: web3GasPrice,
                            gasLimit: gasLimit,
                            value : 0,       
                        });
        
                        var data = ethContractInstance.methods.tokenIn(maticDthAddress,tokenAmount,chainID).encodeABI();
                        processTx(data,bridgeContract,web3GasPrice,gasLimit,0,CUSTOM_SCAN_URL);
                       
                    }else{
                        var data = ethContractInstance.methods.tokenIn(maticDthAddress,tokenAmount,chainID).encodeABI();
                        processTx(data,bridgeContract,web3GasPrice,gasLimit,0,CUSTOM_SCAN_URL);
                    }

                }
            }

            if(network_To=='heco'){
                hecoContractInstance = new myweb3.eth.Contract(hecoABI, hecoContract, {
                    from: myAccountAddress, // default from address
                });
                
                if(asset_To='ht'){
                    var gasLimit = 200000;
                    const web3GasPrice = await myweb3.eth.getGasPrice();
                   // var data = hecoContractInstance.methods.coinIn().encodeABI();
                   usdtContractInstance =  new myweb3.eth.Contract(htDthABI, htDthAddress, {
                    from: myAccountAddress, // default from address
                });
                const allowance = await usdtContractInstance.methods.allowance(myAccountAddress,bridgeContract).call();
               
                if(allowance<tAmount){
                    var result = usdtContractInstance.methods.approve(bridgeContract,approveAmount).send({
                        from: myAccountAddress,
                        to: htDthAddress,
                        gasPrice: web3GasPrice,
                        gasLimit: gasLimit,
                        value : 0,       
                    });
    
                    var data = ethContractInstance.methods.tokenIn(htDthAddress,tokenAmount,chainID).encodeABI();
                    processTx(data,bridgeContract,web3GasPrice,gasLimit,0,CUSTOM_SCAN_URL);
                   
                }else{
                    var data = ethContractInstance.methods.tokenIn(htDthAddress,tokenAmount,chainID).encodeABI();
                    processTx(data,bridgeContract,web3GasPrice,gasLimit,0,CUSTOM_SCAN_URL);
                }                
            }
            }
            if(network_To=='trx'){
                if(asset_To=='trx'){
                    let result = await tronContractInstance.coinIn().send({
                        feeLimit: 50000000,
                        callValue: tokenAmount,
                        from: global.userAddress
                    });
                        alertify.alert('Success','Please wait upto 5 min for your coins to reflect.<br>' +
                        'You can check transaction here, ' +
                        '<a target="_blank" href="'+TRONSCAN_URL+result+'"><b>click here</b></a>');
                }
            }
    }
    //bsc network
    if(network_From=='bsc'){
        bscContractInstance = new myweb3.eth.Contract(binanceBridgeABI, binanceBridgeContract, {
            from: myAccountAddress, // default from address
        });
        
       
        var gasLimit = 200000;
        const web3GasPrice = await myweb3.eth.getGasPrice();

        if(asset_Name=='bnb'){
            if(asset_To=='dbnb'){
                const nWeb3 = new Web3(CUSTOM_NODE_URL);
                usdtContractInstance =  new nWeb3.eth.Contract(bnbDthABI, bnbDthAddress, {
                from: myAccountAddress, // default from address
                });
                const balanceOf = await usdtContractInstance.methods.balanceOf(bridgeContract).call();               
                if(tokenAmount>balanceOf){
                alertify.alert("Warning!",BRIDGE_NO_COIN_MSG);
                return false;
                }
                var data = bscContractInstance.methods.coinIn(bnbDthAddress).encodeABI();
                processTx(data,binanceBridgeContract,web3GasPrice,gasLimit,tokenAmount,BSCSCAN_URL);
            }
            if(asset_To==CUSTOM_TOKEN_SYMBOL){ //DTH here
                const nWeb3 = new Web3(CUSTOM_NODE_URL);
                const balanceOf = await nWeb3.eth.getBalance(bridgeContract);
                if(tokenAmount>balanceOf){
                    alertify.alert("Warning!",BRIDGE_NO_COIN_MSG);
                    return false;
                }
                var data = bscContractInstance.methods.coinIn(DEFAULT_OUTPUT_CURRENCY).encodeABI();
                processTx(data,binanceBridgeContract,web3GasPrice,gasLimit,tokenAmount,BSCSCAN_URL);
            }
        }

        if(asset_Name=='usdtbsc'){
            var usdtbscContractInstance =  new myweb3.eth.Contract(usdtBscABI, usdtBscAddress, {
                from: myAccountAddress, // default from address
            });
                const nWeb3 = new Web3(CUSTOM_NODE_URL);
                const balanceOf = await nWeb3.eth.getBalance(bridgeContract);
                if(tokenAmount>balanceOf){
                    alertify.alert("Warning!",BRIDGE_NO_COIN_MSG);
                    return false;
                }
            const allowance = await usdtbscContractInstance.methods.allowance(myAccountAddress,binanceBridgeContract).call();
            if(allowance<tAmount){
                var result = usdtbscContractInstance.methods.approve(binanceBridgeContract,approveAmount).send({
                    from: myAccountAddress,
                    to: usdtBscAddress,
                    gasPrice: web3GasPrice,
                    gasLimit: gasLimit,
                    value : 0,       
                });
                var data = bscContractInstance.methods.tokenIn(usdtBscAddress,tokenAmount,chainID,DEFAULT_OUTPUT_CURRENCY).encodeABI();
                processTx(data,binanceBridgeContract,web3GasPrice,gasLimit,0,BSCSCAN_URL);     
            }else{
                var data = bscContractInstance.methods.tokenIn(usdtBscAddress,tokenAmount,chainID,DEFAULT_OUTPUT_CURRENCY).encodeABI();
                processTx(data,binanceBridgeContract,web3GasPrice,gasLimit,0,BSCSCAN_URL);     
            }            
        }
        if(asset_Name=='busd'){
            var busdbscContractInstance =  new myweb3.eth.Contract(busdBscABI, busdBscAddress, {
                from: myAccountAddress, // default from address
            });
            const allowance = await busdbscContractInstance.methods.allowance(myAccountAddress,binanceBridgeContract).call();
            if(allowance<tAmount){
                var result = busdbscContractInstance.methods.approve(binanceBridgeContract,tokenAmount).send({
                    from: myAccountAddress,
                    to: busdBscAddress,
                    gasPrice: web3GasPrice,
                    gasLimit: gasLimit,
                    value : 0,       
                });
                var data = bscContractInstance.methods.tokenIn(busdBscAddress,tokenAmount,chainID).encodeABI();
                processTx(data,binanceBridgeContract,web3GasPrice,gasLimit,0,BSCSCAN_URL);      
            }else{
                var data = bscContractInstance.methods.tokenIn(busdBscAddress,tokenAmount,chainID).encodeABI();
                processTx(data,binanceBridgeContract,web3GasPrice,gasLimit,0,BSCSCAN_URL);   
            } 
            
        }
    }
    //polygon network
    if(network_From=='polygon'){
        polygonContractInstance = new myweb3.eth.Contract(polygonBridgeABI, polygonBridgeContract, {
            from: myAccountAddress, // default from address
        });
        
       
        var gasLimit = 200000;
        const web3GasPrice = await myweb3.eth.getGasPrice();
        if(asset_Name=='matic'){
            if(asset_To=='dmatic'){
                const nWeb3 = new Web3(CUSTOM_NODE_URL);
                usdtContractInstance =  new nWeb3.eth.Contract(maticdDthABI, maticDthAddress, {
                from: myAccountAddress, // default from address
                });
                const balanceOf = await usdtContractInstance.methods.balanceOf(bridgeContract).call();
                if(tokenAmount>balanceOf){
                alertify.alert("Warning!",BRIDGE_NO_COIN_MSG);
                return false;
                }
                var data = polygonContractInstance.methods.coinIn(maticDthAddress).encodeABI();
                processTx(data,polygonBridgeContract,web3GasPrice,gasLimit,tokenAmount,POLYSCAN_URL);   
            }
            if(asset_To==CUSTOM_TOKEN_SYMBOL){ // DTH here
                const nWeb3 = new Web3(CUSTOM_NODE_URL);
                const balanceOf = await nWeb3.eth.getBalance(bridgeContract);
                if(tokenAmount>balanceOf){
                    alertify.alert("Warning!",BRIDGE_NO_COIN_MSG);
                    return false;
                }
                var data = polygonContractInstance.methods.coinIn(DEFAULT_OUTPUT_CURRENCY).encodeABI();
                processTx(data,polygonBridgeContract,web3GasPrice,gasLimit,tokenAmount,POLYSCAN_URL);
            }
        }
                 
    }
    //heco network
    if(network_From=='heco'){
        hecoContractInstance = new myweb3.eth.Contract(hecoABI, hecoContract, {
            from: myAccountAddress, // default from address
        });
       
       
        var gasLimit = 200000;
        const web3GasPrice = await myweb3.eth.getGasPrice();
        var data = hecoContractInstance.methods.coinIn().encodeABI();
        processTx(data,hecoContract,web3GasPrice,gasLimit,tokenAmount,HECOSCAN_URL);            
    }
    //trx network
    if(network_From=='trx'){
        var contractInfo = await tronWeb.trx.getContract(tronContract);
        tronContractInstance = await tronWeb.contract(contractInfo.abi.entrys,tronContract);
        //tronContractInstance = await tronWeb.contract(JSON.parse('{"entrys":[{"inputs":[{"indexed":true,"name":"user","type":"address"},{"name":"value","type":"uint256"}],"name":"CoinIn","type":"Event"},{"inputs":[{"indexed":true,"name":"user","type":"address"},{"name":"value","type":"uint256"}],"name":"CoinOut","type":"Event"},{"inputs":[{"indexed":true,"name":"user","type":"address"},{"name":"value","type":"uint256"}],"name":"CoinOutFailed","type":"Event"},{"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"Event"},{"inputs":[{"indexed":true,"name":"tokenAddress","type":"address"},{"indexed":true,"name":"user","type":"address"},{"name":"value","type":"uint256"}],"name":"TokenIn","type":"Event"},{"inputs":[{"indexed":true,"name":"tokenAddress","type":"address"},{"indexed":true,"name":"user","type":"address"},{"name":"value","type":"uint256"}],"name":"TokenOut","type":"Event"},{"inputs":[{"indexed":true,"name":"tokenAddress","type":"address"},{"indexed":true,"name":"user","type":"address"},{"name":"value","type":"uint256"}],"name":"TokenOutFailed","type":"Event"},{"name":"acceptOwnership","stateMutability":"Nonpayable","type":"Function"},{"inputs":[{"name":"_signer","type":"address"}],"name":"changeSigner","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"bool"}],"name":"coinIn","stateMutability":"Payable","type":"Function"},{"outputs":[{"type":"bool"}],"inputs":[{"name":"user","type":"address"},{"name":"amount","type":"uint256"}],"name":"coinOut","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"address"}],"name":"signer","stateMutability":"View","type":"Function"},{"outputs":[{"type":"bool"}],"inputs":[{"name":"tokenAddress","type":"address"},{"name":"tokenAmount","type":"uint256"}],"name":"tokenIn","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"bool"}],"inputs":[{"name":"tokenAddress","type":"address"},{"name":"user","type":"address"},{"name":"tokenAmount","type":"uint256"}],"name":"tokenOut","stateMutability":"Nonpayable","type":"Function"},{"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","stateMutability":"Nonpayable","type":"Function"},{"stateMutability":"Payable","type":"Receive"}]}',tronContract));
        tokenAmount = $('#tokenAmount').val();
        tokenAmount = tokenAmount*1000000;
        if(asset_Name=='trx'){
            let result = await tronContractInstance.coinIn().send({
                feeLimit: 50000000,
                callValue: tokenAmount,
                from: global.userAddress
            });
            //if(result){
                alertify.alert('Success','Please wait upto 5 min for your coins to reflect.<br>' +
                'You can check transaction here, ' +
                '<a target="_blank" href="'+TRONSCAN_URL+result+'"><b>click here</b></a>');
            
          //  }else{
           //     alertify.alert("Fail","Transaction Fail, Please Try again.");
         //   }
        }
        if(asset_To=='usdt'){
                    let result = await tronContractInstance.tokenIn(usdtTronAddress,tokenAmount).send({
                        feeLimit: 5000000,
                        callValue: 0,
                        from: global.userAddress
                    });
                  //  if(result){
                        alertify.alert('Success','Please wait upto 5 min for your coins to reflect.<br>' +
					                'You can check transaction here, ' +
                                    '<a target="_blank" href="'+ETHERSCAN_URL+result.transactionHash+'"><b>click here</b></a>');
                    
                   // }else{
                  //      alertify.alert("Fail","Transaction Fail, Please Try again.");
                  //  }
                
        }
    }
}, function(){ });
})

// TRON CODE
let intervalID = setInterval(async function() {
    if (typeof window.tronWeb == "object") {
    	window.tronWeb.on("addressChanged", showAccountInfo);
        var userAddress = await window.tronWeb.defaultAddress.base58;
        var userAddressHex = await window.tronWeb.defaultAddress.hex;    
        
        if(global.tronUserAddress=='' && userAddress!=''){
            global.tronUserAddress =  userAddress;
            global.tronUserAddressHex =  userAddressHex;               	
        }
        if(global.tronUserAddress!='' && global.tronUserAddress!=userAddress){
            global.tronUserAddress =  userAddress;
            global.tronUserAddressHex =  userAddressHex;    
            location.reload();
        }
    }
    	
}, 1000);

function showAccountInfo(){    
        const shortAddress = getUserAddress(global.tronUserAddress);
        $('#connectWallet,#connectWallet1').html(shortAddress);
        $('#connectWallet,#connectWallet1').attr("href", "https://tronscan.org/#/address/"+global.tronUserAddress).attr('target','_blank');
        $('#connectWallet1').hide();
        $('#btnNext').show();
}
