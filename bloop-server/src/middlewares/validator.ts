import { zValidator } from "@hono/zod-validator";
import { ZodType, ZodTypeDef } from "zod";

export const validator = <T extends ZodType<any, ZodTypeDef, any>>(
  schema: T
) => {
  return zValidator("json", schema, (result, c) => {
    if (!result.success) {
      c.status(400);
      return c.json({
        ok: false,
        errors: result.error.errors.map((x) => x.message),
      });
    }
  });
};
