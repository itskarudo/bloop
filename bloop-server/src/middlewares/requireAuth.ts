import { getUserTokenVersion } from "@/utils/tokens";
import { AccessTokenPayload } from "bloop-utils/types";
import { TokenErrorCodes } from "bloop-utils/types/ErrorCodes";
import { MiddlewareHandler } from "hono";
import { jwt } from "hono/jwt";

export const checkJwtVersion = async (user: AccessTokenPayload) => {
  const token = await getUserTokenVersion(user.id);
  return token === user.version;
};

export const requireAuth = (): MiddlewareHandler[] => {
  return [
    jwt({
      secret: process.env.ACCESS_TOKEN_SECRET!,
    }),
    async (c, next) => {
      const user = c.get("jwtPayload") as AccessTokenPayload;

      if (await checkJwtVersion(user)) {
        return await next();
      }

      c.status(401);
      return c.json({
        ok: false,
        errors: [TokenErrorCodes.INVALID_ACCESS_TOKEN],
      });
    },
  ];
};
