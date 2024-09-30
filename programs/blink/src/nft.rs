use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token};
use mpl_token_metadata::instruction::create_metadata_accounts_v2;

#[account]
pub struct NFT {
    pub owner: Pubkey,
    pub mint: Pubkey,
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub collection: Pubkey,
    pub created_at: i64,
}

#[derive(Accounts)]
pub struct CreateNFT<'info> {
    #[account(init, payer = owner, space = 8 + 32 + 32 + 4 + 50 + 4 + 10 + 4 + 200 + 32 + 8)]
    pub nft: Account<'info, NFT>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub metadata: AccountInfo<'info>,
    #[account(mut)]
    pub mint: Signer<'info>,
    #[account(mut)]
    pub token_account: AccountInfo<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub metadata_program: AccountInfo<'info>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn create_nft(
    ctx: Context<CreateNFT>,
    name: String,
    symbol: String,
    uri: String,
) -> Result<()> {
    let nft = &mut ctx.accounts.nft;
    let owner = &ctx.accounts.owner;
    let clock = Clock::get()?;

    if name.len() > 32 {
        return Err(BlinkError::NameTooLong.into());
    }

    if symbol.len() > 10 {
        return Err(BlinkError::SymbolTooLong.into());
    }

    nft.owner = *owner.key;
    nft.mint = ctx.accounts.mint.key();
    nft.name = name.clone();
    nft.symbol = symbol.clone();
    nft.uri = uri.clone();
    nft.collection = Pubkey::default(); // Set to default, update when added to a collection
    nft.created_at = clock.unix_timestamp;

    // Create metadata account
    let create_metadata_ix = create_metadata_accounts_v2(
        ctx.accounts.metadata_program.key(),
        ctx.accounts.metadata.key(),
        ctx.accounts.mint.key(),
        ctx.accounts.owner.key(),
        ctx.accounts.owner.key(),
        ctx.accounts.owner.key(),
        name,
        symbol,
        uri,
        None,
        0,
        true,
        true,
        None,
        None,
    );

    anchor_lang::solana_program::program::invoke(
        &create_metadata_ix,
        &[
            ctx.accounts.metadata.to_account_info(),
            ctx.accounts.mint.to_account_info(),
            ctx.accounts.owner.to_account_info(),
            ctx.accounts.metadata_program.to_account_info(),
            ctx.accounts.token_program.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
            ctx.accounts.rent.to_account_info(),
        ],
    )?;

    Ok(())
}