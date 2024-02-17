import { db } from "@/db";
import { mediaLists, watchedEpisode } from "@/db/schema";
import { ownList } from "@/middlewares/ownList";
import { requireAuth } from "@/middlewares/requireAuth";
import { validator } from "@/middlewares/validator";
import { HonoResponse } from "@/types";
import {
  GenericErrorCodes,
  MediaErrorCodes,
} from "bloop-utils/types/ErrorCodes";
import { toggleWatchedSchema } from "bloop-utils/validation";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";

const mediaRouter = new Hono();
mediaRouter.use("*", ...requireAuth());

mediaRouter.get("/search/movies", async (c): Promise<HonoResponse> => {
  const query = c.req.query("query") ?? "";
  const page = parseInt(c.req.query("page") ?? "0");
  const ENDPOINT = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_null_first_air_dates=false&language=en-US&sort_by=popularity.desc&without_keywords=210024|13141&with_text_query=${query}&api_key=${process.env.TMDB_API_KEY}`;
  try {
    const result = await Promise.all([
      fetch(`${ENDPOINT}&page=${page * 3 + 1}`).then((res) => res.json()),
      fetch(`${ENDPOINT}&page=${page * 3 + 2}`).then((res) => res.json()),
      fetch(`${ENDPOINT}&page=${page * 3 + 3}`).then((res) => res.json()),
    ]);
    const total_results = result[0].total_results;
    const movies = result
      .map((r) => r.results)
      .reduce((acc, val) => acc.concat(val), []);

    return c.json({ ok: true, data: { total_results, results: movies } });
  } catch (error) {
    c.status(500);
    return c.json({
      ok: false,
      errors: [GenericErrorCodes.SOMETHING_WENT_WRONG],
    });
  }
});

mediaRouter.get("/search/tv-shows", async (c): Promise<HonoResponse> => {
  const query = c.req.query("query") ?? "";
  const page = parseInt(c.req.query("page") ?? "0");
  const ENDPOINT = `https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&sort_by=popularity.desc&without_keywords=210024|13141&with_text_query=${query}&api_key=${process.env.TMDB_API_KEY}`;

  try {
    const result = await Promise.all([
      fetch(`${ENDPOINT}&page=${page * 3 + 1}`).then((res) => res.json()),
      fetch(`${ENDPOINT}&page=${page * 3 + 2}`).then((res) => res.json()),
      fetch(`${ENDPOINT}&page=${page * 3 + 3}`).then((res) => res.json()),
    ]);

    const total_results = result[0].total_results;

    const shows = result
      .map((r) => r.results)
      .reduce((acc, val) => acc.concat(val), []);

    return c.json({ ok: true, data: { total_results, results: shows } });
  } catch (error) {
    c.status(500);
    return c.json({
      ok: false,
      errors: [GenericErrorCodes.SOMETHING_WENT_WRONG],
    });
  }
});

mediaRouter.get("/search/anime", async (c): Promise<HonoResponse> => {
  const query = c.req.query("query") ?? "";
  const page = parseInt(c.req.query("page") ?? "0");
  const ENDPOINT = `https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&sort_by=popularity.desc&with_keywords=13141|210024&with_text_query=${query}&api_key=${process.env.TMDB_API_KEY}`;
  try {
    const result = await Promise.all([
      fetch(`${ENDPOINT}&page=${page * 3 + 1}`).then((res) => res.json()),
      fetch(`${ENDPOINT}&page=${page * 3 + 2}`).then((res) => res.json()),
      fetch(`${ENDPOINT}&page=${page * 3 + 3}`).then((res) => res.json()),
    ]);
    const total_results = result[0].total_results;
    const anime = result
      .map((r) => r.results)
      .reduce((acc, val) => acc.concat(val), []);

    return c.json({ ok: true, data: { total_results, results: anime } });
  } catch (error) {
    c.status(500);
    return c.json({
      ok: false,
      errors: [GenericErrorCodes.SOMETHING_WENT_WRONG],
    });
  }
});

mediaRouter.get(
  "/movie/:movieId/list/:listId",
  ownList,
  async (c): Promise<HonoResponse> => {
    const movieId = parseInt(c.req.param("movieId"));
    const listId = c.req.param("listId");

    if (!listId) {
      c.status(400);
      return c.json({ ok: false, errors: [MediaErrorCodes.MEDIA_NOT_FOUND] });
    }

    const relation = await db.query.mediaLists.findFirst({
      with: {
        media: {
          columns: { type: true },
        },
      },
      where: and(
        eq(mediaLists.listId, listId),
        eq(mediaLists.mediaId, movieId)
      ),
    });

    if (!relation || relation.media.type !== "movie") {
      c.status(404);
      return c.json({ ok: false, errors: [MediaErrorCodes.MEDIA_NOT_FOUND] });
    }

    const ENDPOINT = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}`;

    const result = await fetch(ENDPOINT);

    if (result.status === 404) {
      c.status(404);
      return c.json({ ok: false, errors: [MediaErrorCodes.MEDIA_NOT_FOUND] });
    }

    const movieData = await result.json();

    return c.json({
      ok: true,
      data: {
        movieData,
        watched: relation.watched,
      },
    });
  }
);

