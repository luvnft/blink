# BARK BLINK API Documentation

## Introduction

Welcome to the BARK BLINK API documentation. This API allows you to interact with the BARK BLINK platform, managing blinks, NFTs, collections, and user accounts. The API is RESTful and uses JSON for request and response bodies.

## Base URL

All API requests should be made to:

```plaintext
https://api.blink.barkprotocol.com/v1
```

## Authentication

The BARK BLINK API uses Bearer token authentication. Include the token in the Authorization header of your requests:

```plaintext
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Error Handling

The API uses conventional HTTP response codes to indicate the success or failure of requests. Codes in the 2xx range indicate success, codes in the 4xx range indicate an error that failed given the information provided (e.g., a required parameter was omitted), and codes in the 5xx range indicate an error with our servers.

Error responses will have the following structure:

```json
{
  "error": "Error message here"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse. If you exceed the rate limit, you'll receive a 429 (Too Many Requests) response. Please implement appropriate backoff strategies in your applications.

## Endpoints

### Account

#### Get User Account Details

```plaintext
GET /account
```

Retrieves the details of the authenticated user's account.

**Response**

```json
{
  "user": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "account": {
      "avatar": "https://example.com/avatar.jpg",
      "walletAddress": "solana_wallet_address_here"
    }
  }
}
```

#### Update User Account Details

```plaintext
PUT /account
```

Updates the authenticated user's account details.

**Request Body**

```json
{
  "name": "John Smith",
  "avatar": "https://example.com/new-avatar.jpg",
  "walletAddress": "new_solana_wallet_address_here"
}
```

**Response**

```json
{
  "user": {
    "id": "user123",
    "name": "John Smith",
    "email": "john@example.com",
    "account": {
      "avatar": "https://example.com/new-avatar.jpg",
      "walletAddress": "new_solana_wallet_address_here"
    }
  }
}
```

### Blinks

#### Get User's Blinks

```plaintext
GET /blinks
```

Retrieves a list of blinks owned by the authenticated user.

**Query Parameters**

- `limit` (optional): Number of blinks to return (default: 10)
- `offset` (optional): Number of blinks to skip (default: 0)


**Response**

```json
{
  "blinks": [
    {
      "id": "blink123",
      "name": "My First Blink",
      "description": "This is a test blink",
      "imageUrl": "https://example.com/blink.jpg",
      "mintAddress": "solana_mint_address_here",
      "owner": {
        "id": "user123",
        "name": "John Doe"
      },
      "blinkType": "STANDARD",
      "createdAt": "2023-06-01T12:00:00Z",
      "updatedAt": "2023-06-01T12:00:00Z"
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 10,
    "offset": 0
  }
}
```

#### Create a New Blink

```plaintext
POST /blinks
```

Creates a new blink for the authenticated user.

**Request Body**

```json
{
  "name": "My New Blink",
  "description": "This is a brand new blink",
  "imageUrl": "https://example.com/new-blink.jpg",
  "blinkType": "NFT"
}
```

**Response**

```json
{
  "id": "blink124",
  "name": "My New Blink",
  "description": "This is a brand new blink",
  "imageUrl": "https://example.com/new-blink.jpg",
  "mintAddress": "new_solana_mint_address_here",
  "owner": {
    "id": "user123",
    "name": "John Doe"
  },
  "blinkType": "NFT",
  "createdAt": "2023-06-02T10:00:00Z",
  "updatedAt": "2023-06-02T10:00:00Z"
}
```

#### Get a Specific Blink

```plaintext
GET /blinks/{id}
```

Retrieves details of a specific blink.

**Response**

```json
{
  "id": "blink123",
  "name": "My First Blink",
  "description": "This is a test blink",
  "imageUrl": "https://example.com/blink.jpg",
  "mintAddress": "solana_mint_address_here",
  "owner": {
    "id": "user123",
    "name": "John Doe"
  },
  "blinkType": "STANDARD",
  "createdAt": "2023-06-01T12:00:00Z",
  "updatedAt": "2023-06-01T12:00:00Z"
}
```

#### Update a Specific Blink

```plaintext
PUT /blinks/{id}
```

Updates details of a specific blink.

**Request Body**

```json
{
  "name": "Updated Blink Name",
  "description": "This is an updated description",
  "imageUrl": "https://example.com/updated-blink.jpg",
  "blinkType": "GIFT"
}
```

**Response**

```json
{
  "id": "blink123",
  "name": "Updated Blink Name",
  "description": "This is an updated description",
  "imageUrl": "https://example.com/updated-blink.jpg",
  "mintAddress": "solana_mint_address_here",
  "owner": {
    "id": "user123",
    "name": "John Doe"
  },
  "blinkType": "GIFT",
  "createdAt": "2023-06-01T12:00:00Z",
  "updatedAt": "2023-06-02T14:00:00Z"
}
```

#### Delete a Specific Blink

```plaintext
DELETE /blinks/{id}
```

Deletes a specific blink.

**Response**

```json
{
  "message": "Blink successfully deleted"
}
```

### NFTs

#### Get User's NFTs

```plaintext
GET /nft
```

Retrieves a list of NFTs owned by the authenticated user.

**Response**

```json
{
  "nfts": [
    {
      "id": "nft123",
      "name": "My First NFT",
      "description": "This is a test NFT",
      "image": "https://example.com/nft.jpg",
      "mintAddress": "solana_nft_mint_address_here",
      "owner": {
        "id": "user123",
        "name": "John Doe"
      },
      "attributes": [
        {
          "trait_type": "Background",
          "value": "Blue"
        }
      ],
      "createdAt": "2023-06-01T12:00:00Z"
    }
  ]
}
```

#### Create a New NFT

```plaintext
POST /nft
```

Creates a new NFT for the authenticated user.

**Request Body**

```json
{
  "name": "My New NFT",
  "description": "This is a brand new NFT",
  "image": "https://example.com/new-nft.jpg",
  "attributes": [
    {
      "trait_type": "Background",
      "value": "Red"
    }
  ]
}
```

**Response**

```json
{
  "id": "nft124",
  "name": "My New NFT",
  "description": "This is a brand new NFT",
  "image": "https://example.com/new-nft.jpg",
  "mintAddress": "new_solana_nft_mint_address_here",
  "owner": {
    "id": "user123",
    "name": "John Doe"
  },
  "attributes": [
    {
      "trait_type": "Background",
      "value": "Red"
    }
  ],
  "createdAt": "2023-06-02T10:00:00Z"
}
```

### Collections

#### Get User's Collections

```plaintext
GET /collection
```

Retrieves a list of collections created by the authenticated user.

**Response**

```json
{
  "collections": [
    {
      "id": "collection123",
      "name": "My First Collection",
      "description": "This is a test collection",
      "image": "https://example.com/collection.jpg",
      "symbol": "MFC",
      "address": "solana_collection_address_here",
      "creator": {
        "id": "user123",
        "name": "John Doe"
      },
      "createdAt": "2023-06-01T12:00:00Z"
    }
  ]
}
```

#### Create a New Collection

```plaintext
POST /collection
```

Creates a new collection for the authenticated user.

**Request Body**

```json
{
  "name": "My New Collection",
  "description": "This is a brand new collection",
  "image": "https://example.com/new-collection.jpg",
  "symbol": "MNC"
}
```

**Response**

```json
{
  "id": "collection1",
  "name": "My New Collection",
  "description": "This is a brand new collection",
  "image": "https://example.com/new-collection.jpg",
  "symbol": "MNC",
  "address": "new_solana_collection_address_here",
  "creator": {
    "id": "user123",
    "name": "John Doe"
  },
  "createdAt": "2024-06-02T10:00:00Z"
}
```

### Assets

#### Get User's Assets

```plaintext
GET /assets
```

Retrieves a list of assets uploaded by the authenticated user.

**Response**

```json
{
  "assets": [
    {
      "id": "asset123",
      "fileName": "image.jpg",
      "fileType": "image/jpeg",
      "fileSize": 1024000,
      "url": "https://storage.barkblink.com/user123/image.jpg",
      "createdAt": "2024-06-01T12:00:00Z"
    }
  ]
}
```

#### Create a New Asset

```plaintext
POST /assets
```

Initiates the process of uploading a new asset for the authenticated user.

**Request Body**

```json
{
  "fileName": "new-image.png",
  "fileType": "image/png",
  "fileSize": 2048000
}
```

**Response**

```json
{
  "asset": {
    "id": "asset124",
    "fileName": "new-image.png",
    "fileType": "image/png",
    "fileSize": 2048000,
    "url": "https://storage.barkprotocol.com/user123/new-image.png",
    "createdAt": "2024-06-02T10:00:00Z"
  },
  "uploadUrl": "https://upload.barkprotocol.com/presigned-url-here"
}
```

Use the `uploadUrl` to upload the file contents directly to our storage service.

## Conclusion

This documentation covers the main endpoints of the BARK BLINK API. For any questions or issues, please contact our support team at [support@barkblink.com](mailto:support@barkprotocol.com).