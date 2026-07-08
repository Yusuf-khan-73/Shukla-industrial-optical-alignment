/**
 * Normalize gallery item shape from API or seed data.
 * Location: client/src/utils/gallery.js
 */
import { industrialImage } from './industrialImages';
import { resolveImageUrl } from './resolveImageUrl';

const pickImageSource = (item) => {
  if (item.image?.url || item.image?.image_url) {
    return {
      url: item.image.url || item.image.image_url,
      alt: item.image.alt || item.image.alt_text || item.title || '',
    };
  }

  const firstImage = item.images?.[0];
  if (firstImage) {
    return {
      url: firstImage.url || firstImage.image_url || firstImage.imageUrl,
      alt: firstImage.alt || firstImage.alt_text || firstImage.altText || item.title || '',
    };
  }

  return null;
};

export const normalizeGalleryItem = (item) => {
  if (!item) return null;

  const source = pickImageSource(item);
  const version = item.updated_at || item.updatedAt || item.id;
  const hasValidUrl = source?.url && String(source.url).trim();

  const image = hasValidUrl
    ? {
        url: resolveImageUrl(source.url, version),
        alt: source.alt || item.title || 'Gallery image',
      }
    : {
        url: resolveImageUrl(industrialImage((item.id || 1) - 1)),
        alt: item.title || 'Gallery image',
      };

  return {
    ...item,
    categoryLabel: item.categoryLabel || item.category_label || item.category || 'General',
    image,
  };
};

export const normalizeGalleryList = (items) =>
  (Array.isArray(items) ? items : []).map(normalizeGalleryItem).filter(Boolean);

export default normalizeGalleryItem;
