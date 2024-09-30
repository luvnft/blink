use anchor_lang::prelude::*;

#[error_code]
pub enum BlinkError {
    #[msg("Name is too long")]
    NameTooLong,
    #[msg("Description is too long")]
    DescriptionTooLong,
    #[msg("Invalid blink type")]
    InvalidBlinkType,
    #[msg("You are not authorized to perform this action")]
    Unauthorized,
    #[msg("Invalid NFT metadata")]
    InvalidNFTMetadata,
    #[msg("Collection is full")]
    CollectionFull,
    #[msg("Symbol is too long")]
    SymbolTooLong,
    #[msg("Invalid currency")]
    InvalidCurrency,
    #[msg("Message is too long")]
    MessageTooLong,
    #[msg("Invalid payment status")]
    InvalidPaymentStatus,
    #[msg("Invalid swap parameters")]
    InvalidSwapParameters,
    #[msg("Math overflow")]
    MathOverflow,
    #[msg("Insufficient funds")]
    InsufficientFunds,
    #[msg("Invalid token account")]
    InvalidTokenAccount,
    #[msg("Invalid mint")]
    InvalidMint,
    #[msg("Invalid metadata")]
    InvalidMetadata,
    #[msg("Invalid collection")]
    InvalidCollection,
    #[msg("Blink not found")]
    BlinkNotFound,
    #[msg("NFT not found")]
    NFTNotFound,
    #[msg("Collection not found")]
    CollectionNotFound,
    #[msg("Swap not found")]
    SwapNotFound,
    #[msg("Donation not found")]
    DonationNotFound,
    #[msg("Payment not found")]
    PaymentNotFound,
    #[msg("Invalid fee")]
    InvalidFee,
    #[msg("Fee exceeds maximum allowed")]
    FeeTooHigh,
    #[msg("Slippage tolerance exceeded")]
    SlippageExceeded,
    #[msg("Deadline exceeded")]
    DeadlineExceeded,
    #[msg("Invalid signature")]
    InvalidSignature,
    #[msg("Account already initialized")]
    AccountAlreadyInitialized,
    #[msg("Account not initialized")]
    AccountNotInitialized,
    #[msg("Invalid program address")]
    InvalidProgramAddress,
    #[msg("Invalid system program")]
    InvalidSystemProgram,
    #[msg("Invalid token program")]
    InvalidTokenProgram,
    #[msg("Invalid associated token program")]
    InvalidAssociatedTokenProgram,
    #[msg("Invalid rent sysvar")]
    InvalidRentSysvar,
}