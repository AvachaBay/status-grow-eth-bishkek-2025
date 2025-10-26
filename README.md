# 🌱 StatusGrow - Next-Generation Quest Platform for Web3

<div align="center">

![StatusGrow Banner](https://img.shields.io/badge/StatusGrow-Quest%20Platform-blue?style=for-the-badge&logo=ethereum)
![Powered by Status Network](https://img.shields.io/badge/Powered%20by-Status%20Network-green?style=for-the-badge)
![Built with Scaffold-ETH 2](https://img.shields.io/badge/Built%20with-Scaffold--ETH%202-purple?style=for-the-badge)

**Complete Quests. Earn Rewards. Grow Your Crypto.**

*The most rewarding quest platform built for Web3 with zero gas fees and real rewards*

[🚀 Live Demo](http://localhost:3000) • [📖 Documentation](#documentation) • [🤝 Contribute](#contributing)

</div>

---

## 🎯 What is StatusGrow?

StatusGrow is a revolutionary quest platform that brings **real rewards** to Web3 users without the friction of gas fees. Built on **Status Network's gasless Layer 2** and powered by **Scaffold-ETH 2**, it offers a seamless experience for both users and builders.

### ✨ Key Features

- 🆓 **Zero Gas Fees** - Complete quests and claim rewards without paying
- 🎁 **Real Rewards** - Earn actual tokens, NFT badges, Soulbound Tokens, and whitelist spots
- 📱 **Mobile & Desktop** - Integrated into Status App on all platforms
- 🛡️ **Bot-Protected** - RLN technology ensures only genuine users earn rewards
- ⚡ **Instant Claims** - Get verified instantly and claim rewards directly to your wallet
- 🏗️ **For Builders** - Launch your quest in 24 hours with full analytics

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (>= v20.18.3)
- [Yarn](https://yarnpkg.com/) (v1 or v2+)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/statusgrow-quest-platform.git
   cd statusgrow-quest-platform
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Start local blockchain**
   ```bash
   yarn chain
   ```

4. **Deploy smart contracts**
   ```bash
   yarn deploy
   ```

5. **Start the frontend**
   ```bash
   yarn start
   ```

6. **Visit the app**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **RainbowKit** - Wallet connection UI
- **Wagmi** - React hooks for Ethereum

### Backend & Blockchain
- **Scaffold-ETH 2** - Complete dApp development framework
- **Hardhat** - Ethereum development environment
- **Status Network** - Gasless Layer 2 infrastructure
- **Redis** - User state persistence
- **TypeChain** - TypeScript bindings for smart contracts

### Smart Contracts
- **Solidity** - Smart contract language
- **OpenZeppelin** - Secure contract libraries
- **QuestNFT** - NFT rewards system
- **StakeManager** - Token staking mechanics

## 🎮 How It Works

### For Users
1. **Connect Wallet** - No signup or email required
2. **Complete Quests** - Stake SNT, swap tokens, mint NFTs
3. **Claim Rewards** - Get verified instantly and claim to your wallet

### For Builders
1. **Create Quest** - Define requirements and rewards
2. **Deploy** - Launch in 24 hours with zero code
3. **Analytics** - Track performance and user engagement

## 🛠️ Development

### Project Structure

```
statusgrow-quest-platform/
├── packages/
│   ├── hardhat/          # Smart contracts
│   │   ├── contracts/    # Solidity contracts
│   │   ├── deploy/       # Deployment scripts
│   │   └── test/         # Contract tests
│   └── nextjs/           # Frontend application
│       ├── app/          # Next.js app router
│       ├── components/   # React components
│       ├── hooks/        # Custom hooks
│       └── utils/        # Utility functions
```

### Available Scripts

```bash
# Blockchain
yarn chain              # Start local blockchain
yarn deploy             # Deploy contracts
yarn hardhat:test       # Run contract tests

# Frontend
yarn start              # Start development server
yarn build              # Build for production
yarn vercel             # Deploy to Vercel

# Utilities
yarn generate-abi       # Generate contract ABIs
yarn typechain          # Generate TypeScript types
```

### Smart Contract Integration

StatusGrow uses Scaffold-ETH 2's powerful hooks for seamless contract interaction:

```typescript
// Reading contract data
const { data: questData } = useScaffoldReadContract({
  contractName: "QuestNFT",
  functionName: "getQuest",
  args: [questId],
});

// Writing to contracts
const { writeContractAsync } = useScaffoldWriteContract({
  contractName: "QuestNFT"
});

await writeContractAsync({
  functionName: "completeQuest",
  args: [questId, proof],
});
```

## 🌐 Status Network Integration

StatusGrow leverages Status Network's unique features:

- **Gasless Transactions** - Users never pay gas fees
- **Mobile Integration** - Native Status App support
- **RLN Protection** - Anti-bot and anti-farming measures
- **Yield Subsidization** - Network covers transaction costs

## 🎁 Rewards System

### Token Rewards
- **SNT Tokens** - Status Network's native token
- **Partner Tokens** - From integrated projects
- **Custom Tokens** - Project-specific rewards

### NFT Rewards
- **Quest Badges** - Proof of completion
- **Soulbound Tokens** - Reputation and achievements
- **Exclusive NFTs** - Rare collectibles

### Access Rewards
- **Whitelist Spots** - Early access to projects
- **VIP Access** - Premium features and events
- **Governance Rights** - Voting and decision making

## 📊 Analytics & Monitoring

- **Quest Performance** - Completion rates and user engagement
- **Reward Distribution** - Token and NFT allocation tracking
- **User Behavior** - On-chain activity analysis
- **Bot Detection** - RLN-based fraud prevention

## 🔒 Security

- **Smart Contract Audits** - Regular security reviews
- **RLN Technology** - Reputation-based user verification
- **Multi-signature Wallets** - Secure fund management
- **Rate Limiting** - Anti-spam protection

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Status Network** - For providing gasless infrastructure
- **Scaffold-ETH 2** - For the amazing development framework
- **OpenZeppelin** - For secure smart contract libraries
- **Web3 Community** - For inspiration and support

## 📞 Support

- **Discord** - [Join our community](https://discord.gg/statusgrow)
- **Twitter** - [@StatusGrow](https://twitter.com/statusgrow)
- **Email** - support@statusgrow.io

---

<div align="center">

**Built with ❤️ for the Web3 community**

[Website](https://statusgrow.io) • [Documentation](https://docs.statusgrow.io) • [Status App](https://status.im)

</div>