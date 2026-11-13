import { ValidationError } from '../../errors/AppError';
import type { ErrosDeCampo } from '../../errors/AppError';

export class Validador {
  private readonly erros: ErrosDeCampo = {};

  private constructor(private readonly dados: Record<string, unknown>) {}

  static de(corpo: unknown): Validador {
    if (typeof corpo !== 'object' || corpo === null || Array.isArray(corpo)) {
      throw new ValidationError('Corpo da requisição inválido.');
    }

    return new Validador(corpo as Record<string, unknown>);
  }

  texto(campo: string, max: number): string {
    const valor = this.dados[campo];

    if (typeof valor !== 'string' || !valor.trim()) {
      this.erros[campo] = 'Campo obrigatório.';
      return '';
    }

    if (valor.trim().length > max) {
      this.erros[campo] = `Use no máximo ${max} caracteres.`;
    }

    return valor.trim();
  }

  textoOpcional(campo: string, max: number): string | null {
    const valor = this.dados[campo];

    if (valor === undefined || valor === null || valor === '') {
      return null;
    }

    if (typeof valor !== 'string') {
      this.erros[campo] = 'Texto inválido.';
      return null;
    }

    if (valor.trim().length > max) {
      this.erros[campo] = `Use no máximo ${max} caracteres.`;
    }

    return valor.trim() || null;
  }

  inteiro(campo: string, min: number, max: number): number {
    const valor = this.dados[campo];

    if (typeof valor !== 'number' || !Number.isInteger(valor)) {
      this.erros[campo] = 'Informe um número inteiro.';
      return 0;
    }

    if (valor < min || valor > max) {
      this.erros[campo] = `Informe um valor entre ${min} e ${max}.`;
    }

    return valor;
  }

  opcao<V extends string>(campo: string, permitidos: readonly V[]): V {
    const valor = this.dados[campo];

    if (typeof valor !== 'string' || !permitidos.includes(valor as V)) {
      this.erros[campo] = `Use um destes valores: ${permitidos.join(', ')}.`;
      return permitidos[0];
    }

    return valor as V;
  }

  data(campo: string): string {
    const valor = this.dados[campo];

    if (
      typeof valor !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(valor) ||
      Number.isNaN(Date.parse(valor))
    ) {
      this.erros[campo] = 'Informe uma data no formato AAAA-MM-DD.';
      return '';
    }

    return valor;
  }

  erro(campo: string, mensagem: string): void {
    this.erros[campo] = mensagem;
  }

  concluir(): void {
    if (Object.keys(this.erros).length > 0) {
      throw new ValidationError('Dados inválidos.', this.erros);
    }
  }
}
