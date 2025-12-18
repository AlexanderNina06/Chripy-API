import { NextFunction } from "express";
import { Request, Response } from "express";
import { BadRequest } from "../middlewares/middlewaresRegistry.js";
import { createUserAsync, resetUsersAsync, updateUserAsync } from "../db/queries/users.js";
import { NewUser } from "../../src/schema.js";
import { getBearerToken, hashPassword, validateJWT } from "../auth.js";

export async function createUserHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body ?? {};

    if (
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      throw new BadRequest("Invalid body" );
    }

    const hashedPassword = await hashPassword(password);

    const newUser: NewUser = {
      email,
      hashedPassword,
    };

    const createdUser = await createUserAsync(newUser);

    const { hashedPassword: _, ...publicUser } = createdUser;

    return res.status(201).json(publicUser);
  } catch (err) {
    next(err);
  }
}

export async function updateUserHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const secret = process.env.SECRET;
    if (!secret) {
      throw new Error("Missing JWT secret");
    }

    const token = getBearerToken(req);
    const userId = validateJWT(token, secret);

    const { email, password } = req.body ?? {};

    if (typeof email !== "string" || typeof password !== "string") {
      throw new BadRequest("Invalid body");
    }

    const hashedPassword = await hashPassword(password);
    const user = await updateUserAsync({ userId, email, hashedPassword });

    res.status(200).json({
      id: userId,
      email: user.email,
      isChirpyRed: user.isChirpyRed
    });
  } catch (err) {
    next(err);
  }
}

export async function resetUsersHandler(req: Request,
  res: Response,
  next: NextFunction)
{
  await resetUsersAsync()
  res.sendStatus(200)
}