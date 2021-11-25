var mysql = require('mysql');
const util = require('util');
const WebSocket = require('ws');
require('dotenv').config();
const Web3 = require("web3");
var Tx = require('ethereumjs-tx').Transaction;
var Contract = require('web3-eth-contract');
var Common = require('ethereumjs-common').default;

// HERE is some random contract i choosen from bscscan 
var LinkContractABI = '[{"inputs":[{"internalType":"contract ComptrollerInterface","name":"comptroller_","type":"address"},{"internalType":"contract InterestRateModel","name":"interestRateModel_","type":"address"},{"internalType":"uint256","name":"initialExchangeRateMantissa_","type":"uint256"},{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"},{"internalType":"uint8","name":"decimals_","type":"uint8"},{"internalType":"address payable","name":"admin_","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"cashPrior","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"interestAccumulated","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"borrowIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalBorrows","type":"uint256"}],"name":"AccrueInterest","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"borrower","type":"address"},{"indexed":false,"internalType":"uint256","name":"borrowAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"accountBorrows","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalBorrows","type":"uint256"}],"name":"Borrow","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"error","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"info","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"detail","type":"uint256"}],"name":"Failure","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"liquidator","type":"address"},{"indexed":false,"internalType":"address","name":"borrower","type":"address"},{"indexed":false,"internalType":"uint256","name":"repayAmount","type":"uint256"},{"indexed":false,"internalType":"address","name":"vTokenCollateral","type":"address"},{"indexed":false,"internalType":"uint256","name":"seizeTokens","type":"uint256"}],"name":"LiquidateBorrow","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"minter","type":"address"},{"indexed":false,"internalType":"uint256","name":"mintAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"mintTokens","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"oldAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"NewAdmin","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract ComptrollerInterface","name":"oldComptroller","type":"address"},{"indexed":false,"internalType":"contract ComptrollerInterface","name":"newComptroller","type":"address"}],"name":"NewComptroller","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract InterestRateModel","name":"oldInterestRateModel","type":"address"},{"indexed":false,"internalType":"contract InterestRateModel","name":"newInterestRateModel","type":"address"}],"name":"NewMarketInterestRateModel","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"oldPendingAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newPendingAdmin","type":"address"}],"name":"NewPendingAdmin","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"oldReserveFactorMantissa","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newReserveFactorMantissa","type":"uint256"}],"name":"NewReserveFactor","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"redeemer","type":"address"},{"indexed":false,"internalType":"uint256","name":"redeemAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"redeemTokens","type":"uint256"}],"name":"Redeem","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"payer","type":"address"},{"indexed":false,"internalType":"address","name":"borrower","type":"address"},{"indexed":false,"internalType":"uint256","name":"repayAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"accountBorrows","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalBorrows","type":"uint256"}],"name":"RepayBorrow","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"benefactor","type":"address"},{"indexed":false,"internalType":"uint256","name":"addAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newTotalReserves","type":"uint256"}],"name":"ReservesAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"admin","type":"address"},{"indexed":false,"internalType":"uint256","name":"reduceAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newTotalReserves","type":"uint256"}],"name":"ReservesReduced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Transfer","type":"event"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":false,"inputs":[],"name":"_acceptAdmin","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"reduceAmount","type":"uint256"}],"name":"_reduceReserves","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"contract ComptrollerInterface","name":"newComptroller","type":"address"}],"name":"_setComptroller","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"contract InterestRateModel","name":"newInterestRateModel","type":"address"}],"name":"_setInterestRateModel","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address payable","name":"newPendingAdmin","type":"address"}],"name":"_setPendingAdmin","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"newReserveFactorMantissa","type":"uint256"}],"name":"_setReserveFactor","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"accrualBlockNumber","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"accrueInterest","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"internalType":"address payable","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOfUnderlying","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"borrowAmount","type":"uint256"}],"name":"borrow","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"borrowBalanceCurrent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"borrowBalanceStored","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"borrowIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"borrowRatePerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"comptroller","outputs":[{"internalType":"contract ComptrollerInterface","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"exchangeRateCurrent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"exchangeRateStored","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getAccountSnapshot","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCash","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"contract ComptrollerInterface","name":"comptroller_","type":"address"},{"internalType":"contract InterestRateModel","name":"interestRateModel_","type":"address"},{"internalType":"uint256","name":"initialExchangeRateMantissa_","type":"uint256"},{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"},{"internalType":"uint8","name":"decimals_","type":"uint8"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"interestRateModel","outputs":[{"internalType":"contract InterestRateModel","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isVToken","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"borrower","type":"address"},{"internalType":"contract VToken","name":"vTokenCollateral","type":"address"}],"name":"liquidateBorrow","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"mint","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"pendingAdmin","outputs":[{"internalType":"address payable","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"redeemTokens","type":"uint256"}],"name":"redeem","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"redeemAmount","type":"uint256"}],"name":"redeemUnderlying","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"repayBorrow","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"borrower","type":"address"}],"name":"repayBorrowBehalf","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"reserveFactorMantissa","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"liquidator","type":"address"},{"internalType":"address","name":"borrower","type":"address"},{"internalType":"uint256","name":"seizeTokens","type":"uint256"}],"name":"seize","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"supplyRatePerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalBorrows","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"totalBorrowsCurrent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalReserves","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"src","type":"address"},{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]';
var LinkContract = '0xA07c5b74C9B40447a954e1466938b865b6BBea36';
// SET filter contractAddr 
var filter = { 'to': LinkContract.toString()}
var MY_INFURA_URL = "https://ropsten.infura.io/v3/c5147069a6de4315aed6494e1fa53266";
var CHAIN = {'chain':'ropsten'}
var RINKEBY_CHAIN = {'chain':'rinkeby'}

