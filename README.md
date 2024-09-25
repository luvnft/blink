# BARK Blinks

BARK Blinks is a user-friendly interface for the Blinks As A Service application, enabling users to easily create, send, and manage SPL tokens, transactions, NFTs, gifts, and airdrops on the Solana blockchain.

## Features

- Create and manage SPL tokens
- Mint and transfer NFTs
- Set up and execute airdrops
- User-friendly dashboard for managing all Solana blockchain assets
- Secure wallet integration
- Responsive design for both desktop and mobile use

## Technologies Used

- Next.js 14+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS
- Shadcn/ui components
- Solana Web3.js
- Solana Wallet Adapter

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- A Solana wallet (e.g., Phantom, Solflare)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/barkprotocol/bark-blinks-dapp.git
   cd bark-blinks-dapp
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ```
   NEXT_PUBLIC_SOLANA_RPC_HOST=https://api.mainnet-beta.solana.com
   ```

4. Run the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/app`: Next.js 13 app directory
  - `/dashboard`: Main dashboard page
  - `/create-merch-blink`: Page for creating merchandise blinks
  - `/create-shipping-nft`: Page for creating shipping NFTs
- `/components`: Reusable React components
- `/lib`: Utility functions and helpers
- `/styles`: Global styles and Tailwind CSS configuration

## Contributing

We welcome contributions to BARK Blinks! Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

## License

The MIT License. See the [LICENSE](LICENSE) file for details.
