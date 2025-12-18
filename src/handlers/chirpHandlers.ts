import { NextFunction } from "express";
import { Request, Response } from "express";
import { BadRequest, Forbidden, NotFoundError } from "../middlewares/middlewaresRegistry.js";
import { validateProfane } from "../helpers/utils.js";
import { createChirps, deleteChirpByIdAsync, getAllChirpsAsync, getChirpByIdAsync, getChirpsByAuthorIdAsync } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js";


export async function validateChirpHandler(req: Request, res: Response, next: NextFunction){
  try {
    const body = req.body;

    if (
      typeof body !== "object" ||
      body === null ||
      typeof body.body !== "string"
    ) {
      return res.status(400).json({
        error: "Invalid body",
      });
    }

    if (body.body.length > 140) {
      throw new BadRequest("Chirp is too long. Max length is 140");
    }

    const dirtyString = body.body.trim().split(" ");
    const arr = validateProfane(dirtyString);

    res.status(200).json({ cleanedBody: arr.join(" ") });

  } catch (err) {
    next(err); 
  }
}

export async function createChirpHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const secret = process.env.SECRET
    if (!secret) {
      throw new Error("Missing JWT secret");
    }
    const token = getBearerToken(req)
    const userId = validateJWT(token, secret)

    const body = req.body;

    if (typeof body !== "object" || body === null) {
      return res.status(400).json({ error: "Invalid body" });
    }

    if (body.body.length > 140) {
      throw new BadRequest("Chirp is too long. Max length is 140");
    }

    const cleaned = validateProfane(body.body.trim().split(" ")).join(" ");

    const chirp = await createChirps(cleaned, userId);

    return res.status(201).json(chirp);
  } catch (err) {
    next(err);
  }
}

export async function deleteChirpHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const secret = process.env.SECRET
    if (!secret) {
      throw new Error("Missing JWT secret");
    }
    const token = getBearerToken(req)
    const userId = validateJWT(token, secret)

    const chirpID = req.params.chirpID

    const chirp = await getChirpByIdAsync(chirpID)
    if(!chirp){
      throw new NotFoundError("not found")
    }
    if(userId !== chirp.userId){
      throw new Forbidden("Forbidden")
    }
    await deleteChirpByIdAsync(chirp.id)

    res.sendStatus(204)
  } catch (err) {
    next(err);
  }
}

export async function getAllChirpsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authorId =
      typeof req.query.authorId === "string" ? req.query.authorId : "";

    const sort =
      req.query.sort === "desc" ? "desc" : "asc"; // default asc

    const sortFn = (a: any, b: any) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sort === "asc" ? dateA - dateB : dateB - dateA;
    };

    if (!authorId) {
      const result = await getAllChirpsAsync();
      result.sort(sortFn);
      return res.status(200).json(result);
    }

    const result = await getChirpsByAuthorIdAsync(authorId);

    if (result.length === 0) {
      throw new NotFoundError(`No chirps for author: ${authorId}`);
    }

    result.sort(sortFn);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}



export async function getChirpByIdHandler(req: Request, res: Response, next: NextFunction){
  try{
    const result = await getChirpByIdAsync(req.params.chirpID)
    if(!result){
      throw new NotFoundError(`No chirps with id: ${req.params.chirpID}`)
    }
    res.status(200).json(result)
  }catch(err){
    next(err)
  }
}

