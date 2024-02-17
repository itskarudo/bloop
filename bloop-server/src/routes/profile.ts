import { Hono } from "hono";
import { requireAuth } from "@/middlewares/requireAuth";
import { HonoResponse } from "@/types";
import { validator } from "@/middlewares/validator";
import { editProfileSchema } from "bloop-utils/validation";
import { AccessTokenPayload } from "bloop-utils/types";
import { db } from "@/db";
import { users } from "@/db/schema";
import { and, eq, not } from "drizzle-orm";
import {
  EditProfileErrorCodes,
  GenericErrorCodes,
} from "bloop-utils/types/ErrorCodes";

const profileRouter = new Hono();
profileRouter.use("*", ...requireAuth());

profileRouter.put(
  "/",
  validator(editProfileSchema),
  async (c): Promise<HonoResponse> => {
    const user = c.get("jwtPayload") as AccessTokenPayload;
    const { username, email, currentPassword, newPassword } =
      c.req.valid("json");

    let shouldUpdateUsername = false;
    let shouldUpdateEmail = false;
    let shouldUpdatePassword = false;

    if (username !== user.username) {
      const duplicateUsername = await db
        .select({
          id: users.id,
        })
        .from(users)
        .where(and(not(eq(users.id, user.id)), eq(users.username, username)));

      if (duplicateUsername.length !== 0) {
        c.status(400);
        return c.json({
          ok: false,
          errors: [EditProfileErrorCodes.DUPLICATE_USERNAME],
        });
      }

      shouldUpdateUsername = true;
    }

    if (email !== user.email) {
      const duplicateEmail = await db
        .select({
          id: users.id,
        })
        .from(users)
        .where(and(not(eq(users.id, user.id)), eq(users.email, email)));

      if (duplicateEmail.length !== 0) {
        c.status(400);
        return c.json({
          ok: false,
          errors: [EditProfileErrorCodes.DUPLICATE_EMAIL],
        });
      }

      shouldUpdateEmail = true;
    }

    if (currentPassword !== "") {
      const me = await db.query.users.findFirst({
        columns: { password: true },
        where: eq(users.id, user.id),
      });

      if (!me) {
        c.status(500);
        return c.json({
          ok: false,
          errors: [GenericErrorCodes.SOMETHING_WENT_WRONG],
        });
      }

      const isCorrectPassword = await Bun.password.verify(
        currentPassword,
        me.password
      );

      if (!isCorrectPassword) {
        c.status(400);
        return c.json({
          ok: false,
          errors: [EditProfileErrorCodes.INVALID_PASSWORD],
        });
      }

      shouldUpdatePassword = true;
    }

    if (shouldUpdateUsername || shouldUpdateEmail || shouldUpdatePassword) {
      await db
        .update(users)
        .set({
          username,
          email,
          password: shouldUpdatePassword
            ? await Bun.password.hash(newPassword)
            : undefined,
        })
        .where(eq(users.id, user.id));
    }

    return c.json({ ok: true, data: null });
  }
);

export default profileRouter;