// chainid - 97 - BINANCE HTTP PROVIDER
var contract_network_chainid_ary=[];
var company_contract_addr=[];
var company_contract_abi=[];
var token_address=[];

////BINANCE_TESTNET DETAILS
contract_network_chainid_ary[97] = "https://data-seed-prebsc-1-s1.binance.org:8545/";
company_contract_addr[97] = '0x6CCE93dA30DaE700fFe26CE980DfE6D183922d45';
company_contract_abi[97] = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"CoinIn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"CoinOut","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"CoinOutFailed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":true,"internalType":"address","name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"signer","type":"address"},{"indexed":true,"internalType":"bool","name":"status","type":"bool"}],"name":"SignerUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"TokenIn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"TokenOut","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"TokenOutFailed","type":"event"},{"inputs":[],"name":"acceptOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_signer","type":"address"},{"internalType":"bool","name":"_status","type":"bool"}],"name":"changeSigner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"coinIn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"_orderID","type":"uint256"}],"name":"coinOut","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"orderID","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"signer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"tokenAmount","type":"uint256"},{"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"tokenIn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"tokenAmount","type":"uint256"},{"internalType":"uint256","name":"_orderID","type":"uint256"},{"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"tokenOut","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];

contract_network_chainid_ary[4] = "https://rinkeby.infura.io/v3/8102c6c81e12418588c89d69ac7a3f04";

