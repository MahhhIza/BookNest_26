
import { resolve4 } from 'node:dns/promises';
import { get as httpsGet } from 'node:https';
import type { LookupFunction } from 'node:net';

import { AppError, ValidationError } from '../../errors/AppError';

interface OpenLibraryBook {
  key?: string;
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  number_of_pages_median?: number;
  cover_i?: number;
  isbn?: string[];
}

interface OpenLibraryResponse {
  numFound?: number;
  docs?: OpenLibraryBook[];
}

export interface LivroEncontrado {
  openLibraryId: string;
  titulo: string;
  autores: string[];
  anoPublicacao: number | null;
  paginas: number | null;
  capaUrl: string | null;
  isbn: string | null;
}

const resolverOpenLibrary: LookupFunction = (
  hostname,
  options,
  callback
) => {
  resolve4(hostname)
    .then((enderecos) => {
      const endereco = enderecos[0];

      if (!endereco) {
        callback(
            new Error('Nenhum endereço DNS encontrado.') as NodeJS.ErrnoException,
            '',
            0
        );
        return;
      }

      if (options.all) {
        callback(null, [{ address: endereco, family: 4 }]);
        return;
      }

      callback(null, endereco, 4);
    })
    .catch((erro: NodeJS.ErrnoException) => {
      callback(erro, '', 0);
    });
};

export class OpenLibraryService {
  private readonly urlBase = 'https://openlibrary.org/search.json';

  private consultar(url: string): Promise<{
    statusCode: number;
    corpo: string;
  }> {
    return new Promise((resolve, reject) => {
      const requisicao = httpsGet(
        url,
        {
          lookup: resolverOpenLibrary,
          headers: {
            'User-Agent': 'BookNest/1.0'
          }
        },
        (resposta) => {
          let corpo = '';

          resposta.setEncoding('utf8');

          resposta.on('data', (parte: string) => {
            corpo += parte;
          });

          resposta.on('end', () => {
            resolve({
              statusCode: resposta.statusCode ?? 502,
              corpo
            });
          });

          resposta.on('error', reject);
        }
      );

      requisicao.setTimeout(10000, () => {
        requisicao.destroy(new Error('Tempo limite de conexão excedido.'));
      });

      requisicao.on('error', reject);
    });
  }

  async pesquisar(
    termo: string,
    limite = 10
  ): Promise<{
    total: number;
    resultados: LivroEncontrado[];
  }> {
    const consulta = termo.trim();

    if (consulta.length < 2) {
      throw new ValidationError(
        'Informe pelo menos dois caracteres para pesquisar.'
      );
    }

    if (consulta.length > 150) {
      throw new ValidationError(
        'A pesquisa deve ter no máximo 150 caracteres.'
      );
    }

    const quantidade = Math.min(Math.max(limite, 1), 20);

    const parametros = new URLSearchParams({
      q: consulta,
      fields: [
        'key',
        'title',
        'author_name',
        'first_publish_year',
        'number_of_pages_median',
        'cover_i',
        'isbn'
      ].join(','),
      limit: String(quantidade)
    });

    let resposta: {
      statusCode: number;
      corpo: string;
    };

    try {
      resposta = await this.consultar(
        `${this.urlBase}?${parametros.toString()}`
      );
    } catch {
      throw new AppError(
        'Não foi possível conectar ao serviço de pesquisa de livros.',
        503
      );
    }

    if (resposta.statusCode < 200 || resposta.statusCode >= 300) {
      throw new AppError(
        'O serviço de pesquisa de livros está indisponível no momento.',
        503
      );
    }

    let dados: OpenLibraryResponse;

    try {
      dados = JSON.parse(resposta.corpo) as OpenLibraryResponse;
    } catch {
      throw new AppError(
        'O serviço de pesquisa retornou uma resposta inválida.',
        502
      );
    }

    const resultados = (dados.docs ?? [])
      .filter((livro) => livro.key && livro.title)
      .map((livro): LivroEncontrado => {
        const isbn = livro.isbn?.find(
          (codigo) => codigo.length === 13
        ) ?? livro.isbn?.[0] ?? null;

        return {
          openLibraryId: livro.key!,
          titulo: livro.title!,
          autores: livro.author_name ?? [],
          anoPublicacao: livro.first_publish_year ?? null,
          paginas: livro.number_of_pages_median ?? null,
          capaUrl: livro.cover_i
            ? `https://covers.openlibrary.org/b/id/${livro.cover_i}-M.jpg`
            : null,
          isbn
        };
      });

    return {
      total: dados.numFound ?? 0,
      resultados
    };
  }
}
