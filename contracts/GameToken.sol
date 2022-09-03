pragma solidity ^0.8.16;  
//SPDX-License-Identifier: UNLICENSED

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract Token is ERC20 {
  constructor(string memory name, string memory ticker) ERC20(name, ticker) {
    _mint(msg.sender, 10);
  }

  function GetToken(uint _amount) external  {
      _mint(msg.sender, _amount);
  }
}
