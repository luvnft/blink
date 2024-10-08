# BARK BLINK API Documentation

## Introduction

Welcome to the BARK BLINK API documentation. This API allows you to interact with the BARK BLINK platform, managing blinks, NFTs, collections, and user accounts. The API is RESTful and uses JSON for request and response bodies.

## Base URL

the BARK BLINK API based on the provided OpenAPI specification:

1. API Information:

1. Title: BARK BLINK API
2. Version: 1.0.0
3. Description: API for the BARK BLINK Solana application, providing functionality for managing blinks, NFTs, collections, and more.
4. Base URL: [https://api.barkprotocol.com/v1](https://api.barkprotocol.com/v1)



2. Authentication:

1. Uses Bearer Token authentication



3. Main Endpoints:

a. Account Management:

1. GET /account: Retrieve user account details
2. PUT /account: Update user account details


b. Blinks:

1. GET /blinks: Retrieve user's blinks (with pagination)
2. POST /blinks: Create a new blink
3. GET /blinks/id: Get a specific blink
4. PUT /blinks/id: Update a specific blink
5. DELETE /blinks/id: Delete a specific blink


c. NFTs:

1. GET /nft: Retrieve user's NFTs
2. POST /nft: Create a new NFT


d. Collections:

1. GET /collection: Retrieve user's collections
2. POST /collection: Create a new collection


e. Assets:

1. GET /assets: Retrieve user's assets
2. POST /assets: Create a new asset



4. Key Data Models:

a. Blink:

1. Properties: id, name, description, imageUrl, mintAddress, owner, blinkType, createdAt, updatedAt
2. Blink Types: STANDARD, NFT, DONATION, GIFT, PAYMENT, POLL


b. NFT:

1. Properties: id, name, description, image, mintAddress, owner, attributes, createdAt


c. Collection:

1. Properties: id, name, description, image, symbol, address, creator, createdAt


d. Asset:

1. Properties: id, fileName, fileType, fileSize, url, createdAt



5. Error Handling:

1. Consistent error responses for Bad Request (400), Unauthorized (401), Not Found (404), and Internal Server Error (500)


6. Additional Notes:

1. The API uses JSON for request and response bodies
2. Pagination is implemented for the /blinks endpoint
3. The API supports creating, reading, updating, and deleting various entities related to the BARK BLINK ecosystem