var INFURA_PROVIDER = "https://rinkeby.infura.io/v3/8102c6c81e12418588c89d69ac7a3f04";
var INFURA_CONTRACT_ADDR = '0xB6495879f4f88D3563B52c097Cb009E286586137';
var INFURA_CONTRACT_ADDR_ABI = [{"anonymous":!1,"inputs":[{"indexed":!0,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":!0,"internalType":"address","name":"user","type":"address"},{"indexed":!1,"internalType":"uint256","name":"value","type":"uint256"}],"name":"CoinIn","type":"event"},{"anonymous":!1,"inputs":[{"indexed":!0,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":!0,"internalType":"address","name":"user","type":"address"},{"indexed":!1,"internalType":"uint256","name":"value","type":"uint256"}],"name":"CoinOut","type":"event"},{"anonymous":!1,"inputs":[{"indexed":!0,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":!0,"internalType":"address","name":"user","type":"address"},{"indexed":!1,"internalType":"uint256","name":"value","type":"uint256"}],"name":"CoinOutFailed","type":"event"},{"anonymous":!1,"inputs":[{"indexed":!0,"internalType":"address","name":"_from","type":"address"},{"indexed":!0,"internalType":"address","name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":!1,"inputs":[{"indexed":!0,"internalType":"address","name":"signer","type":"address"},{"indexed":!0,"internalType":"bool","name":"status","type":"bool"}],"name":"SignerUpdated","type":"event"},{"anonymous":!1,"inputs":[{"indexed":!0,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":!0,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":!0,"internalType":"address","name":"user","type":"address"},{"indexed":!1,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":!1,"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"TokenIn","type":"event"},{"anonymous":!1,"inputs":[{"indexed":!0,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":!0,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":!0,"internalType":"address","name":"user","type":"address"},{"indexed":!1,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":!1,"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"TokenOut","type":"event"},{"anonymous":!1,"inputs":[{"indexed":!0,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":!0,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":!0,"internalType":"address","name":"user","type":"address"},{"indexed":!1,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":!1,"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"TokenOutFailed","type":"event"},{"inputs":[],"name":"acceptOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_signer","type":"address"},{"internalType":"bool","name":"_status","type":"bool"}],"name":"changeSigner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"coinIn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"_orderID","type":"uint256"}],"name":"coinOut","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"orderID","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"signer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"tokenAmount","type":"uint256"},{"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"tokenIn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"tokenAmount","type":"uint256"},{"internalType":"uint256","name":"_orderID","type":"uint256"},{"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"tokenOut","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];
var TOKEN_ADDRESS = "0xb01f18db95f3634ac7b1f508a3850c2c80e1bdca";
 
company_contract_addr[4] = '0xB6495879f4f88D3563B52c097Cb009E286586137';
company_contract_abi[4] = [{"anonymous":!1,"inputs":[{"indexed":!0,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":!0,"internalType":"address","name":"user","type":"address"},{"indexed":!1,"internalType":"uint256","name":"value","type":"uint256"}],"name":"CoinIn","type":"event"},{"anonymous":!1,"inputs":[{"indexed":!0,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":!0,"internalType":"address","name":"user","type":"address"},{"indexed":!1,"internalType":"uint256","name":"value","type":"uint256"}],"name":"CoinOut","type":"event"},{"anonymous":!1,"inputs":[{"indexed":!0,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":!0,"internalType":"address","name":"user","type":"address"},{"indexed":!1,"internalType":"uint256","name":"value","type":"uint256"}],"name":"CoinOutFailed","type":"event"},{"anonymous":!1,"inputs":[{"indexed":!0,"internalType":"address","name":"_from","type":"address"},{"indexed":!0,"internalType":"address","name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":!1,"inputs":[{"indexed":!0,"internalType":"address","name":"signer","type":"address"},{"indexed":!0,"internalType":"bool","name":"status","type":"bool"}],"name":"SignerUpdated","type":"event"},{"anonymous":!1,"inputs":[{"indexed":!0,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":!0,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":!0,"internalType":"address","name":"user","type":"address"},{"indexed":!1,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":!1,"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"TokenIn","type":"event"},{"anonymous":!1,"inputs":[{"indexed":!0,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":!0,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":!0,"internalType":"address","name":"user","type":"address"},{"indexed":!1,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":!1,"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"TokenOut","type":"event"},{"anonymous":!1,"inputs":[{"indexed":!0,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":!0,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":!0,"internalType":"address","name":"user","type":"address"},{"indexed":!1,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":!1,"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"TokenOutFailed","type":"event"},{"inputs":[],"name":"acceptOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_signer","type":"address"},{"internalType":"bool","name":"_status","type":"bool"}],"name":"changeSigner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"coinIn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"_orderID","type":"uint256"}],"name":"coinOut","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"orderID","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"signer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"tokenAmount","type":"uint256"},{"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"tokenIn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"tokenAmount","type":"uint256"},{"internalType":"uint256","name":"_orderID","type":"uint256"},{"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"tokenOut","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];
 
ADMIN_WALLET_ARY='0x9dD35f936298565Cc17c241fc645Eb4D1e04d895,0x6077516eea959B7fb04bB211AD0569351f3eBDbc,0x62E1960De1F9CA64d8fA578E871c2fe48b596b59,0xF420Bc88E472191B936e7904b17DFD9E6043C12e';
ADMIN_WALLET_ARY_PK='2079696c01f5e53190aa1c72e57a72b93ca4ff165bf46d6ffef3129d108a879f,8342678b959589fb5ad3cc593b410d892c8cb243363b2a30ee817070a89e8e8b,daedd37c356345aa579c5aff0a8d17e90fe9deec38054eb072fbbd10dd753942,43f92fcfbecf0aa228b427f9f3958cf12a2ef9498310bbc26216445f54e7a47b';

/// NETWORKS SETTINGS
var mynetworks = [...Array(200).keys()].toString().split(',');
var myorderID = [...Array(90000).keys()].toString().split(',');
if(myorderID[0] === '0'){
	myorderID.shift();
 	//console.log(myorderID);	
 } 
 if(mynetworks[0] === '0'){
 	mynetworks.shift();
 	//console.log(mynetworks);	 	
 }


var WALLET_NONCE_COUNT = []; // to keep track for nonce  
var LAST_WALLET_INDEX = 0; 
var BRIDGE_ADMIN_WALLET_ARY = [];
BRIDGE_ADMIN_WALLET_ARY = ADMIN_WALLET_ARY.split(',');

BRIDGE_ADMIN_WALLET_ARY.forEach((el)=>{	
	WALLET_NONCE_COUNT[el.toString()] = 0;
})
 
var BRIDGE_ADMIN_WALLET_ARY_PK = [];
BRIDGE_ADMIN_WALLET_ARY_PK = ADMIN_WALLET_ARY_PK.split(',');
//console.log(">>>>>>>", ADMIN_WALLET_ARY);
//console.log(">>>>>>>", ADMIN_WALLET_ARY_PK);
var max_admin_wallets = BRIDGE_ADMIN_WALLET_ARY.length;
//console.log(">>>>>> max_admin_wallets >>>>>", max_admin_wallets);

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

async function getWalletTransactionCount(mywallet){
    try{			 
      	console.log(">>>> bridge_admin_wallet.toString() >>>", mywallet.toString());
	 		var _transcount = await web3.eth.getTransactionCount(mywallet);
	 		return _transcount;	 				 				  	
	 }catch(e){
			console.log("ERR getting admin wallet transaction count",e);			 
	 }
}


async function company_bridge_send_method(_toWallet, _amt, orderid, _chainid){
    console.log( ">>>>> WORKING ON >>>>>>",_toWallet, _amt, orderid, _chainid);	 	   
    _amt = Math.floor(_amt / 1000000000); /// JUST TO TEST SOME RANDOM AMT TO MAKE SMALL		    		           
    console.log(" Calling company bridge send coins >>>", _toWallet , _amt);    
    let bridgeweb3 = new Web3(new Web3.providers.HttpProvider(INFURA_PROVIDER));		    
    web3.eth.handleRevert = true;		    		    
	 			                              
    var mynonce = 0;
    var bridge_admin_wallet;
    var bridge_admin_walletpk;
    var transcount;
    console.log("<<<< LAST_WALLET_INDEX, max_admin_wallets >>>>",LAST_WALLET_INDEX, max_admin_wallets);
    		    
	 if(LAST_WALLET_INDEX === (max_admin_wallets-1)){			 		
	 		bridge_admin_wallet = BRIDGE_ADMIN_WALLET_ARY[0];
	 		bridge_admin_walletpk = BRIDGE_ADMIN_WALLET_ARY_PK[0];
			LAST_WALLET_INDEX = 0;			
	 }else{			 		
			LAST_WALLET_INDEX++;					
			bridge_admin_wallet = BRIDGE_ADMIN_WALLET_ARY[LAST_WALLET_INDEX];
			bridge_admin_walletpk = BRIDGE_ADMIN_WALLET_ARY_PK[LAST_WALLET_INDEX];			
	 }			   
	   console.log("~~~~~~~~~~~~~~~~~~######################~~~~~~~~~~~~~~~~~~~~~~");
		console.log(">>>> WALLET_INDEX, bridge_admin_wallet >>>>", LAST_WALLET_INDEX, bridge_admin_wallet);
		console.log("~~~~~~~~~~~~~~~~~~######################~~~~~~~~~~~~~~~~~~~~~~");										  
	 try{
    	var company_bridgeinstance = new bridgeweb3.eth.Contract(INFURA_CONTRACT_ADDR_ABI, INFURA_CONTRACT_ADDR.toString());		    	
    }catch(e){
		console.log(" >>>>> EEEEE >>>>",e);		    
    }
        
    var mydata = await company_bridgeinstance.methods.tokenOut(TOKEN_ADDRESS.toString(), _toWallet.toString(), _amt.toString(), orderid.toString(), _chainid.toString()).encodeABI();    
    //console.log(" >>>>> bridge_admin_wallet >>>>>>", bridge_admin_wallet);
    //web3.eth.defaultAccount = "0xF420Bc88E472191B936e7904b17DFD9E6043C12e";
    var requiredGas = await company_bridgeinstance.methods.tokenOut(TOKEN_ADDRESS, _toWallet, _amt, orderid, _chainid).estimateGas({from: bridge_admin_wallet.toString()});
    console.log(">>> Gas require >>", requiredGas);	      
    //console.log("MYDATA >>>>",mydata);       
    console.log(">>>>> REQUIRED GAS, >>> bridge_admin_wallet <<<<<",requiredGas, bridge_admin_wallet);
	 var transcount = await getWalletTransactionCount(bridge_admin_wallet);
	 var MY_TX_COUNT = WALLET_NONCE_COUNT[bridge_admin_wallet.toString()] ? (parseInt(WALLET_NONCE_COUNT[bridge_admin_wallet.toString()])+1) : 0;
	 
	 mynonce = transcount + MY_TX_COUNT;
	 console.log(" MYNonce >>>>", mynonce);	
	 WALLET_NONCE_COUNT[bridge_admin_wallet.toString()] = parseInt(WALLET_NONCE_COUNT[bridge_admin_wallet.toString()])+1;
	 console.log( " >>>>>>########<<<<<<< WALLET_NONCE_COUNT[bridge_admin_wallet.toString()] >>>>>", bridge_admin_wallet.toString(), WALLET_NONCE_COUNT[bridge_admin_wallet.toString()]);		   
	 console.log("<<< transcount, MY_TX_COUNT, mynonce, bridge_admin_wallet >>>", transcount, MY_TX_COUNT, mynonce, bridge_admin_wallet);	 
	 var w = await myasynCall(bridgeweb3, mynonce, bridge_admin_wallet, bridge_admin_walletpk, requiredGas, mydata);
	 return 1;
}

var RINKEBY_CONTRACT_DTHETHBRIDGE_ADDR = "0xb6495879f4f88d3563b52c097cb009e286586137";
var RINKEBY_CONTRACT_DITETHBRIDGE_ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"CoinIn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"CoinOut","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"CoinOutFailed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":true,"internalType":"address","name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"signer","type":"address"},{"indexed":true,"internalType":"bool","name":"status","type":"bool"}],"name":"SignerUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"TokenIn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"TokenOut","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"TokenOutFailed","type":"event"},{"inputs":[],"name":"acceptOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_signer","type":"address"},{"internalType":"bool","name":"_status","type":"bool"}],"name":"changeSigner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"coinIn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"_orderID","type":"uint256"}],"name":"coinOut","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"orderID","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"signer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"tokenAmount","type":"uint256"},{"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"tokenIn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"tokenAmount","type":"uint256"},{"internalType":"uint256","name":"_orderID","type":"uint256"},{"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"tokenOut","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
var RINKEYBY_EVENT_INFURA_URL = "https://rinkeby.infura.io/v3/8102c6c81e12418588c89d69ac7a3f04"
var CHAIN = {'chain':'rinkeby'}
var filter = {'to': '0xb6495879f4f88d3563b52c097cb009e286586137'}

var BSC_TESTNET_COMPANY_CONTRACT_ADDR="0x705CC275544D3B79243B08ea1DAeF8cA1FFb2F85"
var BSC_TESTNET_COMPANY_CONTRACT_ABI=[{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burnToSwap","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"timeOfEvent","type":"uint256"}],"name":"BurnToSwapEv","type":"event"},{"constant":false,"inputs":[],"name":"changeSafeguardStatus","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_signer","type":"address"}],"name":"changeSigner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"changeWhitelistingStatus","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"decrease_allowance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"target","type":"address"},{"name":"freeze","type":"bool"}],"name":"freezeAccount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"increase_allowance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_user","type":"address"},{"name":"_amount","type":"uint256"},{"name":"timeOfRequest","type":"uint256"}],"name":"mintToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_user","type":"address"},{"name":"_amount","type":"uint256"},{"name":"timeOfRequest","type":"uint256"}],"name":"swapCompleted","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_user","type":"address"},{"name":"_amount","type":"uint256"},{"name":"timeOfRequest","type":"uint256"}],"name":"swapProcessing","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_user","type":"address"},{"name":"_amount","type":"uint256"},{"name":"timeOfRequest","type":"uint256"}],"name":"swapReverted","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"timeOfEvent","type":"uint256"}],"name":"swapCompletedEv","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"target","type":"address"},{"indexed":false,"name":"frozen","type":"bool"}],"name":"FrozenAccounts","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"timeOfEvent","type":"uint256"}],"name":"tokenPaidEv","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"inputs":[{"name":"name_","type":"string"},{"name":"symbol_","type":"string"},{"name":"decimals_","type":"uint256"},{"name":"totalSupply_","type":"uint256"},{"name":"networkID_","type":"uint256"},{"name":"tokenType_","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":false,"inputs":[{"name":"userAddresses","type":"address[]"}],"name":"whitelistManyUsers","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"userAddress","type":"address"}],"name":"whitelistUser","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"frozenAccount","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"networkID","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"safeguard","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"signer","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"swapStatus","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tokenType","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"whitelisted","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"whitelistingStatus","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"}]

