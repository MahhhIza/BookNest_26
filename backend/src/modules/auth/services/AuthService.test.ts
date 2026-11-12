
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { AuthService } from './AuthService';
import { User } from '../../users/entities/User';
import { UserRepository } from '../../users/repositories/UserRepository';

const secret = 'chave-secreta-exclusiva-para-testes';
const originalSecret = process.env.JWT_SECRET;

process.env.JWT_SECRET = secret;

// Restaura a variável de ambiente após os testes.
after(() => {
  if (originalSecret === undefined) {
    delete process.env.JWT_SECRET;
  } else {
    process.env.JWT_SECRET = originalSecret;
  }
});

// Cria um usuário simulado para os testes.
async function createTestUser(): Promise<User> {
  const passwordHash = await bcrypt.hash('SenhaForte123!', 10);

  return new User(
    'Usuário Teste',
    'teste@email.com',
    passwordHash,
    '12345678909',
    1
  );
}

test('deve rejeitar login sem e-mail ou senha', async () => {
  const repository = {
    findByEmail: async () => null
  } as unknown as UserRepository;

  const service = new AuthService(repository);

  await assert.rejects(
    service.login({ email: '', password: '' }),
    { message: 'E-mail e senha são obrigatórios.' }
  );
});

test('deve rejeitar login de usuário inexistente', async () => {
  const repository = {
    findByEmail: async () => null
  } as unknown as UserRepository;

  const service = new AuthService(repository);

  await assert.rejects(
    service.login({
      email: 'inexistente@email.com',
      password: 'SenhaForte123!'
    }),
    { message: 'E-mail ou senha inválidos.' }
  );
});

test('deve rejeitar senha incorreta', async () => {
  const user = await createTestUser();

  const repository = {
    findByEmail: async () => user
  } as unknown as UserRepository;

  const service = new AuthService(repository);

  await assert.rejects(
    service.login({
      email: 'teste@email.com',
      password: 'SenhaErrada123!'
    }),
    { message: 'E-mail ou senha inválidos.' }
  );
});

test('deve realizar login e gerar um JWT válido', async () => {
  const user = await createTestUser();

  const repository = {
    findByEmail: async () => user
  } as unknown as UserRepository;

  const service = new AuthService(repository);

  const result = await service.login({
    email: '  TESTE@EMAIL.COM  ',
    password: 'SenhaForte123!'
  });

  assert.equal(result.user.id, 1);
  assert.equal(result.user.name, 'Usuário Teste');
  assert.equal(result.user.email, 'teste@email.com');

  const decoded = jwt.verify(result.token, secret);

  assert.equal(typeof decoded, 'object');

  if (typeof decoded !== 'string') {
    assert.equal(decoded.sub, '1');
  }

  assert.equal('passwordHash' in result.user, false);
});
