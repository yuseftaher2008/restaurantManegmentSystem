export function validateEnv() {
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS);
    if (!Number.isInteger(saltRounds) || saltRounds <= 0) {
        throw new Error("BCRYPT_SALT_ROUNDS is not configured correctly");
    }

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
}