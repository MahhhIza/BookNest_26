import { describe, expect, it } from 'vitest';
import { formatCpf, isStrongPassword, isValidCpf, isValidEmail } from './validators';

describe('isValidCpf', () => {
  it('aceita CPF válido (com e sem máscara)', () => {
    expect(isValidCpf('529.982.247-25')).toBe(true);
    expect(isValidCpf('52998224725')).toBe(true);
  });
  it('rejeita dígitos errados, sequências repetidas e tamanho incorreto', () => {
    expect(isValidCpf('529.982.247-26')).toBe(false);
    expect(isValidCpf('111.111.111-11')).toBe(false);
    expect(isValidCpf('123')).toBe(false);
  });
});

describe('formatCpf', () => {
  it('aplica máscara progressivamente', () => {
    expect(formatCpf('52998224725')).toBe('529.982.247-25');
    expect(formatCpf('5299')).toBe('529.9');
  });
});

describe('isValidEmail', () => {
  it('valida formato', () => {
    expect(isValidEmail('ana@booknest.com')).toBe(true);
    expect(isValidEmail('ana@booknest')).toBe(false);
    expect(isValidEmail('ana booknest.com')).toBe(false);
  });
});

describe('isStrongPassword', () => {
  it('exige 8+ chars, maiúscula, minúscula, número e especial', () => {
    expect(isStrongPassword('Abcdef1!')).toBe(true);
    expect(isStrongPassword('Abcdef12')).toBe(false);
    expect(isStrongPassword('abcdef12')).toBe(false);
    expect(isStrongPassword('Ab1')).toBe(false);
  });
});
