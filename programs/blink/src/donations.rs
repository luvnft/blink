use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

#[account]
pub struct Donation {
    pub donor: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    pub currency: String,
    pub message: String,
    pub timestamp: i64,
}

#[derive(Accounts)]
pub struct CreateDonation<'info> {
    #[account(init, payer = donor, space = 8 + 32 + 32 + 8 + 4 + 10 + 4 + 200 + 8)]
    pub donation: Account<'info, Donation>,
    #[account(mut)]
    pub donor: Signer<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub recipient: AccountInfo<'info>,
    #[account(mut)]
    pub donor_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub recipient_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn create_donation(
    ctx: Context<CreateDonation>,
    amount: u64,
    currency: String,
    message: String,
) -> Result<()> {
    let donation = &mut ctx.accounts.donation;
    let clock = Clock::get()?;

    if currency.len() > 10 {
        return Err(BlinkError::InvalidCurrency.into());
    }

    if message.len() > 200 {
        return Err(BlinkError::MessageTooLong.into());
    }

    donation.donor = ctx.accounts.donor.key();
    donation.recipient = ctx.accounts.recipient.key();
    donation.amount = amount;
    donation.currency = currency;
    donation.message = message;
    donation.timestamp = clock.unix_timestamp;

    // Transfer tokens from donor to recipient
    let cpi_accounts = Transfer {
        from: ctx.accounts.donor_token_account.to_account_info(),
        to: ctx.accounts.recipient_token_account.to_account_info(),
        authority: ctx.accounts.donor.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    token::transfer(cpi_ctx, amount)?;

    Ok(())
}