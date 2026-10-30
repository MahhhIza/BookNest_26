export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function formatCpf(value: string): string {
  const d = onlyDigits(value).slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
}

function cpfCheckDigit(base: string): number {
  const factor = base.length + 1;
  const sum = [...base].reduce((acc, n, i) => acc + Number(n) * (factor - i), 0);
  const rest = (sum * 10) % 11;
  return rest === 10 ? 0 : rest;
}

export function isValidCpf(value: string): boolean {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  const d1 = cpfCheckDigit(cpf.slice(0, 9));
  const d2 = cpfCheckDigit(cpf.slice(0, 9) + d1);
  return cpf.endsWith(`${d1}${d2}`);
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export type PasswordStrength = {
  score: number;
  label: 'Muito fraca' | 'Fraca' | 'Média' | 'Forte' | 'Muito forte';
  checks: { minLength: boolean; upper: boolean; lower: boolean; number: boolean; special: boolean };
};

const LABELS: PasswordStrength['label'][] = ['Muito fraca', 'Fraca', 'Média', 'Forte', 'Muito forte'];

export function passwordStrength(password: string): PasswordStrength {
  const checks = {
    minLength: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const score = Object.values(checks).filter(Boolean).length - 1;
  const clamped = Math.max(0, Math.min(4, score));
  return { score: clamped, label: LABELS[clamped], checks };
}

export function isStrongPassword(password: string): boolean {
  const { checks } = passwordStrength(password);
  return checks.minLength && checks.upper && checks.lower && checks.number;
}
