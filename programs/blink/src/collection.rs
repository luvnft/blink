use anchor_lang::prelude::*;

#[account]
pub struct Collection {
    pub owner: Pubkey,
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub created_at: i64,
}

#[derive(Accounts)]
pub struct CreateCollection<'info> {
    #[account(init, payer = owner, space = 8 + 32 + 4 + 50 + 4 + 10 + 4 + 200 + 8)]
    pub collection: Account<'info, Collection>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddNFTToCollection<'info> {
    #[account(mut)]
    pub nft: Account<'info, super::nft::NFT>,
    #[account(mut, has_one = owner)]
    pub collection: Account<'info, Collection>,
    pub owner: Signer<'info>,
}

pub fn create_collection(
    ctx: Context<CreateCollection>,
    name: String,
    symbol: String,
    uri: String,
) -> Result<()> {
    let collection = &mut ctx.accounts.collection;
    let owner = &ctx.accounts.owner;
    let clock = Clock::get()?;

    if name.len() > 32 {
        return Err(BlinkError::NameTooLong.into());
    }

    if symbol.len() > 10 {
        return Err(BlinkError::SymbolTooLong.into());
    }

    collection.owner = *owner.key;
    collection.name = name;
    collection.symbol = symbol;
    collection.uri = uri;
    collection.created_at = clock.unix_timestamp;

    Ok(())
}

pub fn add_nft_to_collection(ctx: Context<AddNFTToCollection>) -> Result<()> {
    let nft = &mut ctx.accounts.nft;
    let collection = &ctx.accounts.collection;

    nft.collection = collection.key();

    Ok(())
}