import { ValidationError } from '../../../errors/AppError';

export class UserValidator {
  static validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      throw new ValidationError('Informe um e-mail válido.');
    }
  }

  static validateCPF(cpf: string): void {
    const cleanCPF = cpf.replace(/\D/g, '');

    if (cleanCPF.length !== 11) {
      throw new ValidationError('O CPF deve conter 11 dígitos.');
    }

    if (/^(\d)\1{10}$/.test(cleanCPF)) {
      throw new ValidationError('Informe um CPF válido.');
    }

    let sum = 0;

    for (let i = 0; i < 9; i++) {
      sum += Number(cleanCPF[i]) * (10 - i);
    }

    let firstDigit = (sum * 10) % 11;

    if (firstDigit === 10) {
      firstDigit = 0;
    }

    if (firstDigit !== Number(cleanCPF[9])) {
      throw new ValidationError('Informe um CPF válido.');
    }

    sum = 0;

    for (let i = 0; i < 10; i++) {
      sum += Number(cleanCPF[i]) * (11 - i);
    }

    let secondDigit = (sum * 10) % 11;

    if (secondDigit === 10) {
      secondDigit = 0;
    }

    if (secondDigit !== Number(cleanCPF[10])) {
      throw new ValidationError('Informe um CPF válido.');
    }
  }

  static validatePassword(password: string): void {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S{8,}$/;

    if (!passwordRegex.test(password)) {
      throw new ValidationError(
        'A senha deve ter pelo menos 8 caracteres, ' +
        'uma letra maiúscula, uma minúscula, um número ' +
        'e um caractere especial.'
      );
    }
  }
}
