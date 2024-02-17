import redis from "@/redis";
import { AccessTokenPayload, RefreshTokenPayload } from "bloop-utils/types";
import { sign, verify } from "hono/jwt";

export const generateTokens = async (payload: AccessTokenPayload) => {
  const accessToken = await sign(
    {
      ...payload,
      exp: Date.now() / 1000 + 15 * 60,
    },
    process.env.ACCESS_TOKEN_SECRET!
  );

  const refreshToken = await sign(
    {
      id: payload.id,
      version: payload.version,
      exp: Date.now() / 1000 + 7 * 24 * 60 * 60,
    },
    process.env.REFRESH_TOKEN_SECRET!
  );

  return { accessToken, refreshToken };
};

export const verifyAccessToken = async (token: string) => {
  return await verify(token, process.env.ACCESS_TOKEN_SECRET!);
};

export const verifyRefreshToken = async (token: string) => {
  try {
    return (await verify(
      token,
      process.env.REFRESH_TOKEN_SECRET!
    )) as RefreshTokenPayload;
  } catch (e) {
    return null;
  }
};

export const getUserTokenVersion = async (userId: string) => {
  let token = await redis.get(userId);
  if (!token) return null;
  return parseInt(token);
};

export const setUserTokenVersion = async (userId: string, version: number) => {
  await redis.set(userId, version);
};
