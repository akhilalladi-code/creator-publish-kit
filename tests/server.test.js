import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createAppServer } from "../server.mjs";

test("static server serves app files and blocks traversal", async t => {
  const root = await mkdtemp(path.join(os.tmpdir(), "creator-kit-"));
  const sibling = root + "-secret";
  await mkdir(sibling);
  await writeFile(path.join(root, "index.html"), "safe app");
  await writeFile(path.join(sibling, "private.txt"), "secret");
  const server = createAppServer(root);
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  t.after(async () => { await new Promise(resolve => server.close(resolve)); await rm(root, { recursive: true, force: true }); await rm(sibling, { recursive: true, force: true }); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const ok = await fetch(base + "/index.html");
  assert.equal(ok.status, 200);
  assert.equal(await ok.text(), "safe app");
  const traversal = await fetch(base + "/%2e%2e%2f" + path.basename(sibling) + "/private.txt");
  assert.equal(traversal.status, 404);
  assert.equal(ok.headers.get("x-content-type-options"), "nosniff");
});
