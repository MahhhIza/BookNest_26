
import test from 'node:test';
import assert from 'node:assert/strict';
import { UserValidator } from './userValidator';

// TESTES DE E-MAIL

test('deve aceitar um e-mail válido', () => {
  assert.doesNotThrow(() => {
    UserValidator.validateEmail('maria@email.com');
  });
});

test('deve rejeitar um e-mail sem formato válido', () => {
  assert.throws(() => {
    UserValidator.validateEmail('mariaemail.com');
  }, /Informe um e-mail válido/);
});

// TESTES DE CPF

test('deve aceitar um CPF válido', () => {
  assert.doesNotThrow(() => {
    UserValidator.validateCPF('52998224725');
  });
});

test('deve rejeitar um CPF com quantidade incorreta de dígitos', () => {
  assert.throws(() => {
    UserValidator.validateCPF('123456789');
  }, /CPF deve conter 11 dígitos/);
});

test('deve rejeitar um CPF com números repetidos', () => {
  assert.throws(() => {
    UserValidator.validateCPF('11111111111');
  }, /Informe um CPF válido/);
});

test('deve rejeitar um CPF com dígitos verificadores incorretos', () => {
  assert.throws(() => {
    UserValidator.validateCPF('52998224724');
  }, /Informe um CPF válido/);
});

// TESTES DE SENHA

test('deve aceitar uma senha forte', () => {
  assert.doesNotThrow(() => {
    UserValidator.validatePassword('Booknest1!');
  });
});

test('deve rejeitar uma senha sem letra maiúscula', () => {
  assert.throws(() => {
    UserValidator.validatePassword('booknest1!');
  }, /A senha deve ter pelo menos 8 caracteres/);
});

test('deve rejeitar uma senha sem número', () => {
  assert.throws(() => {
    UserValidator.validatePassword('Booknest!');
  }, /A senha deve ter pelo menos 8 caracteres/);
});

test('deve rejeitar uma senha com menos de 8 caracteres', () => {
  assert.throws(() => {
    UserValidator.validatePassword('Boo1!');
  }, /A senha deve ter pelo menos 8 caracteres/);
});

test('deve rejeitar uma senha sem caractere especial', () => {
  assert.throws(() => {
    UserValidator.validatePassword('Booknest123');
  }, /A senha deve ter pelo menos 8 caracteres/);
});
