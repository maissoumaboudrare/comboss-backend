import { Hono } from "hono";
import users from "./users";
import auth from "./auth";
import sessions from "./sessions";
import characters from "./characters";
import combos from "./combos";
import positions from "./positions";
import inputs from "./inputs";
import likes from "./likes";
import favorites from "./favorites";
import stats from "./stats";
import { cors } from 'hono/cors';

const app = new Hono();

app.use(
  '/api/*',
  cors({
    origin: 'http://localhost:3000',
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'PATCH', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  })
)

app.route("/api/users", users);
app.route("/api/auth", auth);
app.route("/api/sessions", sessions);
app.route("/api/characters", characters);
app.route("/api/combos", combos);
app.route("/api/positions", positions);
app.route("/api/inputs", inputs);
app.route("/api/likes", likes);
app.route("/api/favorites", favorites);
app.route("/api/stats", stats);

app.get("/api/*", (c) => c.text("API endpoint is not found", 404));

export default app;
