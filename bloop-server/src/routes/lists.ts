import { db } from "@/db";
import {
  invites,
  lists,
  media,
  mediaLists,
  users,
  usersLists,
} from "@/db/schema";
import { ownList } from "@/middlewares/ownList";
import { requireAuth } from "@/middlewares/requireAuth";
import { validator } from "@/middlewares/validator";
import { HonoResponse } from "@/types";
import { AccessTokenPayload } from "bloop-utils/types";
import {
  GenericErrorCodes,
  ListsErrorCodes,
} from "bloop-utils/types/ErrorCodes";
import {
  addMediaSchema,
  inviteUsersSchema,
  listsSchema,
  renameListSchema,
} from "bloop-utils/validation";
import { and, count, desc, eq, inArray, not } from "drizzle-orm";
import { Hono } from "hono";

const listsRouter = new Hono();

listsRouter.use("*", ...requireAuth());

listsRouter.get("/", async (c): Promise<HonoResponse> => {
  const user = c.get("jwtPayload") as AccessTokenPayload;

  const fetchedLists = await db
    .select({
      id: lists.id,
      title: lists.title,
    })
    .from(usersLists)
    .leftJoin(lists, eq(usersLists.listId, lists.id))
    .leftJoin(users, eq(usersLists.userId, users.id))
    .where(and(eq(users.id, user.id), not(usersLists.archived)))
    .orderBy(desc(usersLists.createdAt));

  return c.json({ ok: true, data: { lists: fetchedLists } });
});

listsRouter.get("/archived", async (c): Promise<HonoResponse> => {
  const user = c.get("jwtPayload") as AccessTokenPayload;

  const fetchedLists = await db
    .select({
      id: lists.id,
      title: lists.title,
    })
    .from(usersLists)
    .leftJoin(lists, eq(usersLists.listId, lists.id))
    .leftJoin(users, eq(usersLists.userId, users.id))
    .where(and(eq(users.id, user.id), usersLists.archived))
    .orderBy(desc(usersLists.createdAt));

  return c.json({ ok: true, data: { lists: fetchedLists } });
});

listsRouter.post(
  "/",
  validator(listsSchema),
  async (c): Promise<HonoResponse> => {
    const user = c.get("jwtPayload") as AccessTokenPayload;

    const { title, invites: invitedUsernamesList } = c.req.valid("json");

    const list = await db
      .insert(lists)
      .values({
        title,
      })
      .returning({ listId: lists.id });

    await db.insert(usersLists).values({
      userId: user.id,
      listId: list[0].listId,
    });

    if (invitedUsernamesList.length !== 0) {
      const invitedUsernames = invitedUsernamesList.map((x) => x.text);

      const invitedIds = (
        await db
          .select({
            id: users.id,
          })
          .from(users)
          .where(
            and(
              inArray(users.username, invitedUsernames),
              not(eq(users.id, user.id))
            )
          )
      ).map((x) => x.id);

      if (invitedIds.length !== 0) {
        await db.insert(invites).values(
          invitedIds.map((id) => ({
            listId: list[0].listId,
            invitedId: id,
            inviterId: user.id,
          }))
        );
      }
    }

    return c.json({ ok: true, data: { listId: list[0].listId } });
  }
);

listsRouter.get("/:listId", ownList, async (c): Promise<HonoResponse> => {
  const listId = c.req.param("listId");
  const user = c.get("jwtPayload") as AccessTokenPayload;

  const result = await db.query.lists.findFirst({
    with: {
      listUsers: {
        where: and(
          eq(usersLists.listId, listId),
          eq(usersLists.userId, user.id)
        ),
        columns: {
          archived: true,
        },
      },
      listMedia: {
        orderBy: [desc(mediaLists.createdAt), desc(mediaLists.mediaId)],
        with: {
          media: true,
        },
      },
    },
    where: eq(lists.id, listId),
  });

  if (!result) {
    c.status(404);
    return c.json({ ok: false, errors: [ListsErrorCodes.LIST_NOT_FOUND] });
  }

  return c.json({ ok: true, data: { list: result } });
});

listsRouter.delete("/:listId", ownList, async (c): Promise<HonoResponse> => {
  const listId = c.req.param("listId");
  await db.delete(lists).where(eq(lists.id, listId));
  return c.json({ ok: true, data: null });
});

listsRouter.put(
  "/:listId",
  ownList,
  validator(renameListSchema),
  async (c): Promise<HonoResponse> => {
    const listId = c.req.param("listId");
    const { title } = c.req.valid("json");
    await db
      .update(lists)
      .set({
        title,
      })
      .where(eq(lists.id, listId));

    return c.json({ ok: true, data: null });
  }
);

listsRouter.post(
  "/:listId/media",
  ownList,
  validator(addMediaSchema),
  async (c): Promise<HonoResponse> => {
    const listId = c.req.param("listId");
    const { mediaList } = c.req.valid("json");

    await db
      .insert(media)
      .values(
        mediaList.map((x) => ({ ...x, releaseDate: new Date(x.releaseDate) }))
      )
      .onConflictDoNothing();

    await db
      .insert(mediaLists)
      .values(
        mediaList.map((item) => ({
          listId,
          mediaId: item.id,
        }))
      )
      .onConflictDoNothing();

    return c.json({ ok: true, data: null });
  }
);

