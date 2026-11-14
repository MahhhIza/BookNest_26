
export class LivroValidator {
  static validate(
    titulo: string,
    autorId: number,
    categoriaId: number,
    paginas: number,
    ano: number,
    capaUrl: string | null
  ): void {
    if (!titulo?.trim()) {
      throw new Error('O título do livro é obrigatório.');
    }

    if (titulo.trim().length > 255) {
      throw new Error('O título deve ter no máximo 255 caracteres.');
    }

    if (!Number.isInteger(autorId) || autorId <= 0) {
      throw new Error('O ID do autor deve ser um número inteiro positivo.');
    }

    if (!Number.isInteger(categoriaId) || categoriaId <= 0) {
      throw new Error('O ID da categoria deve ser um número inteiro positivo.');
    }

    if (!Number.isInteger(paginas) || paginas <= 0 || paginas > 65535) {
      throw new Error('A quantidade de páginas deve ser um número inteiro entre 1 e 65535.');
    }

    const anoAtual = new Date().getFullYear();

    if (!Number.isInteger(ano) || ano < 1 || ano > anoAtual) {
      throw new Error(`O ano deve ser um número inteiro entre 1 e ${anoAtual}.`);
    }

    if (
      capaUrl !== null &&
      (typeof capaUrl !== 'string' || !capaUrl.trim())
    ) {
      throw new Error('A URL da capa deve ser válida ou nula.');
    }
  }
}
