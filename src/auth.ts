import * as argon2 from "argon2";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";
const { sign, verify } = jwt;
import { randomBytes } from "crypto";
import { BadRequest, Unauthorized } from "./middlewares/middlewaresRegistry.js";

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const REFRESH_TOKEN_TTL = 60 * DAY_IN_MS;
const ONE_HOUR_IN_SECONDS = 60 * 60;


export async function hashPassword(password: string): Promise<string> {
  const hashedPassword = await argon2.hash(password)
  return hashedPassword
}

export async function checkPasswordHash(
  hash: string,
  password: string
): Promise<boolean>{
  if (!hash.startsWith("$")) {
    return false;
  }
  const verifiedPss = await argon2.verify(hash, password)
  return verifiedPss
}
type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userID: string, secret: string): string{
  const iat = Math.floor(Date.now() / 1000)
  const payload : payload = {
    iss: "chirpy",
    sub: userID,
    iat,
    exp: iat + ONE_HOUR_IN_SECONDS
  }
  const jwt = sign(payload, secret)
  return jwt
}

export function validateJWT(tokenString: string, secret: string): string{
  try{
    const decodedToken = verify(tokenString, secret) 
    if (typeof decodedToken !== "object" || typeof decodedToken.sub !== "string") {
      throw new Unauthorized("Invalid token");
    }
    return decodedToken.sub;

  }catch(err){
    throw new Unauthorized(`${err}`)
  }
}

export function getBearerToken(req: Request){

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new Unauthorized("Missing Authorization header");
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new Unauthorized("Invalid Authorization format");
    }
    return token
}

export function makeRefreshToken() {
  return randomBytes(32).toString("hex");
}

export function getRefreshTokenExpiration(): Date {
  return new Date(Date.now() + REFRESH_TOKEN_TTL);
}

export function getAPIKey(req: Request){
  const authHeader = req.headers.authorization
  if(!authHeader){
    throw new Unauthorized("missing headers")
  }
  const [scheme, apiKey] = authHeader.split(" ");

  if (scheme !== "ApiKey" || !apiKey) {
    throw new Unauthorized("missing ApiKey");
  }
  return apiKey
}