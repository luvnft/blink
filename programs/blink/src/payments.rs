use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

#[account]
pub struct Payment {
    pub payer: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    pub currency: String,
    pub description: String,
    pub status: PaymentStatus,
    pub timestamp: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum PaymentStatus {
    Pending,
    Completed,
    Failed,
    Refunded,
}

#[derive(Accounts)]
pub struct CreatePayment<'info> {
    #[account(init, payer = payer, space = 8 + 32 + 32 + 8 + 4 + 10 + 4 + 200 + 1 + 8)]
    pub payment: Account<'info, Payment>,
    #[account(mut)]
    pub payer: Signer<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub recipient: AccountInfo<'info>,
    #[account(mut)]
    pub payer_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub recipient_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn create_payment(
    ctx: Context<CreatePayment>,
    amount: u64,
    currency: String,
    description: String,
) -> Result<()> {
    let payment = &mut ctx.accounts.payment;
    let clock = Clock::get()?;

    if currency.len() > 10 {
        return Err(BlinkError::InvalidCurrency.into());
    }

    if description.len() > 200 {
        return Err(BlinkError::DescriptionTooLong.into());
    }

    payment.payer = ctx.accounts.payer.key();
    payment.recipient = ctx.accounts.recipient.key();
    payment.amount = amount;
    payment.currency = currency;
    payment.description = description;
    payment.status = PaymentStatus::Pending;
    payment.timestamp = clock.unix_timestamp;

    // Transfer tokens from payer to recipient
    let cpi_accounts = Transfer {
        from: ctx.accounts.payer_token_account.to_account_info(),
        to: ctx.accounts.recipient_token_account.to_account_info(),
        authority: ctx.accounts.payer.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    token::transfer(cpi_ctx, amount)?;

    payment.status = PaymentStatus::Completed;

    Ok(())
}