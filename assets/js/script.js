var myAccountAddress,contractInstance;
var network_From = 'eth';
var network_To = 'dith';
var asset_Name = 'usdt';
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
                $('#connectWallet1').hide();
                $('#btnNext').show();
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
                        $('#btnNext').show();
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
    
    if(name=="eth"){
        $('#ethCheck').show();
        $('#trxCheck').hide();
        $('#solCheck').hide();
        $('#bnbCheck').hide();
        $('#maticCheck').hide();
        $('#hecoCheck').hide();
        dName = "Ethereum Network";
        $('#networkFromUL').html('<img class="icons" src="assets/img/eth-icon.svg"> ETH');
        $('#netwrokFromUL li').addClass("disabled");
        $('#ethNetwork').removeClass("disabled");
    }
    if(name=="bnb"){
        console.log('bkb');
        $('#bnbCheck').show();
        $('#ethCheck').hide();
        $('#trxCheck').hide();
        $('#solCheck').hide();
        $('#maticCheck').hide();
        $('#hecoCheck').hide();
        dName = "Binance Network";
        $('#networkFromUL').html('<img class="icons" src="assets/img/bnb-logo.png"> BNB');
        $('#netwrokFromUL li').addClass("disabled");
        $('#bnbNetwork').removeClass("disabled");
        network_From = 'bsc';
    }
    if(name=="trx"){
        $('#trxCheck').show();
        $('#ethCheck').hide();
        $('#solCheck').hide();
        $('#bnbCheck').hide();
        $('#maticCheck').hide();
        $('#hecoCheck').hide();
        dName = "TRX Network";
        $('#networkFromUL').html('<img class="icons" src="assets/img/tron-logo.png"> TRX');
        $('#netwrokFromUL li').addClass("disabled");
        $('#trxNetwork').removeClass("disabled");
        network_From = 'trx';
    }
    if(name=="matic"){
        $('#maticCheck').show();
        $('#bnbCheck').hide();
        $('#ethCheck').hide();
        $('#trxCheck').hide();
        $('#solCheck').hide();
        $('#hecoCheck').hide();
        dName = "Polygon Network";
        $('#networkFromUL').html('<img class="icons" src="assets/img/tether-usdt-logo.png"> MATIC');
        $('#netwrokFromUL li').addClass("disabled");
        $('#maticNetwork').removeClass("disabled");
    }
    if(name=="ht"){
        $('#hecoCheck').show();
        $('#maticCheck').hide();
        $('#bnbCheck').hide();
        $('#ethCheck').hide();
        $('#trxCheck').hide();
        $('#solCheck').hide();
        dName = "Heco Network";
        $('#networkFromUL').html('<img class="icons" src="assets/img/heco-logo.png"> HT');
        $('#netwrokFromUL li').addClass("disabled");
        $('#hecoNetwork').removeClass("disabled");
    }
    if(name=="usdt"){
        $('#networkFromUL').html('<img class="icons" src="assets/img/tether-usdt-logo.png"> USDT');
        $('#netwrokFromUL li').removeClass("disabled");
        asset_Name = 'usdt';
    }
    if(name=="usdc"){
        $('#networkFromUL').html('<img class="icons" src="assets/img/usdc-logo.png"> USDC');
        $('#netwrokFromUL li').removeClass("disabled");
        asset_Name = 'usdc';
    }
    if(name=="busd"){
        $('#networkFromUL').html('<img class="icons" src="assets/img/busd-logo.png"> BUSD');
        $('#netwrokFromUL li').removeClass("disabled");
        asset_Name = 'busd';
    }
    if(name=="dai"){
        $('#networkFromUL').html('<img class="icons" src="assets/img/dai-logo.png"> DAI');
        $('#netwrokFromUL li').removeClass("disabled");
        asset_Name = 'dai';
    }
    if(name=="pax"){
        $('#networkFromUL').html('<img class="icons" src="assets/img/pax-logo.png"> PAX');
        $('#netwrokFromUL li').removeClass("disabled");
        asset_Name = 'pax';
    }

    $('#networkFrom').text(dName);
});

