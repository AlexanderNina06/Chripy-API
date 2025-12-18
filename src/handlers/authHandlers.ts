import { NextFunction } from "express";
import { Request, Response } from "express";
import { BadRequest, Unauthorized } from "../middlewares/middlewaresRegistry.js";
import { getUserByEmailAsync } from "../db/queries/users.js";
import { NewRefreshToken } from "../../src/schema.js";
import { checkPasswordHash, getRefreshTokenExpiration, hashPassword, makeJWT, makeRefreshToken } from "../auth.js";
import { createRefreshTokenAsync, getTokenAsync, revokeTokenAsync } from "../db/queries/refreshTokens.js";

export async function loginHandler(
  req: Request,
  res: Response,
  next: NextFunction
){
  try{
    const { email, password } = req.body ?? {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" 
    ) {
      throw new BadRequest("Invalid body" );
    }

    const user = await getUserByEmailAsync(email);

    if(!user){
      throw new Unauthorized("Incorrect email or password");
    }

    const isValid = await checkPasswordHash(user.hashedPassword, password)
    if(!isValid){
      throw new Unauthorized("Incorrect email or password")
    }
    const secret = process.env.SECRET
    if (!secret) {
      throw new Error("Missing JWT secret");
    }

    const token = makeJWT(user.id, secret);
    const refreshTokenValue = makeRefreshToken();

    const refreshToken: NewRefreshToken = {
      userId: user.id,
      token: refreshTokenValue,
      expiresAt: getRefreshTokenExpiration(),
    };

    await createRefreshTokenAsync(refreshToken);

    const {hashedPassword: _, ...publicUser} = user
    res.status(200).json({
      ...publicUser,
      token,
      refreshToken: refreshTokenValue,
    });

  }catch(err){
    next(err)
  }
}

export async function refreshTokenHandler(
  req: Request,
  res: Response,
  next: NextFunction
){
  try{
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new Unauthorized("Missing refresh token");
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new Unauthorized("Invalid authorization format");
    }
    const storedToken = await getTokenAsync(token);

    if (
      !storedToken ||
      storedToken.revokedAt !== null ||
      storedToken.expiresAt.getTime() < Date.now()
    ) {
      throw new Unauthorized("Invalid refresh token");
    }

    const secret = process.env.SECRET;
    if (!secret) {
      throw new Error("Missing JWT secret");
    }

    const newAccessToken = await makeJWT(storedToken.userId, secret)
    res.status(200).json({
      token: newAccessToken,
    });

  }catch(err){
    next(err)
  }
}

export async function revokeTokenHandler(
  req: Request,
  res: Response,
  next: NextFunction
){
  try{
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new Unauthorized("Missing refresh token");
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new Unauthorized("Invalid authorization format");
    }
    const storedToken = await getTokenAsync(token);

    if (
      !storedToken ||
      storedToken.revokedAt !== null ||
      storedToken.expiresAt.getTime() < Date.now()
    ) {
      throw new Unauthorized("Invalid refresh token");
    }

    await revokeTokenAsync(token);

    res.sendStatus(204)
  }catch(err){
    next(err)
  }
}