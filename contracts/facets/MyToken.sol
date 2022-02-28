
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import { ERC20 } from '@solidstate/contracts/token/ERC20/ERC20.sol';
import { ERC20MetadataStorage } from '@solidstate/contracts/token/ERC20/metadata/ERC20MetadataStorage.sol';

contract MyToken is ERC20 {
    using ERC20MetadataStorage for ERC20MetadataStorage.Layout;

    function initialize(string calldata name, string calldata symbol, uint8 decimals, uint256 totalSupply) public {
        ERC20MetadataStorage.Layout storage l = ERC20MetadataStorage.layout();

        l.setName(name);
        l.setSymbol(symbol);
        l.setDecimals(decimals);

        _mint(msg.sender, totalSupply);
    }
}