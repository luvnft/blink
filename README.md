# BARK - BLINKS Web UI

Welcome to the BARK - BLINKS Web UI project! This repository contains the frontend code for the BARK Protocol's Blinks As A Service platform, built using Next.js, React, and Tailwind CSS.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Blinkboard](#blinkboard)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Overview

BARK - BLINKS is a cutting-edge platform that leverages the power of the Solana blockchain to create, manage, and trade digital assets called Blinks. This web interface provides users with an intuitive and seamless experience to interact with the BARK Protocol, enabling them to participate in the future of digital interactions and asset management.

## Features

- Create and customize Solana Blinks with unique attributes
- Manage your Blink collection in a user-friendly dashboard
- Trade Blinks on supported marketplaces
- Integrated token swapping for efficient asset management
- Secure wallet connection for safe transactions
- Real-time updates and notifications
- Comprehensive analytics and portfolio tracking
- Social sharing capabilities for Blinks

## Blinkboard (under construction)

Blinkboard is the central dashboard of the BARK - BLINKS platform. It provides users with a comprehensive overview and management interface for their Blinks and related activities.

Key features of Blinkboard include:

- Real-time portfolio tracking and valuation
- Blink creation and customization tools
- Transaction history and detailed analytics
- Marketplace integration for trading Blinks
- Staking and reward management
- User profile and settings customization
- Activity feed and social interactions
- Notification center for important updates

Blinkboard is designed to be user-friendly and intuitive, allowing both newcomers and experienced users to easily navigate and utilize the full potential of the BARK Protocol.

## Screenshots

### Hero Section
![Hero Section](.github/assets/hero.png)

### Features
![Features Section](.github/assets/features.png)

### How It Works
![How It Works Section](.github/assets/how-it-works.png)

### Call to Action
![Call to Action Section](.github/assets/cta.png)

### FAQ
![FAQ Section](.github/assets/faq.png)

### Newsletter
![Newsletter Section](.github/assets/newsletter.png)

## Getting Started

To get started with the BARK - BLINKS Web UI, follow these steps:

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

## Prisma

1. Set the DATABASE_URL in the .env file to point to your existing database. If your database has no tables yet, read https://pris.ly/d/getting-started
2. Set the provider of the datasource block in schema.prisma to match your database: postgresql, mysql, sqlite, sqlserver, mongodb or cockroachdb.
3. Run npx prisma db pull to turn your database schema into a Prisma schema.
4. Run npx prisma generate to generate the Prisma Client. You can then start querying your database.
5. Tip: Explore how you can extend the ORM with scalable connection pooling, global caching, and real-time database events. Read: https://pris.ly/cli/beyond-orm

More information in our documentation: https://pris.ly/d/getting-started

## API Routes (under constructions)

The application includes several API routes for interacting with the Solana blockchain:

- `/api/v1/create-blink`: Create a new Solana Blink
- `/api/v1/send-blink`: Transfer a Blink to another user
- `/api/v1/get-user-blinks`: Retrieve a user's Blink collection
- `/api/v1/create-spl-token`: Create a new SPL token
- `/api/v1/swap-tokens`: Perform a token swap

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