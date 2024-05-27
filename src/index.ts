import { serve } from "@hono/node-server";
import api from "./api";

const port = 3000;

serve({
  fetch: api.fetch,
  port,
});
