
export class UserValidator {

  // Verifica se o e-mail possui um formato válido.
  static validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      throw new Error('Informe um e-mail válido.');
    }
  }

  // Verifica se o CPF possui 11 dígitos e dígitos verificadores válidos.
  static validateCPF(cpf: string): void {
    const cleanCPF = cpf.replace(/\D/g, '');

    if (cleanCPF.length !== 11) {
      throw new Error('O CPF deve conter 11 dígitos.');
    }

    // Impede CPFs com todos os números iguais.
    if (/^(\d)\1{10}$/.test(cleanCPF)) {
      throw new Error('Informe um CPF válido.');
    }

    // Calcula o primeiro dígito verificador.
    let sum = 0;

    for (let i = 0; i < 9; i++) {
      sum += Number(cleanCPF[i]) * (10 - i);
    }

    let firstDigit = (sum * 10) % 11;

    if (firstDigit === 10) {
      firstDigit = 0;
    }

    if (firstDigit !== Number(cleanCPF[9])) {
      throw new Error('Informe um CPF válido.');
    }

    // Calcula o segundo dígito verificador.
    sum = 0;

    for (let i = 0; i < 10; i++) {
      sum += Number(cleanCPF[i]) * (11 - i);
    }

    let secondDigit = (sum * 10) % 11;

    if (secondDigit === 10) {
      secondDigit = 0;
    }

    if (secondDigit !== Number(cleanCPF[10])) {
      throw new Error('Informe um CPF válido.');
    }
  }

  // Verifica se a senha atende aos critérios de força.
  static validatePassword(password: string): void {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S{8,}$/;

    if (!passwordRegex.test(password)) {
      throw new Error(
        'A senha deve ter pelo menos 8 caracteres, ' +
        'uma letra maiúscula, uma minúscula, um número ' +
        'e um caractere especial.'
      );
    }
  }
}