var getwsprovider = () =>{     
	 var httpprovider = new Web3(new Web3.providers.HttpProvider(RINKEYBY_EVENT_INFURA_URL, options));     
    return httpprovider
}

let web3 = new Web3(getwsprovider());

async function myasynCall(bridgeweb3, mynonce, bridge_admin_wallet, bridge_admin_walletpk, requiredGas, mydata){	                          
     return await bridgeweb3.eth.getGasPrice().then(gasPrice=>{                    			                    				                    			                                                                  
             const myrawTx = {   
                 nonce: web3.utils.toHex(mynonce),                    
                 gasPrice: web3.utils.toHex(gasPrice),
                 gasLimit: requiredGas,
                 from: bridge_admin_wallet.toString(),
                 to: INFURA_CONTRACT_ADDR.toString(),                        
                 value: '0x0', 
                 value: '0x0', 
                 data: mydata 
             };  
             
             //console.log("myrawTx >>>>",myrawTx);                                                                   		 									 
             var tx = new Tx(myrawTx, RINKEBY_CHAIN);                            		                            		                            
             var privateKey = Buffer.from(bridge_admin_walletpk.toString(), 'hex');		                            
				 //console.log(">>>> PrivateKey, Bridge Admin Walletpk >>>>>", privateKey, bridge_admin_walletpk.toString());									 											 														 																						                            
             tx.sign(privateKey);                        
             var serializedTx = tx.serialize(); 
                                                     
             bridgeweb3.eth.sendSignedTransaction('0x'+serializedTx.toString('hex')).then((receipt)=>{
             	  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
             	  console.log("<<< bridge_admin_wallet >>>", bridge_admin_wallet);
             	  console.log("<<<< RECEIPT >>>>",JSON.stringify(receipt));              
             	  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
             }).catch(error=>{                       
                 console.log("<<< ERR, sendsigedTransaction >>>",error);         
             })	                                                                                                                                  
     }).catch(e=>{                        
         console.log("ERR, GasPrice >>>>",e);
     })                    
}

