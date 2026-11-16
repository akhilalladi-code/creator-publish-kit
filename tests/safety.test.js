import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { isPathInsideRoot, validateImportedProject, validateThumbnailFile, MAX_THUMBNAIL_BYTES } from "../src/safety.js";
import { createInitialProject } from "../src/core.js";

test("path boundary accepts files inside root and rejects sibling-prefix paths", () => {
  const root = path.resolve("/tmp/creator");
  assert.equal(isPathInsideRoot(root, path.join(root, "index.html")), true);
  assert.equal(isPathInsideRoot(root, path.resolve("/tmp/creator-secret/private.txt")), false);
  assert.equal(isPathInsideRoot(root, path.resolve(root, "../outside.txt")), false);
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
