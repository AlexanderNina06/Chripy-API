import express, { NextFunction } from "express";
import { Request, Response } from "express";
import { config } from "../config.js"

export const middlewareLogResponses : middleware = (req: Request, res: Response, next: NextFunction) => {
  res.on("finish", () => {
      if(res.statusCode !== 200){
        console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`)
      }
  });
  next()
}
export const middlewareMetricsInc : middleware = (req: Request, res: Response, next: NextFunction) => {
  if(req){
    config.fileserverHits += 1
  }
  next()
}
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(err);

  if (err instanceof NotFoundError) {
    return res.status(404).json({ error: err.message });
  }

  if (err instanceof Unauthorized) {
    return res.status(401).json({ error: err.message });
  }

  if (err instanceof BadRequest) {
    return res.status(400).json({ error: err.message });
  }

  if (err instanceof Forbidden) {
    return res.status(403).json({ error: err.message });
  }

  return res.status(500).json({
    error: `Something went wrong on our end. ${err.message}`
  });
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}
export class Unauthorized extends Error {
  constructor(message: string) {
    super(message);
  }
}
export class BadRequest extends Error {
  constructor(message: string) {
    super(message);
  }
}
export class Forbidden extends Error {
  constructor(message: string) {
    super(message);
  }
}

type middleware = (req: Request, res: Response, next: NextFunction) => void
