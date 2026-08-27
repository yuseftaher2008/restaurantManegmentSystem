// [M-3, M-4] Export validated environment constants
export let BCRYPT_SALT_ROUNDS;
export let JWT_SECRET;
export function validateEnv() {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL is not defined");
    }
    // [M-3] Validate and export BCRYPT_SALT_ROUNDS
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS);
    if (!Number.isInteger(saltRounds) || saltRounds <= 0) {
        throw new Error("BCRYPT_SALT_ROUNDS is not configured correctly");
    }
    BCRYPT_SALT_ROUNDS = saltRounds;
    // [M-4] Validate and export JWT_SECRET
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
        throw new Error("JWT_SECRET must be at least 32 characters long");
    }
    JWT_SECRET = process.env.JWT_SECRET;
}
