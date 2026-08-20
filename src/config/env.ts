export function validateEnv() {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL is not defined");
    }

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS);
    if (!Number.isInteger(saltRounds) || saltRounds <= 0) {
        throw new Error("BCRYPT_SALT_ROUNDS is not configured correctly");
    }

    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
        throw new Error("JWT_SECRET must be at least 32 characters long");
    }
}