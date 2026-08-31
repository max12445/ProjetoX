import { test } from "node:test";
import assert from "node:assert/strict";
import {
  registerSchema,
  loginSchema,
  createProductSchema,
  updateProductStatusSchema,
} from "../src/middleware/validationMiddleware.js";

test("registerSchema aceita dados válidos", () => {
  const result = registerSchema.validate({
    name: "Maria Silva",
    email: "MARIA@example.com",
    password: "123456",
  });
  assert.equal(result.error, undefined);
  // email é normalizado para minúsculas
  assert.equal(result.value.email, "maria@example.com");
});

test("registerSchema rejeita email inválido", () => {
  const result = registerSchema.validate({
    name: "Maria",
    email: "emailinvalido",
    password: "123456",
  });
  assert.ok(result.error);
});

test("registerSchema rejeita senha curta", () => {
  const result = registerSchema.validate({
    name: "Maria",
    email: "m@example.com",
    password: "123",
  });
  assert.ok(result.error);
});

test("registerSchema rejeita nome muito curto", () => {
  const result = registerSchema.validate({
    name: "X",
    email: "m@example.com",
    password: "123456",
  });
  assert.ok(result.error);
});

test("loginSchema rejeita corpo vazio", () => {
  const result = loginSchema.validate({});
  assert.ok(result.error);
});

test("createProductSchema valida preço positivo", () => {
  assert.ok(
    createProductSchema.validate({
      title: "Teclado",
      category: "perifericos",
      price: -5,
      image: "https://exemplo.com/img.jpg",
    }).error
  );

  assert.equal(
    createProductSchema.validate({
      title: "Teclado",
      category: "perifericos",
      price: 99.9,
      image: "https://exemplo.com/img.jpg",
    }).error,
    undefined
  );
});

test("updateProductStatusSchema aceita apenas aprovado/rejeitado", () => {
  assert.equal(
    updateProductStatusSchema.validate({ status: "aprovado" }).error,
    undefined
  );
  assert.ok(
    updateProductStatusSchema.validate({ status: "qualquercoisa" }).error
  );
});
