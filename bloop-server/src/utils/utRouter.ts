import {
  createUploadthing,
  UploadThingError,
  type FileRouter,
} from "uploadthing/server";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { AccessTokenPayload } from "bloop-utils/types";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { checkJwtVersion } from "@/middlewares/requireAuth";
export const utapi = new UTApi();

const f = createUploadthing();

export const uploadRouter = {
  profilePicture: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .input(
      z.object({
        access_token: z.string(),
      })
    )
    .middleware(({ input }) => {
      try {
        const user = jwt.verify(
          input.access_token,
          process.env.ACCESS_TOKEN_SECRET!
        ) as AccessTokenPayload;

        if (!checkJwtVersion(user)) throw new Error();

        return { user };
      } catch (_) {
        throw new UploadThingError("Unauthorized");
      }
    })
    .onUploadComplete(async ({ file, metadata }) => {
      await db.transaction(async (tx) => {
        const data = await tx.query.users.findFirst({
          columns: { image: true },
          where: eq(users.id, metadata.user.id),
        });

        if (data?.image) {
          await utapi.deleteFiles(data.image.split("/").pop()!);
        }

        await db
          .update(users)
          .set({
            image: file.url,
          })
          .where(eq(users.id, metadata.user.id));
      });
    }),
} satisfies FileRouter;

export type BloopFileRouter = typeof uploadRouter;
