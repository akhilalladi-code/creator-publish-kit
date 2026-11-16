export const MAX_THUMBNAIL_BYTES = 10 * 1024 * 1024;
export const MAX_THUMBNAIL_DIMENSION = 8192;

export function validateImportedProject(data, initialProject) {
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("The JSON file must contain a project object.");
  const stringFields = ["title", "description", "tags", "keyword", "audience", "cta", "format", "visibility", "language", "chapters"];
  for (const key of stringFields) if (data[key] !== undefined && typeof data[key] !== "string") throw new Error(`Invalid project field: ${key} must be text.`);
  const limits = { title: 120, description: 5500, tags: 5000, keyword: 300, audience: 500, cta: 500, language: 100, chapters: 20000 };
  for (const [key, limit] of Object.entries(limits)) if ((data[key] ?? "").length > limit) throw new Error(`Invalid project field: ${key} exceeds ${limit} characters.`);
  if (data.format !== undefined && !["Long-form", "Shorts", "Livestream / replay"].includes(data.format)) throw new Error("Invalid video format.");
  if (data.visibility !== undefined && !["Private", "Unlisted", "Public", "Scheduled"].includes(data.visibility)) throw new Error("Invalid visibility setting.");
  const checklist = { ...initialProject.checklist };
  if (data.checklist !== undefined) {
    if (!data.checklist || typeof data.checklist !== "object" || Array.isArray(data.checklist)) throw new Error("Invalid checklist data.");
    for (const key of Object.keys(checklist)) {
      if (data.checklist[key] !== undefined && typeof data.checklist[key] !== "boolean") throw new Error(`Invalid checklist value: ${key}.`);
      if (data.checklist[key] !== undefined) checklist[key] = data.checklist[key];
    }
  }
  return { ...initialProject, ...Object.fromEntries(stringFields.filter(key => data[key] !== undefined).map(key => [key, data[key]])), checklist };
}
export function validateThumbnailFile(file) {
  if (!file) throw new Error("Choose an image file first.");
  if (!["image/png", "image/jpeg", "image/webp", "image/gif"].includes(file.type)) throw new Error("Use a PNG, JPEG, WebP or GIF image.");
  if (file.size > MAX_THUMBNAIL_BYTES) throw new Error("Image is larger than the 10 MB local preview limit.");
  if (file.size === 0) throw new Error("The selected image is empty.");
}
