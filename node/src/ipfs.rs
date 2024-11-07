use core::time;
use std::sync::Arc;
use std::time::Instant;

use anyhow::Context;
use anyhow::Ok;
use anyhow::Result;
use futures::stream::StreamExt;
use ipfs_api::IpfsApi;
use ipfs_api::IpfsClient;
use near_crypto::vrf::Value;
#[derive(Clone)]
pub struct IpfsHandler {
    client: IpfsClient,
    download_dir: String,
}

#[derive(Debug, Clone, clap::Parser)]
#[group(id = "ipfs-options")]
pub struct Options {
    #[clap(long, env("IPFS_DOWNLOAD_DIR"), default_value = "./datasets/")]
    pub download_dir: String,
}

impl IpfsHandler {
    pub fn new(download_path: &str) -> Result<Self> {
        let client = IpfsClient::default();

        Ok(Self {
            client,
            download_dir: download_path.to_string(),
        })
    }

    /// Fetch a file from IPFS and save it locally
    pub async fn fetch_file(&self, cid: &str, filename: &str) -> Result<String> {
        let path = format!("{}/{}", self.download_dir, filename);

        tokio::fs::create_dir_all(&self.download_dir)
            .await
            .context("Failed to create download directory")?;

        let mut file = tokio::fs::File::create(&path)
            .await
            .context("Failed to create file")?;

        let mut response = self.client.cat(cid);

        while let Some(chunk) = response.next().await {
            let chunk = chunk.context("Failed to get chunk from IPFS")?;
            tokio::io::AsyncWriteExt::write_all(&mut file, &chunk)
                .await
                .context("Failed to write chunk to file")?;
        }
        Ok(path)
    }
    /// Publish model JSON data to IPFS
    pub async fn publish_json(&self, data: Value) -> Result<String> {
        let json_str = serde_json::to_string(&data).context("Failed to serialize JSON")?;

        // this is  memory but for some reason ipfs requires to have 'static data upload only
        let response = self.client.add_async(to_static_bytes(json_str)).await?;

        Ok(response.hash)
    }
}

fn to_static_bytes(s: String) -> &'static [u8] {
    s.leak().as_bytes()
}
