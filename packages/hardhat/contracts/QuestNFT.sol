// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title QuestNFT - Minimal ERC721 for quest minting with per-token URI
contract QuestNFT is ERC721URIStorage, Ownable {
    uint256 public nextId;

    constructor() ERC721("QuestNFT", "QNFT") Ownable(msg.sender) {}

    function mint(address to, string memory uri) external returns (uint256 tokenId) {
        tokenId = ++nextId;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }
}


