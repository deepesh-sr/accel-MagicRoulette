use anchor_lang::prelude::*;

use crate::BetType;

#[event]
pub struct RoundAdvanced {
    pub round: Pubkey,
    pub round_number: u64,
    pub outcome: u8,
    pub timestamp: i64,
}

#[event]
pub struct WinningsClaimed {
    pub player: Pubkey,
    pub winnings: u64,
    pub timestamp: i64,
}

#[event]
pub struct BetPlaced {
    pub player: Pubkey,
    pub round: Pubkey,
    pub bet_type: BetType,
    pub bet_amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct RouletteSpun {
    pub round: Pubkey,
    pub round_number: u64,
    pub timestamp: i64,
}

#[event]
pub struct TableUpdated {
    pub minimum_bet_amount: Option<u64>,
    pub round_period_ts: Option<u64>,
    pub new_admin: Option<Pubkey>,
    pub timestamp: i64,
}

#[event]
pub struct VaultWithdrawn {
    pub amount: u64,
    pub timestamp: i64,
}
