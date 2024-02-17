import { ServerResponse } from "bloop-utils/types";
import { TypedResponse } from "hono";
import { JSONParsed } from "hono/utils/types";

export type HonoResponse<T = any> = TypedResponse<
  JSONParsed<ServerResponse<T>>
>;