async function getEventData_CoinIn(_fromBlock, _toBlock){ 
	 const myinstance = new web3.eth.Contract(RINKEBY_CONTRACT_DITETHBRIDGE_ABI, "0xb6495879f4f88d3563b52c097cb009e286586137");
	 try{
		 		await myinstance.getPastEvents('CoinIn',  {
		 				'filter':{'orderID': myorderID},
		 				fromBlock: _fromBlock,       
						toBlock: _toBlock
		    	},function(error,events){		    			
		 				console.log(error);		 				
		 				var eventlen = events.length;
		 				console.log("eventlen >>>>", eventlen);		 				
		 				for(var i=0;i<eventlen; i++){
		 					setTimeout(()=>{},400);
		 					var eve = events[i];
		 					console.log("<<< CoinIn EVE >>>>", i);	 					
 				         //emit CoinIn(orderID, msg.sender, msg.value)
		 					var _blkNumber = eve.blockNumber;			 									
		 					var _orderid = eve.returnValues.orderID;							
							var _sendcoinsTo = eve.returnValues.user;
							var _amount = eve.returnValues.value;
							var _chainid = eve.returnValues.chainID ? eve.returnValues.chainID : 4; // considered dithereum chainID = 4 // rinkeby 
																		
							if(_chainid && parseInt(_amount)){
								(async ()=>{
								   await db_select().then(z=>{			
										console.log(">>>>>zzzzzz >>>>",z);
										if(z.length == 0){														   							
											(async ()=>{									
												console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
												console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
												console.log(">>>> ##### In for loop, _chainid,  _amount, i #### >>>>", _chainid, _amount, i);						
												console.log("<<< CoinIn EVE ### >>>> _sendcoinsTo, _amount, _orderid >>>>",_sendcoinsTo, _amount, _orderid);
												console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
												console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
												var q = await company_bridge_send_method(_sendcoinsTo, _amount, _orderid, _chainid).catch(console.log);			
											})();
										}
									}).catch(console.log);
								})();			
							}
							else{								
								console.log(">>>>In for loop, _chainid,  _amount, i >>>>", _chainid, _amount, i);							
							}
						}																		
		 		});
		 		////
		 }catch(e){	console.log("<<<< Error >>>>",e); }	 	 	 
}


