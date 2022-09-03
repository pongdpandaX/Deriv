# Deriv
Deriv Exercise for probability game

Smart contract that implements a coin-toss game. The rules of the game
should be as follows:

A user can send any amount of crypto to the smart contract. If the amount sent is
larger than the contract’s current treasury balance, the contract should send the
funds back as-is.

The contract should with 50.1% probability send back nothing to the user, and with
49.9% probability send back twice the amount.

## Technology Used
DAPP : Purely HTML and Javascript

Smart Contract : Solidity

Network : BSC Testnet 

## Live Demo
https://bsclegend.com/deriv.html

## Pre-Requisites
- Metamask
- Visual Studio Code or any Terminal Enabled Software
- Account with balance in BSC Testnet

## Overview
There are two key folders. `contracts` holds the solidty code. `frontend` contains the ui for the smart contracts.

In order to eliminate the threat of hackers to exploit the random generation, I added a variable upon creation of the contract.

This varaiable also changes in every call of the game.


### BSC Testnet Information
Deployed on BSC Testnet Network


[**Game**](https://testnet.bscscan.com/address/0x87947000ef213af478e4e9783BcA95738D7B8107)


`0x87947000ef213af478e4e9783BcA95738D7B8107`


[**Token**](https://testnet.bscscan.com/address/0x21e1dea25912b9CCF0faC0d139Ca7BA5bD23be9e)


`0x21e1dea25912b9CCF0faC0d139Ca7BA5bD23be9e`

# Instruction
From the **frontend** folder, run

### `yarn start`

Runs the app in the development mode.

Open [http://localhost:5500](http://localhost:5500) to view it in the browser.

OR you can just copy the whole [frontend](https://github.com/pongdpandaX/Deriv/tree/main/frontend) folder and open [Deriv.html](http://localhost:5500/Deriv.html)

# User Guide

## Step 1 - Verification
- Connect to BSC Testnet and Veriy your account
- Once connected, you can get some BSC Testnet tokens by clicking on the Get BSC Testnet Token button

## Step 2 - Get Dice Token to Play
- Click the Mint Token to get the BSC Token defined above

## Step 3 - Approve Game Contract
- Click the Approve Game to allow our Game contract access our Dice Token

## Step 4 - Fund the Game
- Click on the Fund the Game if you want to add more Dice Token to the Contract Dice Balance 

## Step 5 - Play the Probability Game
- Put your Dice Token Amount to bet and click the Roll Dice Button 

# Creating your own Game Contract and Token Contract

Create the Dice Token to be used for BSC Testnet using the [GameToken.sol](https://github.com/pongdpandaX/Deriv/blob/main/contracts/GameToken.sol)

Create the Game Contract to be used for BSC Testnet using the [DerivDiceGame.sol](https://github.com/pongdpandaX/Deriv/blob/main/contracts/DerivDiceGame.sol)

Update the Deriv.html file line 17-18 to reflect your own BSC Testnet contracts.
