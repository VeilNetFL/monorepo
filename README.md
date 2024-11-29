# VeilNetFl
VeilNetFL is a next-generation federated learning platform that empowers organizations and individuals to securely collaborate on machine learning models, preserving data privacy while advancing the collective intelligence of society. By harnessing the power of Fully Homomorphic Encryption (FHE) and decentralized storage, VielNetFL enables secure, privacy-preserving computation while promoting the values of openness, transparency, and contribution to public goods.

## Winner of Near Track in funding the commons!
****
VeiNetFL is dedicated to creating a positive societal impact by treating machine learning as a public good. By fostering open collaborations on critical issues like healthcare, climate change, and financial inclusion, VielNetFL aims to make advanced, high-quality models accessible to the public for collective benefit

## Components and Network flow

![image(27).png](https://cdn.dorahacks.io/static/files/19305ef774024b9e11ccf9c4769929db.png)


1. **Client**:
   - **Data Preparation**: The client prepares the dataset and encrypts it using FHE, ensuring that the data remains private even during computations. This all happens through a friendly UI on the client dashboard. The client also selects the workers here
   - **Publishing Encrypted Data**: The encrypted dataset is uploaded to IPFS, a decentralized file storage network. The IPFS network generates a unique Content Identifier (CID) for the encrypted dataset.
   - **Dataset CID and Key**: The client publishes the CID of the encrypted dataset and a compressed server key (for decrypting model parameters later) to the NEAR contract.

1. **NEAR Contract**:
   - **Request Storage and Coordination**: The NEAR smart contract acts as a coordination layer for federated learning. It stores the dataset CID and the server key and receives learning or computation requests from clients.
   - **Request Dispatch**: When a client or other entity initiates a request (e.g., to perform model training), the NEAR contract logs this request and makes it available for the worker network.

1. **Worker Network**:
   - **Request Handling**: Workers in the network constantly monitor the NEAR contract for new requests. When a worker detects a request, it picks it up for processing.
   - **Data Retrieval**: The worker uses the dataset CID to retrieve the encrypted dataset from IPFS. Since the data is encrypted using FHE, the worker can perform computations directly on this encrypted data without decrypting it.
   - **Worker Runtime**::  The runtime environment in the worker handles tasks such as managing data security, performing FHE-based calculations, and interacting with IPFS and the NEAR blockchain. The runtime architecture is inspired from the near mpc for chain signatures. Within the worker, there are several modules:
     - **Model Calculation**: This module uses the encrypted data to train or update the model parameters. FHE ensures that the worker can perform training without ever seeing the actual data.
     - **IPFS Module**: After the model parameters are updated, the worker encrypts these parameters and uploads them to IPFS. IPFS generates a new CID for these updated parameters.
     - **NEAR Lake Indexer**: This component keeps the worker updated on the current state of the NEAR blockchain, ensuring it has access to the latest requests and data.


1. **Publishing Model Parameters**:
   - After the model has been trained or updated, the worker publishes the encrypted model parameters back to IPFS, generating a new CID.
   - This new CID for the updated model parameters is then published to the NEAR contract, making it available to all clients.

1. **Client Model Update**:
   - **Fetching Model Parameters and taking a federated average**: The client retrieves the new model parameters by accessing the CID from the NEAR contract and downloading the encrypted model from IPFS. It then decrypts the data and taking the federated average with a button on dashboard.
   - **Decryption**: Using the compressed server key stored in the NEAR contract, the client decrypts the model parameters, gaining access to the latest version of the model.


This architecture allows for secure, privacy-preserving federated learning on a decentralized network, leveraging NEAR for coordination, IPFS for storage, and FHE for secure computation on encrypted data.


## Worker Incentavisation and governance

At **VielNetFL**, we incentivize workers to join the network by offering them a share of the fees generated from federated learning tasks. Workers play a crucial role in securely processing data and training models, and they are rewarded for their contributions. Each worker has access to a personalized dashboard where they can monitor their earnings in real time, providing transparency and immediate feedback on their contributions to the network. 

Additionally, the dashboard empowers workers to actively participate in the governance of VielNetFL. They can vote on proposals to add or remove other workers, ensuring a reliable and trusted network, and to adjust the base fees or initiate new projects. This democratic governance model aligns the interests of workers with the success of the platform, fostering a motivated and engaged community that is committed to the long-term growth and sustainability of VielNetFL. Through this model, we create a fair, transparent, and inclusive system that rewards workers while allowing them to have a say in shaping the network.
```rust
#[near(serializers = [json,borsh])]
#[derive(Clone)]
pub enum ProposalType {
    AddWorker(AccountId),
    RemoveWorker(AccountId),
    ChangeBaseFee(u32),
    ChangeStakeAmount(u32)
}
```
****
##  Fault Tolernace

![image(28).png](https://cdn.dorahacks.io/static/files/1930601615c8e048c837302482ca32e7.png)

VielNetFL incorporates robust fault tolerance mechanisms to ensure model integrity and reliability. If a user receives faulty model parameters, they can leverage a zk-Krum function—a zero-knowledge proof-based method for evaluating model consistency. 

### Krum Function
It works by calculating the euclidian distances between all vectors and doing the summation to assign a score to each vector. The assumption is that the number of non malicous actors are the majority in the network. In this scenario, the score of majority of vectors would be small since they would be bunched together and the malicous vectors would be outliers. 

Through the frontend or a locally compiled binary, users can generate a zk-Krum proof to verify that the received parameters deviate significantly from the consensus model, flagging potential malicious behavior by a worker. This verification process enhances trust, as users can independently validate model integrity without exposing sensitive data.

Additionally, workers play a crucial role in maintaining network quality through governance. If a worker is suspected of providing faulty models or acting dishonestly, other workers can initiate a proposal to vote them out. For example, if a worker repeatedly submits corrupted model updates or fails to meet performance standards, peers may choose to vote on their removal to protect the platform’s integrity. If the zk-Krum proof successfully verifies the misconduct, or if the governance vote results in consensus for removal, the misbehaving worker’s stake is forfeited, creating a strong disincentive for malicious actions. This dual-layer system—user-initiated zk-Krum verification and worker governance—ensures that VielNetFL maintains high standards of fault tolerance, fostering a trustworthy and reliable federated learning environment. 

## Technologies used

For the fhe we used [tfhe-rs](https://github.com/zama-ai/tfhe-rs]) and all the techs for node such as lake indexer were provided by near.
For frontend the encryption was done with wasm compiled tfhe-rs


## Roadmap
- [ ] integration of worker node with worked dashboard and client dashboard
