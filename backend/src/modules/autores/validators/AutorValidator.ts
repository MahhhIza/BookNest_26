
export class AutorValidator {
  // Valida os dados recebidos para cadastro e atualização.
  static validate(nome: string, nacionalidade: string): void {
    if (!nome?.trim() || !nacionalidade?.trim()) {
      throw new Error('Nome e nacionalidade são obrigatórios.');
    }

    if (nome.trim().length > 150) {
      throw new Error('O nome deve ter no máximo 150 caracteres.');
    }

    if (nacionalidade.trim().length > 100) {
      throw new Error('A nacionalidade deve ter no máximo 100 caracteres.');
    }
  }
}
