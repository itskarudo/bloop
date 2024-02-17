import { db } from "@/db";
import { invites } from "@/db/schema";
import { requireAuth } from "@/middlewares/requireAuth";
import { HonoResponse } from "@/types";
import { AccessTokenPayload } from "bloop-utils/types";
import { count, eq } from "drizzle-orm";
import { Hono } from "hono";

const invitesRouter = new Hono();

invitesRouter.use("*", ...requireAuth());

invitesRouter.get("/", async (c): Promise<HonoResponse> => {
  const user = c.get("jwtPayload") as AccessTokenPayload;

  const result = await db.query.invites.findMany({
    with: {
      list: true,
      inviter: {
        columns: {
          username: true,
          image: true,
        },
      },
    },
    where: eq(invites.invitedId, user.id),
  });

  return c.json({ ok: true, data: { invites: result } });
});

invitesRouter.get("/count", async (c): Promise<HonoResponse> => {
  const user = c.get("jwtPayload") as AccessTokenPayload;

  const [{ value }] = await db
    .select({
      value: count(),
    })
    .from(invites)
    .where(eq(invites.invitedId, user.id));

  return c.json({ ok: true, data: { count: value } });
});

export default invitesRouter;