async function getEventData_TokenIn(_fromBlock, _toBlock){ 
	 const myinstance = new web3.eth.Contract(RINKEBY_CONTRACT_DITETHBRIDGE_ABI, "0xb6495879f4f88d3563b52c097cb009e286586137");	 
	 try{
		 		await myinstance.getPastEvents('TokenIn', {	'filter':{'orderID': myorderID},	fromBlock: _fromBlock, toBlock: _toBlock },function(error,events){		    			
		 				console.log(error);		 				
		 				var eventlen = events.length;						 				
		 				
		 				for(var k=0; k<eventlen;k++){
		 					setTimeout(()=>{},400);
		 					console.log("<<< TokenIn eventlen,k >>>>", eventlen, k);		 					
		 					var eve = events[k];
		 					var _blkNumber = eve.blockNumber;					
		 					var _orderid = eve.returnValues.orderID;
							var _tokenAddress = eve.returnValues.tokenAddress;
							var _sendcoinsTo = eve.returnValues.user;
							var _amount = eve.returnValues.value;
							var _chainid = eve.returnValues.chainID;
							
							if(_chainid && parseInt(_amount)){
								(async ()=>{
										await	db_select().then(z=>{			
												console.log(">>>>>ZZZZZzzzzzz >>>>",z);
												if(z.length == 0){																															   							
													(async ()=>{							
														console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
														console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<@@@@@ TOKENIN @@@@@@<<<<<<<<<<<<<<<<<<<<<<<<<<<< ");
														console.log("_sendcoinsTo, _amount, _orderid >>>>",_sendcoinsTo, _amount, _orderid);
														console.log(">>>>In for loop, _chainid,  _amount, k >>>>", _chainid, _amount, k);
														var o = await company_bridge_send_method(_sendcoinsTo, _amount, _orderid, _chainid).catch(console.log);
														console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");										
													})();
												}
										}).catch(console.log);	
								})();																		
							}else{
								console.log("@@@ TOKENIN >>>>In for loop, _chainid,  _amount, i >>>>", _chainid, _amount, i);						
							}
						}													
		 		});
		 }catch(e){	console.log("<<<< Error >>>>",e); }	 	 	 
}

