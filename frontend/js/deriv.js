const commonABI = [{ "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "token0", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "token1", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }];
const abiHash = [{ "inputs": [{ "name": "_key", "type": "string" }], "name": "getHash", "outputs": [{ "name": "pure", "type": "bytes32" }], "stateMutability": "view", "type": "function" }];
const abiContractHash = ["function getContractHash(address _receiver, bytes32 _hashlock, uint256 _timelock, uint256 _amount) external  view  returns (bytes32)"];
const abiPlayGame = ["function PlayGame(uint256 _amount) external returns (bool)"];
const abiApprove = ["function approve(address _spender, uint256 _value) public returns (bool success)"];
const abiMint = ["function GetToken(uint256 _amount) public returns (bool success)"];
const abiFund = ["function FundContract(uint _amount) external"];
const abiAllowance = [{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];

async function ConnectWallet() {
    bundle.connect();
}

async function ConnectToBSCTestNet(){
    //change to BSC testnet
    changeNetwork(BSCTNetworkId);
}

const changeNetwork = async (networkId) => {
    if (window.ethereum) {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: Web3.utils.toHex(networkId) }],
            }).then((tx) => {
                if (networkId == BSCTNetworkId){
                    GetWalletInfoBSC();
                }
                else if (networkId == RopstenNetworkId){
                    GetWalletInfoRopsten();
                }
            });
        }
        catch (error) {
            console.error(error);
        }
    }
}

async function GetWalletInfoBSC(){
    //get wallet info
    const accountsCon = await ethereum.request({ method: "eth_accounts" });
    $("#walletBSCT").text(accountsCon[0]);

    //get native balance info
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    provider.getBalance(accountsCon[0]).then((balance) => {
        const balanceInEth = ethers.utils.formatEther(balance)
        $("#balanceBSCT").text(balanceInEth + " BNB");
    });

    //get Dice Token balance
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(BSCDiceTokenContract, commonABI, signer);
    const contractBalance =  await tokenContract.balanceOf(accountsCon[0]).then((balance) => {
        myDice = balance;
        $("#balanceTokenBSCT").text(myDice + " DiceToken");
    });

    //get Game Dice Token balance
    const contractTokenBalance =  await tokenContract.balanceOf(BSCTDiceGameContract);
    $("#balanceContractTokenBSCT").text(contractTokenBalance + " DiceToken");

    balanceContractTokenBSCT
}

function SetContractInfo(){
    $("#contractBSCT").text(BSCDiceTokenContract);
    $("#contractHashLockBSCT").text(BSCTDiceGameContract);
}

async function ApproveBSCToken() {
    var abiApprove = ["function approve(address _spender, uint256 _value) public returns (bool success)"]
    var providerApprove = new ethers.providers.Web3Provider(window.ethereum);
    const signerApprove = providerApprove.getSigner();
    var contractApprove = new ethers.Contract(BSCDiceTokenContract, abiApprove, signerApprove);

    await contractApprove.approve(BSCTDiceGameContract, "100000000000000000000000000000000000000000000");
}

async function CheckTokenApproval() {    
    var providerApprove = new ethers.providers.Web3Provider(window.ethereum);
    const signerApprove = providerApprove.getSigner();
    var contractApprove = new ethers.Contract(BSCDiceTokenContract, abiAllowance, signerApprove);    
    const accountsCon = await ethereum.request({ method: "eth_accounts" });
    approvedBalance = await contractApprove.allowance(accountsCon[0], BSCTDiceGameContract);

    if (approvedBalance.toString() != "0"){
        $("#approveButton").removeClass("btn-warning");
        $("#approveButton").addClass("disabledBtn");
    }
}

async function MintDiceToken(){
    // Mint some Dice Token
    try{
        ShowMessage("Sending Transaction...");
        var provider = new ethers.providers.Web3Provider(window.ethereum);
        const signerMint = provider.getSigner();
        var contractMint = new ethers.Contract(BSCDiceTokenContract, abiMint, signerMint);

        const res = await contractMint.GetToken(100);
        const receipt = await res.wait(); 
    
        ShowMessage("Minted 100 Dice!");

        GetWalletInfoBSC();
    }
    catch(error){
        console.log(error);
        ShowMessage(error.message);
    }
    
}

async function FundToken(){
    // Fund the Game Contract with 100 Dice Token
    try{
        ShowMessage("Sending Transaction...");
        var provider = new ethers.providers.Web3Provider(window.ethereum);
        const signerFund = provider.getSigner();
        var contractFund = new ethers.Contract(BSCTDiceGameContract, abiFund, signerFund);

        const res = await contractFund.FundContract(100);
        const receipt = await res.wait(); 

        ShowMessage("Game contract funded with 100 Dice!");

        GetWalletInfoBSC();
    }
    catch(error){
        console.log(error);
        ShowMessage(error.message + error.data.message);
    }
    
}

async function PlayGame(){
    // Play the Toss Coin
    try{
        if ($("#amountToPlay").val() > 0){
            ShowMessage("Sending Transaction...");
            var provider = new ethers.providers.Web3Provider(window.ethereum);
            const signerRollDice = provider.getSigner();
            var contractRollDice = new ethers.Contract(BSCTDiceGameContract, abiPlayGame, signerRollDice);
            const res = await contractRollDice.PlayGame($("#amountToPlay").val(), { gasLimit: GasLimit });
            
            ShowMessage("Waiting for game result...");
            const receipt = await res.wait(); 

            if (receipt.events.length == 3){
                ShowMessage("Sorry You Lose!");
            }
            else{
                ShowMessage("Congratulations! You Win!");
            }

            GetWalletInfoBSC();
        }
        
    }
    catch(error){
        console.log(error);
        ShowMessage(error.message);
    }
}

function CheckAmount(){
    var amountToPlay = $("#amountToPlay").val();

    if (amountToPlay > parseInt(myDice)){
        ShowMessage("Insufficient token balance");
        $("#amountToPlay").val(myDice);
    }

}

function ShowMessage(msg){
    $("#myModal").css("display", "block");
    $("#modalMsg").text(msg);
}


function CloseMessage(){
    $("#myModal").css("display", "none");
    $("#modalMsg").text("");
}