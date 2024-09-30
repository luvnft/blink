use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

#[account]
pub struct Swap {
    pub owner: Pubkey,
    pub token_a: Pubkey,
    pub token_b: Pubkey,
    pub amount_a: u64,
    pub amount_b: u64,
    pub fee: u64,
    pub created_at: i64,
    pub executed_at: Option<i64>,
}

#[derive(Accounts)]
pub struct CreateSwap<'info> {
    #[account(init, payer = owner, space = 8 + 32 + 32 + 32 + 8 + 8 + 8 + 8 + 8)]
    pub swap: Account<'info, Swap>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub token_a: Account<'info, TokenAccount>,
    pub token_b: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ExecuteSwap<'info> {
    #[account(mut, has_one = owner)]
    pub swap: Account<'info, Swap>,
    pub owner: Signer<'info>,
    #[account(mut)]
    pub token_a_source: Account<'info, TokenAccount>,
    #[account(mut)]
    pub token_a_destination: Account<'info, TokenAccount>,
    #[account(mut)]
    pub token_b_source: Account<'info, TokenAccount>,
    #[account(mut)]
    pub token_b_destination: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

pub fn create_swap(
    ctx: Context<CreateSwap>,
    amount_a: u64,
    amount_b: u64,
    fee: u64,
) -> Result<()> {
    let swap = &mut ctx.accounts.swap;
    let clock = Clock::get()?;

    swap.owner = ctx.accounts.owner.key();
    swap.token_a = ctx.accounts.token_a.key();
    swap.token_b = ctx.accounts.token_b.key();
    swap.amount_a = amount_a;
    swap.amount_b = amount_b;
    swap.fee = fee;
    swap.created_at = clock.unix_timestamp;
    swap.executed_at = None;

    Ok(())
}

pub fn execute_swap(ctx: Context<ExecuteSwap>) -> Result<()> {
    let swap = &mut ctx.accounts.swap;
    let clock = Clock::get()?;

    // Transfer token A from source to destination
    let cpi_accounts_a = Transfer {
        from: ctx.accounts.token_a_source.to_account_info(),
        to: ctx.accounts.token_a_destination.to_account_info(),
        authority: ctx.accounts.owner.to_account_info(),
    };
    let cpi_program_a = ctx.accounts.token_program.to_account_info();
    let cpi_ctx_a = CpiContext::new(cpi_program_a, cpi_accounts_a);
    token::transfer(cpi_ctx_a, swap.amount_a)?;

    // Transfer token B from source to destination
    let cpi_accounts_b = Transfer {
        from: ctx.accounts.token_b_source.to_account_info(),
        to: ctx.accounts.token_b_destination.to_account_info(),
        authority: ctx.accounts.owner.to_account_info(),
    };
    let cpi_program_b = ctx.accounts.token_program.to_account_info();
    let cpi_ctx_b = CpiContext::new(cpi_program_b, cpi_accounts_b);
    token::transfer(cpi_ctx_b, swap.amount_b)?;

    // Update swap state
    swap.executed_at = Some(clock.unix_timestamp);

    Ok(())
}

pub fn calculate_swap_amount(
    amount_in: u64,
    reserve_in: u64,
    reserve_out: u64,
    fee: u64,
) -> Result<u64> {
    if amount_in == 0 || reserve_in == 0 || reserve_out == 0 {
        return Err(BlinkError::InvalidSwapParameters.into());
    }

    let amount_in_with_fee = amount_in
        .checked_mul(1000 - fee)
        .ok_or(BlinkError::MathOverflow)?;

    let numerator = amount_in_with_fee
        .checked_mul(reserve_out)
        .ok_or(BlinkError::MathOverflow)?;

    let denominator = reserve_in
        .checked_mul(1000)
        .ok_or(BlinkError::MathOverflow)?
        .checked_add(amount_in_with_fee)
        .ok_or(BlinkError::MathOverflow)?;

    let amount_out = numerator
        .checked_div(denominator)
        .ok_or(BlinkError::MathOverflow)?;

    Ok(amount_out)
}