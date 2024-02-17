import { Hono } from "hono";
import { loginSchema, registerSchema } from "bloop-utils/validation";
import { validator } from "@/middlewares/validator";
import {
  LoginErrorCodes,
  RegisterErrorCodes,
  TokenErrorCodes,
} from "bloop-utils/types/ErrorCodes";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { HonoResponse } from "@/types";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import {
  generateTokens,
  getUserTokenVersion,
  setUserTokenVersion,
  verifyRefreshToken,
} from "@/utils/tokens";
import { requireAuth } from "@/middlewares/requireAuth";

const authRouter = new Hono();

authRouter.get("/authcheck", ...requireAuth(), async (c) => {
  return c.json({ ok: true, data: null });
});

authRouter.post("/logout", async (c) => {
  deleteCookie(c, "refresh_token");
  return c.json({ ok: true, data: null });
});

authRouter.post(
  "/register",
  validator(registerSchema),
  async (c): Promise<HonoResponse> => {
    const { username, email, password } = c.req.valid("json");

    const foundByUsername = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    if (foundByUsername) {
      c.status(400);
      return c.json({
        ok: false,
        errors: [RegisterErrorCodes.DUPLICATE_USERNAME],
      });
    }

    const foundByEmail = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (foundByEmail) {
      c.status(400);
      return c.json({
        ok: false,
        errors: [RegisterErrorCodes.DUPLICATE_EMAIL],
      });
    }

    const hashedPassword = await Bun.password.hash(password);

    const user = await db
      .insert(users)
      .values({
        username,
        email,
        password: hashedPassword,
      })
      .returning({
        userId: users.id,
      });

    setUserTokenVersion(user[0].userId, 0);

    return c.json({ ok: true, data: null });
  }
);

authRouter.post(
  "/login",
  validator(loginSchema),
  async (c): Promise<HonoResponse> => {
    const { username, password } = c.req.valid("json");

    const user = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    if (!user) {
      c.status(400);
      return c.json({
        ok: false,
        errors: [LoginErrorCodes.INVALID_CREDENTIALS],
      });
    }

    const passwordMatch = await Bun.password.verify(password, user.password);

    if (!passwordMatch) {
      c.status(400);
      return c.json({
        ok: false,
        errors: [LoginErrorCodes.INVALID_CREDENTIALS],
      });
    }

    const tokenVersion = await getUserTokenVersion(user.id);

    if (tokenVersion === null) {
      c.status(400);
      return c.json({
        ok: false,
        errors: [LoginErrorCodes.INVALID_CREDENTIALS],
      });
    }

    const tokens = await generateTokens({
      id: user.id,
      username: user.username,
      email: user.email,
      version: tokenVersion,
      image: user.image,
    });

    setCookie(c, "refresh_token", tokens.refreshToken, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return c.json({
      ok: true,
      data: {
        accessToken: tokens.accessToken,
      },
    });
  }
);

authRouter.get("/refresh", async (c): Promise<HonoResponse> => {
  const { refresh_token } = getCookie(c);

  if (!refresh_token) {
    c.status(401);
    return c.json({
      ok: false,
      errors: [TokenErrorCodes.INVALID_REFRESH_TOKEN],
    });
  }

  const payload = await verifyRefreshToken(refresh_token);

  if (!payload) {
    c.status(401);
    return c.json({
      ok: false,
      errors: [TokenErrorCodes.INVALID_REFRESH_TOKEN],
    });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, payload.id),
  });

  if (!user) {
    c.status(401);
    return c.json({
      ok: false,
      errors: [TokenErrorCodes.INVALID_REFRESH_TOKEN],
    });
  }

  const tokenVersion = await getUserTokenVersion(user.id);

  // in order to handle the catastrophic case where all redis data gets wiped,
  // we check for "less than" instead of "not equal to", this way we can set all versions to 0
  // without breaking the user experience much.

  if (tokenVersion === null || payload.version < tokenVersion) {
    c.status(401);
    return c.json({
      ok: false,
      errors: [TokenErrorCodes.INVALID_REFRESH_TOKEN],
    });
  }

  const tokens = await generateTokens({
    id: payload.id,
    username: user.username,
    email: user.email,
    version: tokenVersion,
    image: user.image,
  });

  setCookie(c, "refresh_token", tokens.refreshToken, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return c.json({
    ok: true,
    data: {
      accessToken: tokens.accessToken,
    },
  });
});

export default authRouter;
