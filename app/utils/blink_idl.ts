import { Idl } from '@coral-xyz/anchor';

export const IDL: Idl = {
  version: "0.1.0",
  name: "blink",
  instructions: [
    {
      name: "createBlink",
      accounts: [
        {
          name: "blink",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "description",
          type: "string",
        },
        {
          name: "blinkType",
          type: {
            defined: "BlinkType",
          },
        },
        {
          name: "imageUrl",
          type: "string",
        },
      ],
    },
    {
      name: "updateBlink",
      accounts: [
        {
          name: "blink",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "description",
          type: "string",
        },
        {
          name: "imageUrl",
          type: "string",
        },
      ],
    },
    {
      name: "deleteBlink",
      accounts: [
        {
          name: "blink",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
      ],
      args: [],
    },
    {
      name: "createNft",
      accounts: [
        {
          name: "nft",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "metadata",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: true,
          isSigner: true,
        },
        {
          name: "tokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "metadataProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "symbol",
          type: "string",
        },
        {
          name: "uri",
          type: "string",
        },
      ],
    },
    {
      name: "createCollection",
      accounts: [
        {
          name: "collection",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "symbol",
          type: "string",
        },
        {
          name: "uri",
          type: "string",
        },
      ],
    },
    {
      name: "addNftToCollection",
      accounts: [
        {
          name: "nft",
          isMut: true,
          isSigner: false,
        },
        {
          name: "collection",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: false,
          isSigner: true,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "Blink",
      type: {
        kind: "struct",
        fields: [
          {
            name: "owner",
            type: "publicKey",
          },
          {
            name: "name",
            type: "string",
          },
          {
            name: "description",
            type: "string",
          },
          {
            name: "imageUrl",
            type: "string",
          },
          {
            name: "blinkType",
            type: {
              defined: "BlinkType",
            },
          },
          {
            name: "createdAt",
            type: "i64",
          },
          {
            name: "updatedAt",
            type: "i64",
          },
        ],
      },
    },
    {
      name: "NFT",
      type: {
        kind: "struct",
        fields: [
          {
            name: "owner",
            type: "publicKey",
          },
          {
            name: "mint",
            type: "publicKey",
          },
          {
            name: "name",
            type: "string",
          },
          {
            name: "symbol",
            type: "string",
          },
          {
            name: "uri",
            type: "string",
          },
          {
            name: "collection",
            type: "publicKey",
          },
          {
            name: "createdAt",
            type: "i64",
          },
        ],
      },
    },
    {
      name: "Collection",
      type: {
        kind: "struct",
        fields: [
          {
            name: "owner",
            type: "publicKey",
          },
          {
            name: "name",
            type: "string",
          },
          {
            name: "symbol",
            type: "string",
          },
          {
            name: "uri",
            type: "string",
          },
          {
            name: "createdAt",
            type: "i64",
          },
        ],
      },
    },
  ],
  types: [
    {
      name: "BlinkType",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Standard",
          },
          {
            name: "NFT",
          },
          {
            name: "Donation",
          },
          {
            name: "Gift",
          },
          {
            name: "Payment",
          },
          {
            name: "Poll",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "NameTooLong",
      msg: "Name is too long",
    },
    {
      code: 6001,
      name: "DescriptionTooLong",
      msg: "Description is too long",
    },
    {
      code: 6002,
      name: "InvalidBlinkType",
      msg: "Invalid blink type",
    },
    {
      code: 6003,
      name: "Unauthorized",
      msg: "You are not authorized to perform this action",
    },
    {
      code: 6004,
      name: "InvalidNFTMetadata",
      msg: "Invalid NFT metadata",
    },
    {
      code: 6005,
      name: "CollectionFull",
      msg: "Collection is full",
    },
  ],
};