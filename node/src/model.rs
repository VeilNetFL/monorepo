use std::fs::File;
use std::io::Read;

use csv::ReaderBuilder;
use futures::io::BufReader;
use serde::Deserialize;
use tfhe::safe_serialization::safe_deserialize_conformant;
use tfhe::shortint::parameters::PARAM_MESSAGE_2_CARRY_2_KS_PBS;
use tfhe::{set_server_key, CompressedServerKey, ConfigBuilder, FheUint8};
/// This function computes the linear regression for the dataset provided
/// path to the dataset file
/// and compressed_secret_key as common

/// Structure for CSV rows with encrypted features and label
#[derive(Deserialize)]
struct EncryptedRow {
    features: Vec<Vec<u8>>, // List of encrypted features as Vec<u8>
    label: Vec<u8>,         // Encrypted label as Vec<u8> (0 or 1)
}

pub async fn run_linear_regression(data_file: &mut File, compressed_secret_key: Vec<u8>, epochs: usize) {
    let config = ConfigBuilder::with_custom_parameters(PARAM_MESSAGE_2_CARRY_2_KS_PBS).build();
    let _server_key_deser: CompressedServerKey =
        safe_deserialize_conformant(compressed_secret_key.as_slice(), 1 << 30, &config.into())
            .unwrap();

    set_server_key(_server_key_deser.decompress());

    let mut buffer = Vec::new();
    let res = data_file.read_to_end(&mut buffer).unwrap();
    let mut rdr = ReaderBuilder::new().from_reader(buffer.as_slice());
    let mut dataset = vec![];

    for result in rdr.deserialize() {
        let record: EncryptedRow = result.unwrap();
        let features: Vec<FheUint8> = record
            .features
            .iter()
            .map(|f| safe_deserialize_conformant(&f[..], 1 << 30, &config.into()).unwrap())
            .collect();
        let label: FheUint8 =
            safe_deserialize_conformant(&record.label[..], 1 << 30, &config.into()).unwrap();
        dataset.push((features, label));

        // Initialize encrypted weights to zero
        let feature_count = dataset[0].0.len();
        let mut weights: Vec<FheUint8> = (0..feature_count)
            .map(|_| FheUint8::encrypt(0u8, &server_key_deser.client_key))
            .collect();

        // Training loop
        for _ in 0..epochs {
            for (features, label) in &dataset {
                // Calculate weighted sum: z = weights * features (dot product)
                let mut z : FheUint8;
                for (w, x) in weights.iter().zip(features.iter()) {
                    z = &z + &(*w * x);
                }

                // Sigmoid approximation: sigmoid(z) ≈ 0.5 + 0.197 * z
                let prediction = &z * 0.197
                    + FheUint8::encrypt(128u8, &server_key_deser.client_key);

                // Calculate error: error = prediction - label
                let error = &prediction - label;

                // Update weights: w = w - learning_rate * error * feature
                for (w, x) in weights.iter_mut().zip(features.iter()) {
                    let gradient =
                        &error * x * FheUint8::encrypt(learning_rate, &server_key_deser.client_key);
                    *w = &*w - &gradient;
                }
            }
        }

        // Decrypt and write weights to JSON
        let decrypted_weights: Vec<u8> = weights
            .iter()
            .map(|w| w.decrypt(&server_key_deser.client_key))
            .collect();

        let result = json!({
            "request_id": request_id,
            "weights": decrypted_weights,
        });

        // Save results to a JSON file named after the request_id
        let result_file = format!("{}_weights.json", request_id);
        std::fs::write(result_file, result.to_string())?;

        Ok(())
    }
}