listsRouter.put(
  "/:listId/media/:mediaId",
  ownList,
  async (c): Promise<HonoResponse> => {
    const listId = c.req.param("listId");
    const mediaId = parseInt(c.req.param("mediaId"));
    await db
      .update(mediaLists)
      .set({
        watched: not(mediaLists.watched),
      })
      .where(
        and(eq(mediaLists.mediaId, mediaId), eq(mediaLists.listId, listId))
      );
    return c.json({ ok: true, data: null });
  }
);

listsRouter.delete(
  "/:listId/media/:mediaId",
  ownList,
  async (c): Promise<HonoResponse> => {
    const listId = c.req.param("listId");
    const mediaId = parseInt(c.req.param("mediaId"));

    await db
      .delete(mediaLists)
      .where(
        and(eq(mediaLists.mediaId, mediaId), eq(mediaLists.listId, listId))
      );
    return c.json({ ok: true, data: null });
  }
);

listsRouter.get("/:listId/users", ownList, async (c): Promise<HonoResponse> => {
  const listId = c.req.param("listId");
  const user = c.get("jwtPayload") as AccessTokenPayload;

  const result = await db.query.usersLists.findMany({
    with: {
      user: {
        columns: {
          password: false,
        },
      },
    },
    where: and(
      eq(usersLists.listId, listId),
      not(eq(usersLists.userId, user.id))
    ),
    orderBy: [desc(usersLists.createdAt), desc(usersLists.userId)],
  });

  return c.json({ ok: true, data: { users: result.map((x) => x.user) } });
});

listsRouter.delete(
  "/:listId/users/:userId",
  ownList,
  async (c): Promise<HonoResponse> => {
    const listId = c.req.param("listId");
    const userId = c.req.param("userId");

    await db
      .delete(usersLists)
      .where(and(eq(usersLists.userId, userId), eq(usersLists.listId, listId)));

    const [{ usersLeft }] = await db
      .select({
        usersLeft: count(),
      })
      .from(usersLists)
      .where(eq(usersLists.listId, listId));

    if (usersLeft === 0) {
      await db.delete(lists).where(eq(lists.id, listId));
    }

    return c.json({ ok: true, data: null });
  }
);

listsRouter.post("/:listId/accept-invite", async (c): Promise<HonoResponse> => {
  const user = c.get("jwtPayload") as AccessTokenPayload;
  const listId = c.req.param("listId");

  const res = await db
    .delete(invites)
    .where(and(eq(invites.listId, listId), eq(invites.invitedId, user.id)))
    .returning({ listId: invites.listId });

  if (res.length === 0) {
    // nice try, sneaky hacker
    c.status(404);
    c.json({ ok: false, errors: [ListsErrorCodes.LIST_NOT_FOUND] });
  }

  await db
    .insert(usersLists)
    .values({
      listId,
      userId: user.id,
    })
    .onConflictDoNothing();

  return c.json({ ok: true, data: null });
});

listsRouter.post(
  "/:listId/decline-invite",
  async (c): Promise<HonoResponse> => {
    const user = c.get("jwtPayload") as AccessTokenPayload;
    const listId = c.req.param("listId");

    await db
      .delete(invites)
      .where(and(eq(invites.listId, listId), eq(invites.invitedId, user.id)));

    return c.json({ ok: true, data: null });
  }
);

listsRouter.post(
  "/:listId/invite",
  ownList,
  validator(inviteUsersSchema),
  async (c): Promise<HonoResponse> => {
    const user = c.get("jwtPayload") as AccessTokenPayload;
    const listId = c.req.param("listId");
    const { usernames } = c.req.valid("json");

    if (usernames.length === 0) return c.json({ ok: true, data: null });

    const listUsers = await db.query.usersLists.findMany({
      where: eq(usersLists.listId, listId),
    });

    if (listUsers.length === 0)
      return c.json({
        ok: false,
        errors: [GenericErrorCodes.SOMETHING_WENT_WRONG],
      });

    const allInvitedIds = (
      await db
        .select({
          id: users.id,
        })
        .from(users)
        .where(inArray(users.username, usernames))
    ).map((x) => x.id);

    const invitedIds = allInvitedIds.filter(
      (id) => !listUsers.some((x) => x.userId === id)
    );

    if (invitedIds.length === 0) return c.json({ ok: true, data: null });

    await db.insert(invites).values(
      invitedIds.map((id) => ({
        listId,
        invitedId: id,
        inviterId: user.id,
      }))
    );

    return c.json({ ok: true, data: null });
  }
);

listsRouter.post(
  "/:listId/archive",
  ownList,
  async (c): Promise<HonoResponse> => {
    const listId = c.req.param("listId");
    await db
      .update(usersLists)
      .set({
        archived: true,
      })
      .where(eq(usersLists.listId, listId));
    return c.json({ ok: true, data: null });
  }
);

listsRouter.post(
  "/:listId/unarchive",
  ownList,
  async (c): Promise<HonoResponse> => {
    const listId = c.req.param("listId");
    await db
      .update(usersLists)
      .set({
        archived: false,
      })
      .where(eq(usersLists.listId, listId));
    return c.json({ ok: true, data: null });
  }
);

export default listsRouter;
