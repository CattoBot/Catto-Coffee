import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

export class EncryptionService {
    private algorithm = 'aes-256-ctr';
    private secretKey: Buffer;
    private iv: Buffer;

    constructor() {
        this.secretKey = randomBytes(32);  // Key should be securely stored and reused, not generated each time
        this.iv = randomBytes(16);  // IV should be unique for each encryption but can be stored plainly
    }

    encrypt(text: string) {
        const cipher = createCipheriv(this.algorithm, this.secretKey, this.iv);
        const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

        return {
            iv: this.iv.toString('hex'),
            content: encrypted.toString('hex')
        };
    }

    decrypt(hash: { iv: string; content: string }) {
        const decipher = createDecipheriv(this.algorithm, this.secretKey, Buffer.from(hash.iv, 'hex'));
        const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

        return decrypted.toString();
    }
}
