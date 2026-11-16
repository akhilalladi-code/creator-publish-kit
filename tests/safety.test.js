import test from "node:test";
import assert from "node:assert/strict";
import { validateImportedProject, validateThumbnailFile, MAX_THUMBNAIL_BYTES } from "../src/safety.js";
import { isPathInsideRoot } from "../server-utils.mjs";
import { createInitialProject } from "../src/core.js";

test("path boundary accepts files inside root and rejects sibling-prefix paths", () => {
  const root = "/tmp/creator";
  assert.equal(isPathInsideRoot(root, root + "/index.html"), true);
  assert.equal(isPathInsideRoot(root, "/tmp/creator-secret/private.txt"), false);
  assert.equal(isPathInsideRoot(root, "/tmp/outside.txt"), false);
});
test("import validation merges only known project fields and checklist keys", () => {
  const imported = validateImportedProject({ title: "Imported", checklist: { metadata: true, injected: true }, ignored: "value" }, createInitialProject());
  assert.equal(imported.title, "Imported");
  assert.equal(imported.checklist.metadata, true);
  assert.equal("injected" in imported.checklist, false);
  assert.equal("ignored" in imported, false);
});
test("import validation rejects invalid shapes, types, limits and enum values", () => {
  const initial = createInitialProject();
  assert.throws(() => validateImportedProject([], initial), /project object/);
  assert.throws(() => validateImportedProject({ title: 42 }, initial), /must be text/);
  assert.throws(() => validateImportedProject({ description: "x".repeat(5501) }, initial), /exceeds/);
  assert.throws(() => validateImportedProject({ visibility: "Everyone" }, initial), /visibility/);
  assert.throws(() => validateImportedProject({ checklist: { metadata: "yes" } }, initial), /checklist value/);
});
test("thumbnail validation enforces allowed type and 10 MB size", () => {
  validateThumbnailFile({ type: "image/png", size: 100 });
  assert.throws(() => validateThumbnailFile({ type: "image/svg+xml", size: 100 }), /Use a PNG/);
  assert.throws(() => validateThumbnailFile({ type: "image/png", size: MAX_THUMBNAIL_BYTES + 1 }), /10 MB/);
  assert.throws(() => validateThumbnailFile({ type: "image/png", size: 0 }), /empty/);
});
