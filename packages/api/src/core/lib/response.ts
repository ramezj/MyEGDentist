import type { Context } from "hono";
import { ApiError, createError } from "./errors.js";

function send(c: Context, err: ApiError) {
  return c.json({ code: err.code, message: err.message }, err.status);
}

export const unauthorized = (c: Context, msg?: string) =>
  send(c, createError.unauthorized(msg));

export const forbidden = (c: Context, msg?: string) =>
  send(c, createError.forbidden(msg));

export const notFound = (c: Context, msg?: string) =>
  send(c, createError.notFound(msg));

export const badRequest = (c: Context, msg: string) =>
  send(c, createError.badRequest(msg));

export const conflict = (c: Context, msg: string) =>
  send(c, createError.conflict(msg));
