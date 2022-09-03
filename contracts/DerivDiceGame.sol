pragma solidity ^0.8.16;  
//SPDX-License-Identifier: UNLICENSED

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

/**
 * @title Deriv Dice Game Exercise
 * 
 * The key purpose of this contract is to have a Dice Game Contract with enough security
 * The blockchain handles the random generation of number 0-1000

 * A user can send any amount of crypto to the smart contract. If the amount sent is
 * larger than the contract’s current treasury balance, the contract should send the
 * funds back as-is.

 * The contract should with 50.1% probability send back nothing to the user, and with
 * 49.9% probability send back twice the amount.
 * 
 */
 
contract DerivDiceGame {
    // This is the token address for the ERC20 contract.
    // A generic tokenAddress for all contracts should be prohibited.

    //this will be used as the Dice Game Token
    IERC20  public tokenAddress;

    //secret key integer 
    uint keyInt = 0;

    constructor(address _tokenAddress, uint _initialKey) {
        tokenAddress = IERC20(_tokenAddress);
        keyInt = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, _initialKey)));
    }

    event NewPlay(
        // Ethereum parameters
        address indexed sender, 

        // Agreement params
        uint256 amount,
        bool gameResult
    );

    modifier tokensTransferable(address _sender, uint256 _amount) {
        require(_amount > 0, "token amount must be > 0");
        require(tokenAddress.allowance(_sender, address(this)) >= _amount, "token allowance must be >= amount");
        _;
    }

    /**
     * @dev Fund the Contract with Dice Token
     */
    function FundContract(uint _amount) external {
        require(tokenAddress.balanceOf(msg.sender) >= _amount, "Not enough Dice to fund");
        tokenAddress.transferFrom(msg.sender, address(this), _amount);
    }

     /**
     * @dev Player calls this function
     *
     * NOTE: _receiver must first call approve() on the token contract.
     * @param _amount Amount of the token to play.
     * @return gameResult  is either win(true) or lose(false)
     */
    function PlayGame(uint256 _amount) external tokensTransferable(msg.sender, _amount) returns (bool){
        require(tokenAddress.balanceOf(msg.sender) >= _amount, "Not enough Dice");
        require(tokenAddress.balanceOf(address(this)) >= _amount, "Contract doest not have enough Dice");

        bool gameResult = false;

        // Dice Logic here
        uint randomNumber = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, keyInt))) % 1000;

        //Since we generate random number from 0-999, 0-500 means 50.1% of the total
        if (randomNumber <= 500){
            // LOSE
            // This contract becomes the temporary owner of the tokens
            if (!((tokenAddress).transferFrom(msg.sender, address(this), _amount)))
                revert("transferFrom sender to this failed");
        }
        else{
            // WIN
            // Pay the sender
            tokenAddress.transfer(msg.sender, _amount); 
            gameResult = true;
        }

        //Resets the secret key if near uint max (2^256) with a pseudo random number
        if (keyInt >= 2^255){
            keyInt = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, keyInt)));
        }

        //Change the secret key int for security
        keyInt = keyInt + randomNumber;

        emit NewPlay(
            msg.sender,
            _amount,
            gameResult
        );

        return gameResult;
    }

}