export const MAX_TEXT_LENGTH = 2000;
export const MAX_IMAGES = 3;
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const EXAMPLE_QUESTIONS = [
  "某地从下个月起全面实行四天工作制？",
  "网传这项新规今天开始执行，是真的吗？",
  "这张新闻截图是最近发布的吗？",
] as const;

export function imageFileError(file: Pick<File, "type" | "size">): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return "仅支持 JPEG、PNG 或 WebP 图片，请重新选择";
  if (file.size > MAX_IMAGE_BYTES) return "图片超过 10MB，请选择较小的文件";
  if (file.size === 0) return "图片为空，请选择有效的图片文件";
  return null;
}
