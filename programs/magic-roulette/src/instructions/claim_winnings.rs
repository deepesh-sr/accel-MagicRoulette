use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};

use crate::{error::MagicRouletteError, Bet, Round, Table, ROUND_SEED, TABLE_SEED, VAULT_SEED};

#[derive(Accounts)]
pub struct ClaimWinnings<'info> {
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(
        mut,
        seeds = [VAULT_SEED],
        bump = table.vault_bump,
    )]
    pub vault: SystemAccount<'info>,
    #[account(
        seeds = [TABLE_SEED],
        bump = table.bump
    )]
    pub table: Account<'info, Table>,
    #[account(
        mut,
        seeds = [ROUND_SEED, round.round_number.to_le_bytes().as_ref()],
        bump = round.bump
    )]
    pub round: Account<'info, Round>,
    #[account(
        mut,
        close = player,
        has_one = player @ MagicRouletteError::InvalidPlayer,
        has_one = round @ MagicRouletteError::InvalidRound,
    )]
    pub bet: Account<'info, Bet>,
    pub system_program: Program<'info, System>,
}

impl<'info> ClaimWinnings<'info> {
    pub fn handler(&mut self) -> Result<()> {
        self.round.is_claimed = true;

        transfer(
            CpiContext::new(
                self.system_program.to_account_info(),
                Transfer {
                    from: self.vault.to_account_info(),
                    to: self.player.to_account_info(),
                },
            ),
            self.round.pool_amount,
        )?;

        Ok(())
    }
}
