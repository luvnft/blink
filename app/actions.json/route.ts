import { ACTIONS_CORS_HEADERS, ActionsJson } from "@solana/actions";

export const GET = async () => {
  const payload: ActionsJson = {
    rules: [
      // Blinks
      {
        pathPattern: "/blinks",
        apiPath: "/api/v1/blinks?limit={limit}&offset={offset}",
      },
      {
        pathPattern: "/blinks/:id",
        apiPath: "/api/v1/blinks/{id}",
      },
      {
        pathPattern: "/blinks/:id/transfer",
        apiPath: "/api/v1/blinks/{id}/transfer",
      },
      {
        pathPattern: "/blinks/create",
        apiPath: "/api/v1/blinks/create",
      },

      // NFTs
      {
        pathPattern: "/nfts",
        apiPath: "/api/v1/nfts?limit={limit}&offset={offset}",
      },
      {
        pathPattern: "/nfts/:id",
        apiPath: "/api/v1/nfts/{id}",
      },
      {
        pathPattern: "/nfts/create",
        apiPath: "/api/v1/nfts/create",
      },
      {
        pathPattern: "/nfts/:id/mint",
        apiPath: "/api/v1/nfts/{id}/mint",
      },

      // Financial Operations
      {
        pathPattern: "/swap",
        apiPath: "/api/v1/swap?fromToken={fromToken}&toToken={toToken}&amount={amount}",
      },
      {
        pathPattern: "/payments",
        apiPath: "/api/v1/payments",
      },
      {
        pathPattern: "/donations",
        apiPath: "/api/v1/donations",
      },

      // Commerce
      {
        pathPattern: "/commerce/products",
        apiPath: "/api/v1/commerce/products?limit={limit}&offset={offset}",
      },
      {
        pathPattern: "/commerce/orders",
        apiPath: "/api/v1/commerce/orders",
      },

      // Staking
      {
        pathPattern: "/staking/info",
        apiPath: "/api/v1/staking/info",
      },
      {
        pathPattern: "/staking/stake",
        apiPath: "/api/v1/staking/stake",
      },
      {
        pathPattern: "/staking/unstake",
        apiPath: "/api/v1/staking/unstake",
      },

      // User Management
      {
        pathPattern: "/user/profile",
        apiPath: "/api/v1/user/profile",
      },
      {
        pathPattern: "/user/wallet",
        apiPath: "/api/v1/user/wallet",
      },
      {
        pathPattern: "/user/settings",
        apiPath: "/api/v1/user/settings",
      },

      // Miscellaneous
      {
        pathPattern: "/",
        apiPath: "/api/v1/actions",
      },
    ],
    metadata: {
      name: "BARK Blinks",
      description: "Create, manage, and trade digital assets on the Solana blockchain",
      icon: "https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png",
      website: "https://blinks.barkprotocol.net",
      version: "1.0.0",
      documentation: "https://docs.barkprotocol.net/blinks/api",
      support: {
        email: "support@barkprotocol.net",
        x: "@bark_protocol",
        discord: "https://discord.gg/barkprotocol",
      },
      legal: {
        terms: "https://blinks.barkprotocol.net/legals/terms",
        privacy: "https://blinks.barkprotocol.net/legals/privacy",
      },
    },
  };

  return Response.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
  });
};

export const OPTIONS = GET;

export const runtime = "edge";