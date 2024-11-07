use crate::config::{Config, ContractConfig};
use crate::protocol::ProtocolState;

use near_account_id::AccountId;
use near_crypto::InMemorySigner;

use serde_json::json;

pub async fn fetch_contract_state(
    rpc_client: &near_fetch::Client,
    contract_id: &AccountId,
) -> anyhow::Result<contract::Contract> {
    let contract_state: contract::Contract = rpc_client
        .view(contract_id, "state")
        .await
        .map_err(|e| {
            tracing::warn!(%e, "failed to fetch protocol state");
            e
        })?
        .json()?;

    Ok(contract_state)
}


pub async fn vote(
    rpc_client: &near_fetch::Client,
    signer: &InMemorySigner,
    contract_id: &AccountId,
    public_key: &near_crypto::PublicKey,
    vote: &contract::state::Vote
) -> anyhow::Result<bool> {
    tracing::info!(%public_key, %signer.account_id, "voting for proposal");
    let result = rpc_client
        .call(signer, contract_id, "vote")
        .args_json(json!({
            "public_key": public_key
        }))
        .max_gas()
        .retry_exponential(10, 5)
        .transact()
        .await
        .map_err(|e| {
            tracing::warn!(%e, "failed to vote for public key");
            e
        })?
        .json()?;

    Ok(result)
}
