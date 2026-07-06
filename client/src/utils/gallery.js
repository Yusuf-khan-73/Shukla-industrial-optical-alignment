/**
 * Normalize gallery item shape from API or seed data.
 * Location: client/src/utils/gallery.js
 */

export const normalizeGalleryItem = (item) => {
  if (!item) return null;

  const imageFromNested = item.image?.url
    ? item.image
    : null;

  const firstImage = item.images?.[0];
  const imageFromArray = firstImage
    ? {
        url: firstImage.url || firstImage.image_url || firstImage.imageUrl,
        alt: firstImage.alt || firstImage.alt_text || firstImage.altText || item.title || '',
      }
    : null;

  const image = imageFromNested || imageFromArray || {
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
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
