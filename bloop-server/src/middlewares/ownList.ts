import { db } from "@/db";
import { usersLists } from "@/db/schema";
import { AccessTokenPayload } from "bloop-utils/types";
import { ListsErrorCodes } from "bloop-utils/types/ErrorCodes";
import { and, eq } from "drizzle-orm";
import { MiddlewareHandler } from "hono";

export const ownList: MiddlewareHandler<any, ":listId"> = async (c, next) => {
  const user = c.get("jwtPayload") as AccessTokenPayload;

  const listId = c.req.param("listId");

  const userListRel = await db.query.usersLists.findFirst({
    where: and(eq(usersLists.userId, user.id), eq(usersLists.listId, listId)),
  });

  if (!userListRel) {
    c.status(404);
    return c.json({ ok: false, errors: [ListsErrorCodes.LIST_NOT_FOUND] });
  }

  await next();
};
