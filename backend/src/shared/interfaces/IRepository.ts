export interface Pagina<T> {
  itens: T[];
  total: number;
}

export interface IRepository<T, TInput> {
  findAll(page: number, limit: number): Promise<Pagina<T>>;
  findById(id: number): Promise<T | null>;
  create(dados: TInput): Promise<T>;
  update(id: number, dados: TInput): Promise<T | null>;
  delete(id: number): Promise<boolean>;
}
