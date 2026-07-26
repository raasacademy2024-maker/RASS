/**
 * Image URL helpers.
 *
 * Google Drive "share" links point at an HTML viewer page, not at the image
 * bytes, so pasting one into an <img src> renders nothing. This converts the
 * common Drive link shapes into Drive's direct image endpoint so admin-pasted
 * links work as thumbnails.
 *
 * Supported inputs:
 *   https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 *   https://drive.google.com/file/d/FILE_ID/preview
 *   https://drive.google.com/open?id=FILE_ID
 *   https://drive.google.com/uc?export=view&id=FILE_ID
 *   https://drive.google.com/thumbnail?id=FILE_ID
 *   https://drive.usercontent.google.com/download?id=FILE_ID
 *   https://docs.google.com/uc?id=FILE_ID
 *
 * Note: the Drive file still has to be shared as "Anyone with the link",
 * otherwise Google returns a sign-in page for any URL shape.
 */

const DRIVE_HOSTS = [
  'drive.google.com',
  'drive.usercontent.google.com',
  'docs.google.com',
];

/** Default width requested from Drive's thumbnail endpoint. */
const DEFAULT_DRIVE_WIDTH = 1600;

/**
 * Pulls the Drive file id out of any of the supported link shapes.
 * Returns null when the URL isn't a Google Drive file link.
 */
export const extractDriveFileId = (url: string): string | null => {
  if (!url) return null;

  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return null;
  }

  if (!DRIVE_HOSTS.includes(parsed.hostname)) return null;

  // /file/d/FILE_ID/... and /d/FILE_ID/...
  const pathMatch = parsed.pathname.match(/\/(?:file\/)?d\/([^/]+)/);
  if (pathMatch?.[1]) return pathMatch[1];

  // ?id=FILE_ID (open, uc, thumbnail, download)
  const idParam = parsed.searchParams.get('id');
  if (idParam) return idParam;

  return null;
};

export const isGoogleDriveUrl = (url: string): boolean =>
  extractDriveFileId(url) !== null;

/**
 * Normalizes an image URL for use in <img src>.
 * Google Drive links become direct thumbnail URLs; everything else
 * (including empty values) is returned untouched.
 *
 * @param url   The raw URL, typically pasted by an admin.
 * @param width Requested width for Drive thumbnails.
 */
export const resolveImageUrl = (
  url?: string | null,
  width: number = DEFAULT_DRIVE_WIDTH
): string => {
  if (!url) return '';

  const trimmed = url.trim();
  const fileId = extractDriveFileId(trimmed);
  if (!fileId) return trimmed;

  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${width}`;
};

export default resolveImageUrl;