//network From select
$(document).on('click', '#networkFromUL li', function () {
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
        network_From = 'eth';
        $('#networkToUL li').removeClass("disabled");
        $('#ethNetworkTo').addClass("disabled");
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
        network_From = 'trx';
        $('#networkToUL li').removeClass("disabled");
        $('#trxNetworkTo').addClass("disabled");
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
        network_From = 'sol';
        $('#networkToUL li').removeClass("disabled");
        $('#solNetworkTo').addClass("disabled");
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
        network_From = 'bsc';
        $('#networkToUL li').removeClass("disabled");
        $('#bnbNetworkTo').addClass("disabled");
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
        network_From = 'polygon';
        $('#networkToUL li').removeClass("disabled");
        $('#maticNetworkTo').addClass("disabled");
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
        network_From = 'heco';
        $('#networkToUL li').removeClass("disabled");
        $('#hecoNetworkTo').addClass("disabled");
    }

    $('#networkFrom').text(name);
})

//network To select
$(document).on('click', '#networkToUL li', function () {
    var name = $(this).data('name');
    if(name=='ethNetworkTo'){
        name = 'Ethereum Network';
        $('#ethCheckTo').show();
        $('#dithCheckTo').hide();
        $('#trxCheckTo').hide();
        $('#solCheckTo').hide();
        $('#bnbCheckTo').hide();
        $('#maticCheckTo').hide();
        network_To = 'eth';
        //$('#networkToUL li').addClass("disabled");
        $('#ethNetworkTo').removeClass("disabled");
    }
    if(name=='dithNetworkTo'){
        name = 'Dithereum Network';
        $('#dithCheckTo').show();
        $('#trxCheckTo').hide();
        $('#solCheckTo').hide();
        $('#bnbCheckTo').hide();
        $('#ethCheckTo').hide();
        $('#maticCheckTo').hide();
        network_To = 'dith';
        //$('#networkToUL li').addClass("disabled");
        $('#dithNetworkTo').removeClass("disabled");
    }
    if(name=='trxNetworkTo'){
        name = 'TRX Network';
        $('#trxCheckTo').show();
        $('#dithCheckTo').hide();
        $('#solCheckTo').hide();
        $('#bnbCheckTo').hide();
        $('#ethCheckTo').hide();
        $('#maticCheckTo').hide();
        network_To = 'trx';
        //$('#networkToUL li').addClass("disabled");
        $('#trxNetworkTo').removeClass("disabled");
    }
    if(name=='solNetworkTo'){
        name = 'SOL Network';
        $('#solCheckTo').show();
        $('#dithCheckTo').hide();
        $('#trxCheckTo').hide();
        $('#bnbCheckTo').hide();
        $('#ethCheckTo').hide();
        $('#maticCheckTo').hide();
        network_To = 'sol';
        //$('#networkToUL li').addClass("disabled");
        $('#solNetworkTo').removeClass("disabled");
    }
    if(name=='bnbNetworkTo'){
        name = 'Binance Network';
        $('#bnbCheckTo').show();
        $('#dithCheckTo').hide();
        $('#trxCheckTo').hide();
        $('#solCheckTo').hide();
        $('#ethCheckTo').hide();
        $('#maticCheckTo').hide();
        network_To = 'bsc';
        //$('#networkToUL li').addClass("disabled");
        $('#bnbNetworkTo').removeClass("disabled");
    }
    if(name=='maticNetworkTo'){
        name = 'Polygon Network';
        $('#maticCheckTo').show();
        $('#bnbCheckTo').hide();
        $('#dithCheckTo').hide();
        $('#trxCheckTo').hide();
        $('#solCheckTo').hide();
        $('#ethCheckTo').hide();
        network_To = 'polygon';
        //$('#networkToUL li').addClass("disabled");
        $('#maticNetworkTo').removeClass("disabled");
    }

    $('#networkTo').text(name);
})

