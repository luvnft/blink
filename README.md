# BARK BLINK

![BARK BLINK Logo](https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png)

BARK BLINK is a Blinks As A Service Application for creating and managing Solana Blinks. It provides an intuitive interface for users to interact with the Solana blockchain, create digital assets, and manage their Blink collection.

## Features

- Create Solana Blinks: Instantly create digital assets or moments on the blockchain.
- Send Blinks: Effortlessly transfer your Blinks to other users on the Solana network.
- Track Blinks: Monitor your Blink collection and transaction history in real-time.
- Customize Blinks: Personalize your Blinks with unique attributes and metadata.
- Swap Tokens: Exchange different types of tokens directly within the application.
- SPL Token Creation: Create your own SPL tokens on the Solana blockchain.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- pnpm or yarn
- Solana CLI (for local development)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/barkprotocol/blinks-as-a-service-dapp.git
   cd blinks-as-a-service-dapp
   ```

2. Install dependencies:
   ```
   pnpm install
   ```
   or
   ```
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following variables:
   ```
   NEXT_PUBLIC_RPC_ENDPOINT=your_solana_rpc_endpoint
   NEXT_PUBLIC_NETWORK=mainnet-beta
   ```

4. Run the development server:
   ```
   pnpm run dev
   ```
   or
   ```
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Connect your Solana wallet to BARK BLINKS.
2. Use the intuitive interface to create and customize your Solana Blinks.
3. Send your Blinks to friends or trade them on supported marketplaces.
4. Track and manage your Blinks in your personal Blinkboard.
5. Create SPL tokens and manage your token portfolio.
6. Swap tokens using the integrated decentralized exchange functionality.

## API Routes

The application includes several API routes for interacting with the Solana blockchain:

- `/api/create-blink`: Create a new Solana Blink
- `/api/send-blink`: Transfer a Blink to another user
- `/api/get-user-blinks`: Retrieve a user's Blink collection
- `/api/create-spl-token`: Create a new SPL token
- `/api/swap-tokens`: Perform a token swap

For detailed information on how to use these API routes, please refer to the API documentation.

## Contributing

We welcome contributions to BARK BLINK! Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/NewFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some NewFeature'`)
5. Push to the branch (`git push origin feature/NewFeature`)
6. Open a Pull Request

Please make sure to update tests as appropriate and adhere to the [Contributor Covenant](https://www.contributor-covenant.org/) code of conduct.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Solana](https://solana.com/)
- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [@solana/web3.js](https://github.com/solana-labs/solana-web3.js)
- [@solana/spl-token](https://github.com/solana-labs/solana-program-library/tree/master/token)
- [Anchor Framework](https://www.anchor-lang.com/)