use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token};
use mpl_token_metadata::instruction::create_metadata_accounts_v2;

mod blink;
mod nft;
mod collection;
mod errors;
mod donations;
mod payments;
mod mint;
mod swap;

use blink::*;
use nft::*;
use collection::*;
use errors::*;
use donations::*;
use payments::*;
use mint::*;
use swap::*;

declare_id!("BARK_PROGRAM_ID_HERE");

#[program]
pub mod blink_program {
    use super::*;

    // Existing instructions...

    pub fn create_swap(
        ctx: Context<CreateSwap>,
        amount_a: u64,
        amount_b: u64,
        fee: u64,
    ) -> Result<()> {
        swap::create_swap(ctx, amount_a, amount_b, fee)
    }

    pub fn execute_swap(ctx: Context<ExecuteSwap>) -> Result<()> {
        swap::execute_swap(ctx)
    }
}