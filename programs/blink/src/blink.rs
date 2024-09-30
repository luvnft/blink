use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum BlinkType {
    Standard,
    NFT,
    Donation,
    Gift,
    Payment,
    Poll,
}

#[account]
pub struct Blink {
    pub owner: Pubkey,
    pub name: String,
    pub description: String,
    pub image_url: String,
    pub blink_type: BlinkType,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(Accounts)]
pub struct CreateBlink<'info> {
    #[account(init, payer = owner, space = 8 + 32 + 4 + 200 + 4 + 1000 + 4 + 200 + 1 + 8 + 8)]
    pub blink: Account<'info, Blink>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateBlink<'info> {
    #[account(mut, has_one = owner)]
    pub blink: Account<'info, Blink>,
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct DeleteBlink<'info> {
    #[account(mut, has_one = owner, close = owner)]
    pub blink: Account<'info, Blink>,
    #[account(mut)]
    pub owner: Signer<'info>,
}

pub fn create_blink(
    ctx: Context<CreateBlink>,
    name: String,
    description: String,
    blink_type: BlinkType,
    image_url: String,
) -> Result<()> {
    let blink = &mut ctx.accounts.blink;
    let owner = &ctx.accounts.owner;
    let clock = Clock::get()?;

    if name.len() > 50 {
        return Err(BlinkError::NameTooLong.into());
    }

    if description.len() > 200 {
        return Err(BlinkError::DescriptionTooLong.into());
    }

    blink.owner = *owner.key;
    blink.name = name;
    blink.description = description;
    blink.image_url = image_url;
    blink.blink_type = blink_type;
    blink.created_at = clock.unix_timestamp;
    blink.updated_at = clock.unix_timestamp;

    Ok(())
}

pub fn update_blink(
    ctx: Context<UpdateBlink>,
    name: String,
    description: String,
    image_url: String,
) -> Result<()> {
    let blink = &mut ctx.accounts.blink;
    let clock = Clock::get()?;

    if name.len() > 50 {
        return Err(BlinkError::NameTooLong.into());
    }

    if description.len() > 200 {
        return Err(BlinkError::DescriptionTooLong.into());
    }

    blink.name = name;
    blink.description = description;
    blink.image_url = image_url;
    blink.updated_at = clock.unix_timestamp;

    Ok(())
}

pub fn delete_blink(_ctx: Context<DeleteBlink>) -> Result<()> {
    // The account will be automatically closed and lamports returned to the owner
    Ok(())
}