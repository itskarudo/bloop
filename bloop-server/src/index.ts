import { Hono } from "hono";
import { cors } from "hono/cors";
import authRouter from "./routes/auth";
import listsRouter from "./routes/lists";
import mediaRouter from "./routes/media";
import invitesRouter from "./routes/invites";
import profileRouter from "./routes/profile";

const app = new Hono();
app.use(
  "*",
  cors({
    origin: [process.env.WEB_URL!],
    credentials: true,
  })
);

app.route("/auth", authRouter);
app.route("/profile", profileRouter);

app.route("/lists", listsRouter);
app.route("/media", mediaRouter);
app.route("/invites", invitesRouter);

export default {
  port: process.env.PORT || 5000,
  fetch: app.fetch,
};
