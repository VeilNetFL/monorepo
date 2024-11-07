// TfheWebEncryptionService.ts
import {
    ShortintParametersName,
    ShortintParameters,
    TfheClientKey,
    TfheCompressedServerKey,
    TfheConfigBuilder as ConfigBuilder,
    Shortint,
} from 'tfhe';

export interface EncryptionKeys {
    clientKey: TfheClientKey;
    serverKey: TfheCompressedServerKey;
}

export interface EncryptedData {
    encryptedValues: Uint8Array[][]; // rows and columns
    originalHeaders: string[];
    rowCount: number;
    columnCount: number;
}

export interface CsvRow {
    [key: string]: string | number;
}

export class TfheWebEncryptionService {
    private static instance: TfheWebEncryptionService;
    private keys: EncryptionKeys | null = null;

    private constructor() {
        // Private constructor for singleton pattern
    }

    public static getInstance(): TfheWebEncryptionService {
        if (!TfheWebEncryptionService.instance) {
            TfheWebEncryptionService.instance = new TfheWebEncryptionService();
        }
        return TfheWebEncryptionService.instance;
    }

    /**
     * Initialize TFHE configuration and generate keys
     */
    public initializeTfhe(): EncryptionKeys {
        try {
            // Using small message parameters for better performance
            const params = new ShortintParameters(ShortintParametersName.PARAM_MESSAGE_2_CARRY_2_KS_PBS);

            const config = ConfigBuilder.default()
                .build();

            const clientKey = TfheClientKey.generate(config);
            const serverKey = TfheCompressedServerKey.new(clientKey);

            this.keys = { clientKey, serverKey };
            return this.keys;
        } catch (error) {
            throw new Error(`Failed to initialize TFHE: ${error}`);
        }
    }

    /**
     * Convert CSV data to numeric format and validate ranges
     */
    private convertToNumeric(data: CsvRow[]): {
        numericData: number[][],
        headers: string[]
    } {
        if (data.length === 0) {
            throw new Error('Empty data set provided');
        }

        const headers = Object.keys(data[0]);
        const numericData: number[][] = data.map(row =>
            headers.map(header => {
                const value = row[header];
                if (typeof value === 'number') {
                    if (value < 0 || value > 7) { // Adjust range based on PARAM_SMALL_MESSAGE_2_CARRY_2
                        throw new Error(`Value ${value} in column ${header} is out of range (0-7)`);
                    }
                    return value;
                }
                const numValue = parseFloat(value as string);
                if (isNaN(numValue) || numValue < 0 || numValue > 7) {
                    throw new Error(`Invalid or out of range value in column ${header}`);
                }
                return Math.floor(numValue);
            })
        );

        return { numericData, headers };
    }

    /**
     * Encrypt CSV data
     */
    public async encryptCsvData(data: CsvRow[]): Promise<EncryptedData> {
        try {
            if (!this.keys) {
                this.initializeTfhe();
            }

            const { numericData, headers } = this.convertToNumeric(data);
            // a double array is actually a triple array
            const encryptedValues: Uint8Array[][] = [];

            // Encrypt each value individually
            for (const row of numericData) {
                const rowBuffer: Uint8Array[] = [];
                for (const value of row) {
                    const encrypted = Shortint.encrypt(this.keys!.clientKey, BigInt(value));
                    const serialized = Shortint.serialize_ciphertext(encrypted);
                    rowBuffer.push(serialized);
                }
                encryptedValues.push(rowBuffer);
            }

            return {
                encryptedValues,
                originalHeaders: headers,
                rowCount: data.length,
                columnCount: headers.length
            };
        } catch (error) {
            throw new Error(`Encryption failed: ${error}`);
        }
    }

    /**
     * Decrypt data (for testing/verification purposes)
     */
    public decryptData(encryptedValue: Uint8Array): bigint {
        try {
            if (!this.keys) {
                throw new Error('Keys not initialized');
            }
            let deserialize = Shortint.deserialize_ciphertext(encryptedValue);
            return Shortint.decrypt(this.keys.clientKey, deserialize)
        } catch (error) {
            throw new Error(`Decryption failed: ${error}`);
        }
    }

    /**
     * Validate data before encryption
     */
    public validateData(data: CsvRow[]): boolean {
        if (!data || data.length === 0) {
            throw new Error('No data provided');
        }

        const headers = Object.keys(data[0]);
        if (headers.length === 0) {
            throw new Error('No headers found in data');
        }

        // Check if all rows have the same structure and valid values
        return data.every(row => {
            return Object.keys(row).length === headers.length &&
                Object.values(row).every(value => {
                    const numValue = typeof value === 'number' ? value : parseFloat(value as string);
                    return !isNaN(numValue) && numValue >= 0 && numValue <= 7;
                });
        });
    }

    /**
     * Get encryption keys
     */
    public getKeys(): EncryptionKeys | null {
        return this.keys;
    }


    public getCompressedServerKeySerialized(): Uint8Array {
        if (!this.keys) {
            throw new Error('Keys not initialized');
        }
        return this.keys.serverKey.serialize();
    }
}