mediaRouter.get(
  "/tv-show/:showId/list/:listId",
  ownList,
  async (c): Promise<HonoResponse> => {
    const showId = parseInt(c.req.param("showId"));
    const listId = c.req.param("listId");

    if (!listId) {
      c.status(400);
      return c.json({ ok: false, errors: [MediaErrorCodes.MEDIA_NOT_FOUND] });
    }

    const relation = await db.query.mediaLists.findFirst({
      with: {
        media: {
          columns: { type: true },
        },
        watchedEpisodes: {
          columns: { season: true, episode: true },
        },
      },
      where: and(eq(mediaLists.listId, listId), eq(mediaLists.mediaId, showId)),
    });

    if (!relation || relation.media.type !== "tv-show") {
      c.status(404);
      return c.json({ ok: false, errors: [MediaErrorCodes.MEDIA_NOT_FOUND] });
    }

    const ENDPOINT = `https://api.themoviedb.org/3/tv/${showId}?api_key=${process.env.TMDB_API_KEY}`;

    const result = await fetch(ENDPOINT);

    if (result.status === 404) {
      c.status(404);
      return c.json({ ok: false, errors: [MediaErrorCodes.MEDIA_NOT_FOUND] });
    }

    const showData = await result.json();

    return c.json({
      ok: true,
      data: {
        showData,
        watchedEpisodes: relation.watchedEpisodes,
        watched: relation.watched,
      },
    });
  }
);

mediaRouter.get(
  "/anime/:animeId/list/:listId",
  ownList,
  async (c): Promise<HonoResponse> => {
    const animeId = parseInt(c.req.param("animeId"));
    const listId = c.req.param("listId");

    if (!listId) {
      c.status(400);
      return c.json({ ok: false, errors: [MediaErrorCodes.MEDIA_NOT_FOUND] });
    }

    const relation = await db.query.mediaLists.findFirst({
      with: {
        media: {
          columns: { type: true },
        },
        watchedEpisodes: {
          columns: { season: true, episode: true },
        },
      },
      where: and(
        eq(mediaLists.listId, listId),
        eq(mediaLists.mediaId, animeId)
      ),
    });

    if (!relation || relation.media.type !== "anime") {
      c.status(404);
      return c.json({ ok: false, errors: [MediaErrorCodes.MEDIA_NOT_FOUND] });
    }

    const ENDPOINT = `https://api.themoviedb.org/3/tv/${animeId}?api_key=${process.env.TMDB_API_KEY}`;

    const result = await fetch(ENDPOINT);

    if (result.status === 404) {
      c.status(404);
      return c.json({ ok: false, errors: [MediaErrorCodes.MEDIA_NOT_FOUND] });
    }

    const animeData = await result.json();

    return c.json({
      ok: true,
      data: {
        animeData,
        watchedEpisodes: relation.watchedEpisodes,
        watched: relation.watched,
      },
    });
  }
);

mediaRouter.put(
  "/tv-show/:showId/list/:listId",
  ownList,
  validator(toggleWatchedSchema),
  async (c): Promise<HonoResponse> => {
    const showId = parseInt(c.req.param("showId"));
    const listId = c.req.param("listId");

    const { season, episode } = c.req.valid("json");

    if (!listId) {
      c.status(400);
      return c.json({ ok: false, errors: [MediaErrorCodes.MEDIA_NOT_FOUND] });
    }

    const relation = await db.query.mediaLists.findFirst({
      with: {
        media: {
          columns: { type: true },
        },
      },
      where: and(eq(mediaLists.listId, listId), eq(mediaLists.mediaId, showId)),
    });

    if (!relation || relation.media.type !== "tv-show") {
      c.status(404);
      return c.json({ ok: false, errors: [MediaErrorCodes.MEDIA_NOT_FOUND] });
    }

    const res = await db
      .delete(watchedEpisode)
      .where(
        and(
          eq(watchedEpisode.mediaId, showId),
          eq(watchedEpisode.listId, listId),
          eq(watchedEpisode.season, season),
          eq(watchedEpisode.episode, episode)
        )
      )
      .returning({
        episode: watchedEpisode.episode,
      });

    if (res.length === 0) {
      await db.insert(watchedEpisode).values({
        listId,
        mediaId: showId,
        season,
        episode,
      });
    }

    return c.json({ ok: true, data: null });
  }
);

mediaRouter.put(
  "/anime/:animeId/list/:listId",
  ownList,
  validator(toggleWatchedSchema),
  async (c): Promise<HonoResponse> => {
    const animeId = parseInt(c.req.param("animeId"));
    const listId = c.req.param("listId");

    const { season, episode } = c.req.valid("json");

    if (!listId) {
      c.status(400);
      return c.json({ ok: false, errors: [MediaErrorCodes.MEDIA_NOT_FOUND] });
    }

    const relation = await db.query.mediaLists.findFirst({
      with: {
        media: {
          columns: { type: true },
        },
      },
      where: and(
        eq(mediaLists.listId, listId),
        eq(mediaLists.mediaId, animeId)
      ),
    });

    if (!relation || relation.media.type !== "anime") {
      c.status(404);
      return c.json({ ok: false, errors: [MediaErrorCodes.MEDIA_NOT_FOUND] });
    }

    const res = await db
      .delete(watchedEpisode)
      .where(
        and(
          eq(watchedEpisode.mediaId, animeId),
          eq(watchedEpisode.listId, listId),
          eq(watchedEpisode.season, season),
          eq(watchedEpisode.episode, episode)
        )
      )
      .returning({
        episode: watchedEpisode.episode,
      });

    if (res.length === 0) {
      await db.insert(watchedEpisode).values({
        listId,
        mediaId: animeId,
        season,
        episode,
      });
    }

    return c.json({ ok: true, data: null });
  }
);

export default mediaRouter;