async function checkLatestBlock(){
	 //######  UNCOMMENT BELOW LINE FOR 100 BLOCKS  ######//
 	 //var toblock =  await web3.eth.getBlockNumber();
 	 //var fromblock = toblock-1000;
 	 
 	 var toblock = 9668500;
 	 var fromblock = 9668300;
 	 
	 var y = await getEventData_CoinIn(fromblock, toblock);   
	 var u = await getEventData_TokenIn(fromblock, toblock);
	 console.log("<<<< YYYYY >>>>>",y);
	 console.log("<<<< UUUUU >>>>>",u); 	  	 
 	 console.log(">>>> fromblock, toblock >>>>", fromblock, toblock);                  
}

checkLatestBlock();


async function	db_select(chainid, orderid){	
	var con = mysql.createConnection({
  		host: process.env.DB_HOST.toString(),
  		user: process.env.DB_USER.toString(),
  		password: process.env.DB_PASSWORD.toString(),
  		database: process.env.DB_DATABASE.toString(),
  		connectTimeout: 100000,
  		port:3306
	});
	const query = util.promisify(con.query).bind(con);	
	try{
			return await query("SELECT count(*) as rec FROM contract_orders where chain_id="+chainid+",orderid="+orderid);					
	}catch(e){
		console.log("ERROR >>Catch",e);
	}finally{
			con.end();			
	}			
}