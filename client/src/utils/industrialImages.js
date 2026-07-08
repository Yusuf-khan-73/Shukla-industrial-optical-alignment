/**
 * Shared industrial image paths for paper-mill / alignment content.
 * Location: client/src/utils/industrialImages.js
 */

export const PROJECT_IMAGES = [
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsUXuBbC1_uYXa4O8PHlVKaQvI2In63Qcf-4ln2qYCrA&s=10',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAuC9h8hK6Tt-ZRQR_tzyxbaNWPU4mhIZJtYAJmOiM6A&s=10',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCp14lBBBrBGVkLe0HfqgAS2BFlltbwUZ9812txhmRCA&s=10',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPsr1m93xRb2vFmOPM8ej7GM-P9DUacA9usFGk36nkiw&s=10',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq632mb3Da-fH25l1tvtVKqui1qjFIi7GNhwcEhvr6FA&s=10',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWD0gWZ2cdsqn4LrnqaUTnvb-HXh2y2qmcQyRtEffY0w&s=10',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgI0VSFY_C0YodavWsIXWmE8u4HDNBGi6TzwGeKDVb7A&s=10',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGJBCfOcGTHF5fQww0VBn7NYezA0WW5ZPcIxQZjYxS4A&s=10',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_YG60CHtPyDyPGzrcQZi5TCaJwIou26D-6KANk7Fpqg&s=10',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLMev2KNtPxktu2VB2DwXC5qVUlVi_oX1KUAHvjbcu6A&s=10',
];

const local = (n) => `/projects/project-${String(n).padStart(2, '0')}.png`;

export const LOCAL_PROJECT_IMAGES = Array.from({ length: 10 }, (_, i) => local(i + 1));

/** Prefer user-provided URLs, fall back to bundled local assets */
export const industrialImage = (index = 0) =>
  PROJECT_IMAGES[index % PROJECT_IMAGES.length]
  || LOCAL_PROJECT_IMAGES[index % LOCAL_PROJECT_IMAGES.length];

export const industrialImg = (index, alt) => ({
  url: industrialImage(index),
  alt,
});

export default PROJECT_IMAGES;
