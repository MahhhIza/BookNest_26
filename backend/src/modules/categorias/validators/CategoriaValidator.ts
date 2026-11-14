
export class CategoriaValidator {
  // Valida os dados recebidos para cadastro e atualização.
  static validate(nome: string, descricao: string): void {
    if (!nome?.trim() || !descricao?.trim()) {
      throw new Error('Nome e descrição são obrigatórios.');
    }

    if (nome.trim().length > 150) {
      throw new Error('O nome deve ter no máximo 150 caracteres.');
    }
  }
}
