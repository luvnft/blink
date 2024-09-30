use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};
use mpl_token_metadata::instruction::create_metadata_accounts_v2;

#[derive(Accounts)]
pub struct CreateMint<'info> {
    #[account(mut)]
    pub mint_authority: Signer<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub mint: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub metadata: AccountInfo<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub token_metadata_program: AccountInfo<'info>,
}

pub fn create_mint(
    ctx: Context<CreateMint>,
    name: String,
    symbol: String,
    uri: String,
) -> Result<()> {
    let mint = &ctx.accounts.mint;
    let mint_authority = &ctx.accounts.mint_authority;
    let metadata = &ctx.accounts.metadata;
    let token_metadata_program = &ctx.accounts.token_metadata_program;
    let token_program = &ctx.accounts.token_program;
    let system_program = &ctx.accounts.system_program;
    let rent = &ctx.accounts.rent;

    // Create mint account
    let cpi_accounts = anchor_spl::token::InitializeMint {
        mint: mint.to_account_info(),
        rent: rent.to_account_info(),
    };
    let cpi_program = token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    anchor_spl::token::initialize_mint(cpi_ctx, 0, mint_authority.key, Some(mint_authority.key))?;

    // Create metadata account
    let create_metadata_ix = create_metadata_accounts_v2(
        token_metadata_program.key(),
        metadata.key(),
        mint.key(),
        mint_authority.key(),
        mint_authority.key(),
        mint_authority.key(),
        name,
        symbol,
        uri,
        None,
        0,
        true,
        false,
        None,
        None,
    );

    anchor_lang::solana_program::program::invoke(
        &create_metadata_ix,
        &[
            metadata.to_account_info(),
            mint.to_account_info(),
            mint_authority.to_account_info(),
            token_metadata_program.to_account_info(),
            token_program.to_account_info(),
            system_program.to_account_info(),
            rent.to_account_info(),
        ],
    )?;

    Ok(())
}