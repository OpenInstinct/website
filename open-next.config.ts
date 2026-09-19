import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default {
  ...defineCloudflareConfig({
    incrementalCache: r2IncrementalCache,
  }),
  // the "build" script runs OpenNext, so call next directly to avoid recursion
  buildCommand: "bunx next build",
};
