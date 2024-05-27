import { Hono } from "hono";
import users from "./users";
import sessions from "./sessions";
import characters from "./characters";
import combos from "./combos";
import inputs from "./inputs";

const app = new Hono();

app.route("/api/users", users);
app.route("/api/sessions", sessions);
app.route("/api/characters", characters);
app.route("/api/combos", combos);
app.route("/api/inputs", inputs);

app.get("/api/*", (c) => c.text("API endpoint is not found", 404));

export default app;
