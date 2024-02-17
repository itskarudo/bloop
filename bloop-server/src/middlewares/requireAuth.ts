import { getUserTokenVersion } from "@/utils/tokens";
import { AccessTokenPayload } from "bloop-utils/types";
import { TokenErrorCodes } from "bloop-utils/types/ErrorCodes";
import { MiddlewareHandler } from "hono";
import { jwt } from "hono/jwt";

const checkJwtVersion: MiddlewareHandler = async (c, next) => {
  const user = c.get("jwtPayload") as AccessTokenPayload;
  const token = await getUserTokenVersion(user.id);

  if (token !== user.version) {
    c.status(401);
    return c.json({
      ok: false,
      errors: [TokenErrorCodes.INVALID_ACCESS_TOKEN],
    });
  }

  await next();
};

export const requireAuth = (): MiddlewareHandler[] => {
  return [
    jwt({
      secret: process.env.ACCESS_TOKEN_SECRET!,
    }),
    checkJwtVersion,
  ];
};
