import { NextFunction } from "express";
import { Request, Response } from "express";
import { getAPIKey } from "../auth.js";
import { getUserByIdAsync, upgradeChirpRedByIdAsync } from "../db/queries/users.js";

export async function polkaWebhookHandler(
  req: Request,
  res: Response,
  next: NextFunction
){
  try {
    const API_KEY = process.env.POLKA_KEY
    const headersKey = getAPIKey(req)
    if(API_KEY !== headersKey){
      return res.sendStatus(401)
    }
    const { event, data } = req.body ?? {};
    const userId = data?.userId;

    if (event !== "user.upgraded") {
      return res.sendStatus(204);
    }

    if (!userId) {
      return res.sendStatus(400);
    }

    const user = await getUserByIdAsync(userId);
    if (!user) {
      return res.sendStatus(404);
    }

    await upgradeChirpRedByIdAsync(userId);
    return res.sendStatus(204);

  } catch (err) {
    next(err);
  }
}