//switch network button
$('#btnSwitchNetwork').click(function(e){
    e.preventDefault();
    console.log(network_From);
    if(network_From=='eth'){
        $('#networkTo').text('Ethereum Network');
        if(network_To=='trx'){
            network_From = 'trx';
            $('#networFrom').text('TRX Network');
        }
        
        
        return true;
        
        
    }
    if(network_From=='trx'){
        $('#networkTo').text('TRX Network');
        network_To = 'trx';
        
    }
    if(network_From=='sol'){
        $('#networkTo').text('SOL Network');
        network_To = 'sol';
        
    }
    if(network_From=='bsc'){
        $('#networkTo').text('Binance Network');
        network_To = 'bsc';
        
    }
    if(network_From=='polygon'){
        $('#networkTo').text('Polygon Network');
        network_To = 'polygon';
        
    }
    if(network_From=='heco'){
        $('#networkTo').text('Heco Network');
        network_To = 'heco';
        
    }

    if(network_To=='eth'){
        $('#networkFrom').text('Ethereum Network');
        network_From = 'eth';
        
    }
    if(network_To=='trx'){
        $('#networkFrom').text('TRX Network');
        network_From = 'trx';
        
    }
    if(network_To=='sol'){
        $('#networkFrom').text('SOL Network');
        network_From = 'sol';
        
    }
    if(network_To=='bsc'){
        $('#networkFrom').text('Binance Network');
        network_From = 'bsc';
        
    }
    if(network_To=='polygon'){
        $('#networkFrom').text('Polygon Network');
        network_From = 'polygon';
        
    }
    if(network_To=='heco'){
        $('#networkFrom').text('Heco Network');
        network_From = 'heco';
        
    }
});
//add networks Dithereum
async function addNetowrk(network){
    //Ethereum Network
    if(network=='ETH'){
        if(window.ethereum) {
            checkAccount();
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
            checkAccount();
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
            checkAccount();
        }
    }

}

//coinIn code 

