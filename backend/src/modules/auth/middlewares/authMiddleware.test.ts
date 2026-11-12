
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';

import { authenticate } from './authMiddleware';

const secret = 'chave-secreta-exclusiva-para-testes';
const originalSecret = process.env.JWT_SECRET;

process.env.JWT_SECRET = secret;

after(() => {
  if (originalSecret === undefined) {
    delete process.env.JWT_SECRET;
  } else {
    process.env.JWT_SECRET = originalSecret;
  }
});

// Cria uma resposta simulada do Express.
function createResponse() {
  const response = {
    statusCode: 200,
    body: null as unknown,
    locals: {} as Record<string, unknown>,

    status(code: number) {
      this.statusCode = code;
      return this;
    },

    json(data: unknown) {
      this.body = data;
      return this;
    }
  };

  return response;
}

test('deve rejeitar requisição sem token', () => {
  const req = {
    headers: {}
  } as Request;

  const res = createResponse();
  let nextCalled = false;

  authenticate(
    req,
    res as unknown as Response,
    () => { nextCalled = true; }
  );

  assert.equal(res.statusCode, 401);
  assert.equal(nextCalled, false);
});

test('deve rejeitar token em formato inválido', () => {
  const req = {
    headers: {
      authorization: 'Token abc123'
    }
  } as Request;

  const res = createResponse();
  let nextCalled = false;

  authenticate(
    req,
    res as unknown as Response,
    () => { nextCalled = true; }
  );

  assert.equal(res.statusCode, 401);
  assert.equal(nextCalled, false);
});

test('deve rejeitar token expirado', () => {
  const expiredToken = jwt.sign(
    { sub: '42' },
    secret,
    { expiresIn: '-1s' }
  );

  const req = {
    headers: {
      authorization: `Bearer ${expiredToken}`
    }
  } as Request;

  const res = createResponse();
  let nextCalled = false;

  authenticate(
    req,
    res as unknown as Response,
    () => { nextCalled = true; }
  );

  assert.equal(res.statusCode, 401);
  assert.equal(nextCalled, false);
});

test('deve aceitar token válido e disponibilizar o ID do usuário', () => {
  const token = jwt.sign(
    { sub: '42' },
    secret,
    { expiresIn: '1h' }
  );

  const req = {
    headers: {
      authorization: `Bearer ${token}`
    }
  } as Request;

  const res = createResponse();
  let nextCalled = false;

  authenticate(
    req,
    res as unknown as Response,
    () => { nextCalled = true; }
  );

  assert.equal(res.statusCode, 200);
  assert.equal(nextCalled, true);
  assert.equal(res.locals.userId, 42);
});
