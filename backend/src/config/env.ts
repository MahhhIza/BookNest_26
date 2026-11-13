export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('A variável JWT_SECRET não foi definida.');
  }

  return secret;
}

export function getJwtExpiresIn(): string {
  return process.env.JWT_EXPIRES_IN || '2h';
}

export function getSaltRounds(): number {
  const rounds = Number(process.env.BCRYPT_SALT_ROUNDS);

  return Number.isInteger(rounds) && rounds >= 4 ? rounds : 12;
}
