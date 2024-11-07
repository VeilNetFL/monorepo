use std::{collections::HashMap, str};

use near_sdk::{near, AccountId};

#[near(serializers = [json,borsh])]
#[derive(Clone)]
pub struct NetworkState {
    pub workers: Vec<AccountId>,
}

/// Represents the model training state i.e the workers,the aggregator node
#[near(serializers = [json,borsh])]
#[derive(Clone)]
pub struct ModelState {
    pub status: ModelStatus,
    pub workers: Vec<AccountId>,
    pub datasets: HashMap<AccountId, ModelData>, // the key is the publisher account id
    pub model_cid: Option<String>,
    pub creator: AccountId,
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
    NotTraining,
    Training,
    Finished,
}
