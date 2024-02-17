import {
  type User,
  type NewUser,
  type List,
  type NewList,
  type UsersLists,
  type NewUsersLists,
  type Invite,
  type NewInvite,
  type Media,
  type NewMedia,
  type MediaLists,
  type NewMediaLists,
  type WatchedEpisode,
  type NewWatchedEpisode,
} from "bloop-server/src/db/schema";

export type ServerSuccess<T = any> = {
  ok: true;
  data: T;
};

export type ServerError = {
  ok: false;
  errors: string[];
};

export type ServerResponse<T = any> = ServerSuccess<T> | ServerError;

export type AccessTokenPayload = {
  id: string;
  username: string;
  email: string;
  image: string | null;
  version: number;
};

export type RefreshTokenPayload = {
  id: string;
  version: number;
};

export type APIMedia = Omit<Media, "releaseDate"> & {
  releaseDate: string;
};

export type {
  User,
  NewUser,
  List,
  NewList,
  UsersLists,
  NewUsersLists,
  Invite,
  NewInvite,
  Media,
  NewMedia,
  MediaLists,
  NewMediaLists,
  WatchedEpisode,
  NewWatchedEpisode,
};

export type TMDBMovie = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string | null;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export type TMDBTVShow = {
  backdrop_path: string;
  first_air_date: string;
  genre_ids: number[];
  id: number;
  name: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string | null;
  popularity: number;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
};

export type TMDBAnime = TMDBTVShow;
