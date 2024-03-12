import { Hono } from "hono";
import { cors } from "hono/cors";
import authRouter from "./routes/auth";
import listsRouter from "./routes/lists";
import mediaRouter from "./routes/media";
import invitesRouter from "./routes/invites";
import profileRouter from "./routes/profile";
import { createRouteHandler } from "uploadthing/server";
import { uploadRouter } from "./utils/utRouter";

const app = new Hono();
app.use(
  "*",
  cors({
    origin: [process.env.WEB_URL!],
    credentials: true,
  })
);

const { GET, POST } = createRouteHandler({
  router: uploadRouter,
});

const ut = new Hono()
  .get("/", (c) => GET(c.req.raw))
  .post("/", (c) => POST(c.req.raw));

app.route("/upload", ut);

app.route("/auth", authRouter);
app.route("/profile", profileRouter);

app.route("/lists", listsRouter);
app.route("/media", mediaRouter);
app.route("/invites", invitesRouter);

export default {
  port: process.env.PORT || 5000,
  fetch: app.fetch,
};
