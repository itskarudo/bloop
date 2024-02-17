import { relations } from "drizzle-orm";
import {
  uuid,
  pgTable,
  varchar,
  primaryKey,
  integer,
  timestamp,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: varchar("username", { length: 32 }).unique().notNull(),
  email: varchar("email").unique().notNull(),
  password: varchar("password").notNull(),
  image: varchar("image"),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const userRelations = relations(users, ({ many }) => ({
  userLists: many(usersLists),
  userInvites: many(invites),
}));

export const lists = pgTable("list", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title").notNull(),
});

export type List = typeof lists.$inferSelect;
export type NewList = typeof lists.$inferInsert;

export const listRelations = relations(lists, ({ many }) => ({
  listUsers: many(usersLists),
  listInvites: many(invites),
  listMedia: many(mediaLists),
}));

export const usersLists = pgTable(
  "user_list",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    listId: uuid("list_id")
      .notNull()
      .references(() => lists.id, { onDelete: "cascade" }),
    archived: boolean("archived").notNull().default(false),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => ({
    pk: primaryKey({
      columns: [t.userId, t.listId],
    }),
  })
);

export type UsersLists = typeof usersLists.$inferSelect;
export type NewUsersLists = typeof usersLists.$inferInsert;

export const usersListsRelations = relations(usersLists, ({ one }) => ({
  user: one(users, {
    fields: [usersLists.userId],
    references: [users.id],
  }),
  list: one(lists, {
    fields: [usersLists.listId],
    references: [lists.id],
  }),
}));

export const invites = pgTable(
  "invites",
  {
    invitedId: uuid("invited_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    inviterId: uuid("inviter_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    listId: uuid("list_id")
      .notNull()
      .references(() => lists.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => ({
    pk: primaryKey({
      columns: [t.invitedId, t.listId],
    }),
  })
);

export type Invite = typeof invites.$inferSelect;
export type NewInvite = typeof invites.$inferInsert;

export const inviteRelations = relations(invites, ({ one }) => ({
  invited: one(users, {
    fields: [invites.invitedId],
    references: [users.id],
  }),
  inviter: one(users, {
    fields: [invites.inviterId],
    references: [users.id],
  }),
  list: one(lists, {
    fields: [invites.listId],
    references: [lists.id],
  }),
}));

export const mediaType = pgEnum("mediaType", ["movie", "tv-show", "anime"]);

export const media = pgTable("media", {
  id: integer("id").primaryKey(), // TMDB ID
  title: varchar("title").notNull(),
  releaseDate: timestamp("release_date").notNull(),
  type: mediaType("type").notNull(),
  image: varchar("image"),
});

export const mediaRelations = relations(media, ({ many }) => ({
  mediaLists: many(mediaLists),
}));

export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;

export const mediaLists = pgTable(
  "media_list",
  {
    mediaId: integer("media_id")
      .notNull()
      .references(() => media.id, { onDelete: "cascade" }),
    listId: uuid("list_id")
      .notNull()
      .references(() => lists.id, { onDelete: "cascade" }),
    watched: boolean("watched").notNull().default(false),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => ({
    pk: primaryKey({
      columns: [t.mediaId, t.listId],
    }),
  })
);

export type MediaLists = typeof mediaLists.$inferSelect;
export type NewMediaLists = typeof mediaLists.$inferInsert;

export const mediaListsRelations = relations(mediaLists, ({ one, many }) => ({
  media: one(media, {
    fields: [mediaLists.mediaId],
    references: [media.id],
  }),
  list: one(lists, {
    fields: [mediaLists.listId],
    references: [lists.id],
  }),
  watchedEpisodes: many(watchedEpisode),
}));

export const watchedEpisode = pgTable(
  "watched_episode",
  {
    listId: uuid("list_id")
      .notNull()
      .references(() => lists.id, { onDelete: "cascade" }),
    mediaId: integer("media_id")
      .notNull()
      .references(() => media.id, { onDelete: "cascade" }),
    season: integer("season").notNull(),
    episode: integer("episode").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => ({
    pk: primaryKey({
      columns: [t.listId, t.mediaId, t.season, t.episode],
    }),
  })
);

export type WatchedEpisode = typeof watchedEpisode.$inferSelect;
export type NewWatchedEpisode = typeof watchedEpisode.$inferInsert;

export const watchedEpisodeRelations = relations(watchedEpisode, ({ one }) => ({
  media: one(mediaLists, {
    fields: [watchedEpisode.mediaId, watchedEpisode.listId],
    references: [mediaLists.mediaId, mediaLists.listId],
  }),
}));
