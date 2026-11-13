export interface ParametrosPagina {
  page: number;
  limit: number;
}

function lerInteiro(valor: unknown, padrao: number): number {
  const numero = Number(valor);

  return Number.isInteger(numero) && numero > 0 ? numero : padrao;
}

export function lerPaginacao(query: Record<string, unknown>): ParametrosPagina {
  const page = lerInteiro(query.page, 1);
  const limit = Math.min(lerInteiro(query.limit, 10), 100);

  return { page, limit };
}
