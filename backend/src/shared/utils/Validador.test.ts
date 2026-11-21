
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Validador } from './Validador';

describe('Validador de datas', () => {
  it('deve aceitar uma data válida', () => {
    const validador = Validador.de({
      concluidaEm: '2026-11-20'
    });

    assert.equal(validador.data('concluidaEm'), '2026-11-20');
    assert.doesNotThrow(() => validador.concluir());
  });

  it('deve rejeitar uma data inexistente', () => {
    const validador = Validador.de({
      concluidaEm: '2026-02-31'
    });

    validador.data('concluidaEm');

    assert.throws(() => validador.concluir());
  });

  it('deve rejeitar um formato incorreto', () => {
    const validador = Validador.de({
      concluidaEm: '20/11/2026'
    });

    validador.data('concluidaEm');

    assert.throws(() => validador.concluir());
  });

  it('deve rejeitar uma data com mês inválido', () => {
    const validador = Validador.de({
      concluidaEm: '2026-13-10'
    });

    validador.data('concluidaEm');

    assert.throws(() => validador.concluir());
  });
});