$('#btnNext').click(async function(){
    //eth network
    if(network_From=='eth'){
        ethContractInstance = new myweb3.eth.Contract(ethereumABI, ethereumContract, {
            from: myAccountAddress, // default from address
        });
        var tokenAmount = $('#tokenAmount').val();
        if(tokenAmount==0 || tokenAmount=="" || tokenAmount<0){
            swal("Warning !", "Please enter Amount.", "warning");
            return false;
        }
        tokenAmount = tokenAmount*1e18;
        var gasLimit = 200000;
        const web3GasPrice = await myweb3.eth.getGasPrice();
        if(asset_Name=='eth'){
            
                var result = await ethContractInstance.methods.coinIn().send({
                    from: myAccountAddress,
                    to: ethereumContract,
                    gasPrice: web3GasPrice,
                    gasLimit: gasLimit,
                    value : tokenAmount,       
                });
                if(result){
                    swal("Success !", "Please wait upto 5 min for your coins to reflect.", "success");
                
                }else{
                    swal("Warning !", "Transaction Fail, Please Try again.", "warning");
                }
        }
        if(asset_Name=='usdt' || asset_Name=='usdc' || asset_Name=='dai' || asset_Name=='pax'){          
            
            if(asset_Name=='usdt'){    
                usdtContractInstance =  new myweb3.eth.Contract(usdtABI, usdtAddress, {
                    from: myAccountAddress, // default from address
                });
                const allowance = await usdtContractInstance.methods.allowance(myAccountAddress,ethereumContract).call();
                if(allowance<1){
                    var result = await usdtContractInstance.methods.approve(ethereumContract,tokenAmount).send({
                        from: myAccountAddress,
                        to: usdtAddress,
                        gasPrice: web3GasPrice,
                        gasLimit: gasLimit,
                        value : 0,       
                    });
                    if(result){
                        var result = await ethContractInstance.methods.tokenIn(usdtAddress,tokenAmount).send({
                            from: myAccountAddress,
                            to: ethereumContract,
                            gasPrice: web3GasPrice,
                            gasLimit: gasLimit,
                            value : 0,       
                        });
                        if(result){
                            swal("Success !", "Please wait upto 5 min for your coins to reflect.", "success");
                        
                        }else{
                            swal("Warning !", "Transaction Fail, Please Try again.", "warning");
                        }
                    }else{
                        swal("Warning !", "Transaction Fail, Please Try again.", "warning");
                    }
                }else{
                    var result = await ethContractInstance.methods.tokenIn(usdtAddress,tokenAmount).send({
                        from: myAccountAddress,
                        to: ethereumContract,
                        gasPrice: web3GasPrice,
                        gasLimit: gasLimit,
                        value : 0,       
                    });
                    if(result){
                        swal("Success !", "Please wait upto 5 min for your coins to reflect.", "success");
                    
                    }else{
                        swal("Warning !", "Transaction Fail, Please Try again.", "warning");
                    }
                }
            }
            if(asset_Name=='usdc'){
                assetContract = usdcAddress;
                usdcContractInstance =  new myweb3.eth.Contract(usdcABI, usdcAddress, {
                    from: myAccountAddress, // default from address
                });
                const allowance = await usdcContractInstance.methods.allowance(myAccountAddress,ethereumContract).call();
                if(allowance<1){
                    var result = await usdcContractInstance.methods.approve(ethereumContract,tokenAmount).send({
                        from: myAccountAddress,
                        to: usdcAddress,
                        gasPrice: web3GasPrice,
                        gasLimit: gasLimit,
                        value : 0,       
                    });
                    if(result){
                        var result = await ethContractInstance.methods.tokenIn(usdcAddress,tokenAmount).send({
                            from: myAccountAddress,
                            to: ethereumContract,
                            gasPrice: web3GasPrice,
                            gasLimit: gasLimit,
                            value : 0,       
                        });
                        if(result){
                            swal("Success !", "Please wait upto 5 min for your coins to reflect.", "success");
                        
                        }else{
                            swal("Warning !", "Transaction Fail, Please Try again.", "warning");
                        }
                    }else{
                        swal("Warning !", "Transaction Fail, Please Try again.", "warning");
                    }
                }else{
                    var result = await ethContractInstance.methods.tokenIn(usdcAddress,tokenAmount).send({
                        from: myAccountAddress,
                        to: ethereumContract,
                        gasPrice: web3GasPrice,
                        gasLimit: gasLimit,
                        value : 0,       
                    });
                    if(result){
                        swal("Success !", "Please wait upto 5 min for your coins to reflect.", "success");
                    
                    }else{
                        swal("Warning !", "Transaction Fail, Please Try again.", "warning");
                    }
                }
            }
            if(asset_Name=='dai'){
                assetContract = daiAddress;
                daiContractInstance =  new myweb3.eth.Contract(daiABI, daiAddress, {
                    from: myAccountAddress, // default from address
                });
                const allowance = await daiContractInstance.methods.allowance(myAccountAddress,ethereumContract).call();
                if(allowance<1){
                    var result = await daiContractInstance.methods.approve(ethereumContract,tokenAmount).send({
                        from: myAccountAddress,
                        to: daiAddress,
                        gasPrice: web3GasPrice,
                        gasLimit: gasLimit,
                        value : 0,       
                    });
                    if(result){
                        var result = await ethContractInstance.methods.tokenIn(daiAddress,tokenAmount).send({
                            from: myAccountAddress,
                            to: ethereumContract,
                            gasPrice: web3GasPrice,
                            gasLimit: gasLimit,
                            value : 0,       
                        });
                        if(result){
                            swal("Success !", "Please wait upto 5 min for your coins to reflect.", "success");
                        
                        }else{
                            swal("Warning !", "Transaction Fail, Please Try again.", "warning");
                        }
                    }else{
                        swal("Warning !", "Transaction Fail, Please Try again.", "warning");
                    }
                }else{
                    var result = await ethContractInstance.methods.tokenIn(daiAddress,tokenAmount).send({
                        from: myAccountAddress,
                        to: ethereumContract,
                        gasPrice: web3GasPrice,
                        gasLimit: gasLimit,
                        value : 0,       
                    });
                    if(result){
                        swal("Success !", "Please wait upto 5 min for your coins to reflect.", "success");
                    
                    }else{
                        swal("Warning !", "Transaction Fail, Please Try again.", "warning");
                    }
                }
            }
            if(asset_Name=='pax'){
                assetContract = paxAddress;
                paxContractInstance =  new myweb3.eth.Contract(usdcABI, paxAddress, {
                    from: myAccountAddress, // default from address
                });
                const allowance = await paxContractInstance.methods.allowance(myAccountAddress,ethereumContract).call();
                if(allowance<1){
                    var result = await paxContractInstance.methods.approve(ethereumContract,tokenAmount).send({
                        from: myAccountAddress,
                        to: paxAddress,
                        gasPrice: web3GasPrice,
                        gasLimit: gasLimit,
                        value : 0,       
                    });
                    if(result){
                        var result = await ethContractInstance.methods.tokenIn(paxAddress,tokenAmount).send({
                            from: myAccountAddress,
                            to: ethereumContract,
                            gasPrice: web3GasPrice,
                            gasLimit: gasLimit,
                            value : 0,       
                        });
                        if(result){
                            swal("Success !", "Please wait upto 5 min for your coins to reflect.", "success");
                        
                        }else{
                            swal("Warning !", "Transaction Fail, Please Try again.", "warning");
                        }
                    }else{
                        swal("Warning !", "Transaction Fail, Please Try again.", "warning");
                    }
                }else{
                    var result = await ethContractInstance.methods.tokenIn(paxAddress,tokenAmount).send({
                        from: myAccountAddress,
                        to: ethereumContract,
                        gasPrice: web3GasPrice,
                        gasLimit: gasLimit,
                        value : 0,       
                    });
                    if(result){
                        swal("Success !", "Please wait upto 5 min for your coins to reflect.", "success");
                    
                    }else{
                        swal("Warning !", "Transaction Fail, Please Try again.", "warning");
                    }
                }
            }

                

               
        }
    }
    //bsc network
    if(network_From=='bsc'){
        bscContractInstance = new myweb3.eth.Contract(bscABI, bscContract, {
            from: myAccountAddress, // default from address
        });
        var tokenAmount = $('#tokenAmount').val();
        if(tokenAmount==0 || tokenAmount=="" || tokenAmount<0){
            swal("Warning !", "Please enter Amount.", "warning");
            return false;
        }
        tokenAmount = tokenAmount*1e18;
        var gasLimit = 200000;
        const web3GasPrice = await myweb3.eth.getGasPrice();

        if(asset_Name=='bnb'){
            var result = await bscContractInstance.methods.coinIn().send({
                from: myAccountAddress,
                to: bscContract,
                gasPrice: web3GasPrice,
                gasLimit: gasLimit,
                value : tokenAmount,       
            });
            if(result){
                swal("Success !", "Please wait upto 5 min for your coins to reflect.", "success");
             
            }else{
                swal("Warning !", "Transaction Fail, Please Try again.", "warning");
            }
        }

        if(asset_Name=='usdt'){
                usdtContractInstance =  new myweb3.eth.Contract(usdtBscABI, usdtBscAddress, {
                    from: myAccountAddress, // default from address
                });
                const allowance = await usdtContractInstance.methods.allowance(myAccountAddress,bscContract).call();
                if(allowance<1){
                    var result = await usdtContractInstance.methods.approve(bscContract,tokenAmount).send({
                        from: myAccountAddress,
                        to: usdtBscAddress,
                        gasPrice: web3GasPrice,
                        gasLimit: gasLimit,
                        value : 0,       
                    });
                    if(result){
                        var result = await bscContractInstance.methods.tokenIn(usdtBscAddress,tokenAmount).send({
                            from: myAccountAddress,
                            to: bscContract,
                            gasPrice: web3GasPrice,
                            gasLimit: gasLimit,
                            value : 0,       
                        });
                        if(result){
                            swal("Success !", "Please wait upto 5 min for your coins to reflect.", "success");
                        
                        }else{
                            swal("Warning !", "Transaction Fail, Please Try again.", "warning");
                        }
                    }else{
                        swal("Warning !", "Transaction Fail, Please Try again.", "warning");
                    }
                }else{
                    var result = await bscContractInstance.methods.tokenIn(usdtBscAddress,tokenAmount).send({
                        from: myAccountAddress,
                        to: bscContract,
                        gasPrice: web3GasPrice,
                        gasLimit: gasLimit,
                        value : 0,       
                    });
                    if(result){
                        swal("Success !", "Please wait upto 5 min for your coins to reflect.", "success");
                    
                    }else{
                        swal("Warning !", "Transaction Fail, Please Try again.", "warning");
                    }
                }
            
               
        }
    }
    //polygon network
    if(network_From=='polygon'){
        polygonContractInstance = new myweb3.eth.Contract(polygonABI, polygonContract, {
            from: myAccountAddress, // default from address
        });
        var tokenAmount = $('#tokenAmount').val();
        if(tokenAmount==0 || tokenAmount=="" || tokenAmount<0){
            swal("Warning !", "Please enter Amount.", "warning");
            return false;
        }
        tokenAmount = tokenAmount*1e18;
        var gasLimit = 200000;
        const web3GasPrice = await myweb3.eth.getGasPrice();
            var result = await polygonContractInstance.methods.coinIn().send({
                from: myAccountAddress,
                to: polygonContract,
                gasPrice: web3GasPrice,
                gasLimit: gasLimit,
                value : tokenAmount,       
            });
            if(result){
                swal("Success !", "Please wait upto 5 min for your coins to reflect.", "success");
             
            }else{
                swal("Warning !", "Transaction Fail, Please Try again.", "warning");
            }
    }
    //heco network
    if(network_From=='heco'){
        hecoContractInstance = new myweb3.eth.Contract(hecoABI, hecoContract, {
            from: myAccountAddress, // default from address
        });
        var tokenAmount = $('#tokenAmount').val();
        if(tokenAmount==0 || tokenAmount=="" || tokenAmount<0){
            swal("Warning !", "Please enter Amount.", "warning");
            return false;
        }
        tokenAmount = tokenAmount*1e18;
        var gasLimit = 200000;
        const web3GasPrice = await myweb3.eth.getGasPrice();
            var result = await hecoContractInstance.methods.coinIn().send({
                from: myAccountAddress,
                to: hecoContract,
                gasPrice: web3GasPrice,
                gasLimit: gasLimit,
                value : tokenAmount,       
            });
            if(result){
                swal("Success !", "Please wait upto 5 min for your coins to reflect.", "success");
             
            }else{
                swal("Warning !", "Transaction Fail, Please Try again.", "warning");
            }
    }
    //trx network
    if(network_From=='trx'){
        console.log(tronContract);
        console.log(tronWeb);
        var contractInfo = await tronWeb.trx.getContract('0xb90aebe21b54391429204e0d9d8d8df6884d8580');
        tronContractInstance = await tronWeb.contract(contractInfo.abi.entrys,tronContract);
        //tronContractInstance = await tronWeb.contract(JSON.parse('{"entrys":[{"inputs":[{"indexed":true,"name":"user","type":"address"},{"name":"value","type":"uint256"}],"name":"CoinIn","type":"Event"},{"inputs":[{"indexed":true,"name":"user","type":"address"},{"name":"value","type":"uint256"}],"name":"CoinOut","type":"Event"},{"inputs":[{"indexed":true,"name":"user","type":"address"},{"name":"value","type":"uint256"}],"name":"CoinOutFailed","type":"Event"},{"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"Event"},{"inputs":[{"indexed":true,"name":"tokenAddress","type":"address"},{"indexed":true,"name":"user","type":"address"},{"name":"value","type":"uint256"}],"name":"TokenIn","type":"Event"},{"inputs":[{"indexed":true,"name":"tokenAddress","type":"address"},{"indexed":true,"name":"user","type":"address"},{"name":"value","type":"uint256"}],"name":"TokenOut","type":"Event"},{"inputs":[{"indexed":true,"name":"tokenAddress","type":"address"},{"indexed":true,"name":"user","type":"address"},{"name":"value","type":"uint256"}],"name":"TokenOutFailed","type":"Event"},{"name":"acceptOwnership","stateMutability":"Nonpayable","type":"Function"},{"inputs":[{"name":"_signer","type":"address"}],"name":"changeSigner","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"bool"}],"name":"coinIn","stateMutability":"Payable","type":"Function"},{"outputs":[{"type":"bool"}],"inputs":[{"name":"user","type":"address"},{"name":"amount","type":"uint256"}],"name":"coinOut","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"address"}],"name":"signer","stateMutability":"View","type":"Function"},{"outputs":[{"type":"bool"}],"inputs":[{"name":"tokenAddress","type":"address"},{"name":"tokenAmount","type":"uint256"}],"name":"tokenIn","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"bool"}],"inputs":[{"name":"tokenAddress","type":"address"},{"name":"user","type":"address"},{"name":"tokenAmount","type":"uint256"}],"name":"tokenOut","stateMutability":"Nonpayable","type":"Function"},{"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","stateMutability":"Nonpayable","type":"Function"},{"stateMutability":"Payable","type":"Receive"}]}',tronContract));
        var tokenAmount = $('#tokenAmount').val();
        if(tokenAmount==0 || tokenAmount=="" || tokenAmount<0){
            swal("Warning !", "Please enter Amount.", "warning");
            return false;
        }
        tokenAmount = tokenAmount*1000000;
        if(asset_Name=='trx'){
            let result = await tronContractInstance.coinIn().send({
                feeLimit: 5000000,
                callValue: tokenAmount,
                from: global.userAddress
            });
            if(result){
                swal("Success !", "Please wait upto 5 min for your coins to reflect.", "success");
            
            }else{
                swal("Warning !", "Transaction Fail, Please Try again.", "warning");
            }
        }
        if(asset_Name=='usdt'){
                var contractInfo = await tronWeb.trx.getContract(usdtTronAddress);
                usdtContractInstance = await tronWeb.contract(contractInfo.abi.entrys,usdtTronAddress);

                const allowance = await usdtContractInstance.allowance(myAccountAddress,tronContract).call();
        
                if(allowance<1){
                    var result = await usdtContractInstance.approve(tronContract,tokenAmount).send({
                        feeLimit: 5000000,
                        callValue: 0,
                        from: global.userAddress     
                    });
                    if(result){
                        let result = await tronContractInstance.tokenIn(usdtTronAddress,tokenAmount).send({
                            feeLimit: 5000000,
                            callValue: 0,
                            from: global.userAddress
                        });
                        if(result){
                            swal("Success !", "Please wait upto 5 min for your coins to reflect.", "success");
                        
                        }else{
                            swal("Warning !", "Transaction Fail, Please Try again.", "warning");
                        }
                    }else{
                        swal("Warning !", "Transaction Fail, Please Try again.", "warning");
                    }
                }else{
                    let result = await tronContractInstance.tokenIn(usdtTronAddress,tokenAmount).send({
                        feeLimit: 5000000,
                        callValue: 0,
                        from: global.userAddress
                    });
                    if(result){
                        swal("Success !", "Please wait upto 5 min for your coins to reflect.", "success");
                    
                    }else{
                        swal("Warning !", "Transaction Fail, Please Try again.", "warning");
                    }
                }
        }
    }
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
