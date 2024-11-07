use std::collections::HashMap;

use near_sdk::{near, AccountId};

#[near(serializers = [json,borsh])]
#[derive(Clone)]
pub struct NetworkState {
    pub workers: Vec<AccountId>,
}

/// Represents the model training state i.e the workers,the aggregator node
#[near(serializers = [json,borsh])]
#[derive(Clone)]
pub struct RequestsState {
    pub status: ModelStatus,
    pub workers: Vec<AccountId>,
    pub datasets: HashMap<AccountId, ModelData>, // the key is the publisher account id
    pub model_cid: Vec<String>,
    pub creator: AccountId,
    pub epochs: u32,
}

#[near(serializers = [json,borsh])]
#[derive(Clone)]
pub struct ModelData {
    pub dataset: String,                // cid for ipfs
    pub compressed_secret_key: Vec<u8>, // the compressed serialized secret for the client
}

#[near(serializers = [json,borsh])]
#[derive(Clone)]
pub enum ModelStatus {
    Pending, // The pending state is that it is waiting for the workers to join
    Training,
    Finished,
}

// governance structs for adding workers and removing workers
#[near(serializers = [json,borsh])]
#[derive(Clone)]
pub struct Proposal {
    proposal_id: u32,
    pub proposal_type: ProposalType,
    pub creator: AccountId,
    pub status: ProposalStatus,
    pub votes: HashMap<AccountId, Vote>,
    pub for_votes: u32,
    pub angaist_votes: u32,
}

#[near(serializers = [json,borsh])]
#[derive(Clone)]
pub enum ProposalType {
    AddWorker(AccountId),
    RemoveWorker(AccountId),
    ChangeBaseFee(u32),
    ChangeStakeAmount(u32)
}

#[near(serializers = [json,borsh])]
#[derive(Clone)]
pub enum ProposalStatus {
    Pending,
    Approved,
    Rejected,
}

#[near(serializers = [json,borsh])]
#[derive(Clone)]
pub enum Vote {
    For,
    Against,
}

#[near(serializers = [json,borsh])]
#[derive(Clone)]
pub struct GovernanceState {
    pub proposals: Vec<Proposal>,
    pub base_fee: u32,
    pub admin: AccountId, // admin is responsible for adding and removing workers
    pub staking_fee: u32,
}
