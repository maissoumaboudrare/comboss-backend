import { serve } from "@hono/node-server";
import api from "./api";

const port = 3010;

serve({
  fetch: api.fetch,
  port,
});
