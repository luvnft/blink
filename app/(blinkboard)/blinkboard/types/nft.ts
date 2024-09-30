export interface NFTMetadata {
    name: string
    description: string
    imageUrl: string
    attributes: NFTAttribute[]
  }
  
  export interface NFTAttribute {
    traitType: string
    value: string
  }
  
  export interface NFTMinting {
    tokenId: string
    metadataUrl: string
    creator: string
    dateMinted: number
  }
  
  export interface NFTStake {
    nftId: string
    staker: string
    startDate: number
    duration: number // In days or blocks
    rewardAmount: number
  }
  
  export interface NFTTransfer {
    nftId: string
    sender: string
    recipient: string
    transferDate: number
  }
  