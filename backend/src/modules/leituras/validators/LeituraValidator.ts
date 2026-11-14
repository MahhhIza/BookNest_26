
export class LeituraValidator {
  static validate(
    livroId: number,
    status: string,
    nota: number | null,
    concluidaEm: string | null
  ): void {
    // Valida o ID do livro.
    if (!Number.isInteger(livroId) || livroId <= 0) {
      throw new Error('O ID do livro deve ser um número inteiro positivo.');
    }

    // Valida os status permitidos.
    const statusPermitidos = ['Quero ler', 'Lendo', 'Lido'];

    if (!statusPermitidos.includes(status)) {
      throw new Error('O status deve ser Quero ler, Lendo ou Lido.');
    }

    // Valida a nota.
    if (
      nota !== null &&
      (!Number.isInteger(nota) || nota < 1 || nota > 5)
    ) {
      throw new Error('A nota deve ser um número inteiro entre 1 e 5 ou nula.');
    }

    // Valida a data de conclusão.
    if (concluidaEm !== null) {
      if (typeof concluidaEm !== 'string') {
        throw new Error('A data de conclusão deve ser válida ou nula.');
      }

      const formatoValido = /^\d{4}-\d{2}-\d{2}$/;

      if (!formatoValido.test(concluidaEm)) {
        throw new Error('A data de conclusão deve estar no formato YYYY-MM-DD.');
      }

      const data = new Date(`${concluidaEm}T00:00:00`);

      if (
        Number.isNaN(data.getTime()) ||
        data.toISOString().slice(0, 10) !== concluidaEm
      ) {
        throw new Error('A data de conclusão informada não é válida.');
      }

      // A data de conclusão só pode ser informada para leituras concluídas.
      if (status !== 'Lido') {
        throw new Error('A data de conclusão só pode ser informada quando o status for Lido.');
      }
    }
  }
}
