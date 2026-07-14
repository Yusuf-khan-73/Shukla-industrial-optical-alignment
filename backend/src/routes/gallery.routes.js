const express = require('express');
const { authenticate } = require('../middleware/auth');
const galleryController = require('../controllers/galleryController');

const router = express.Router();

router.get('/gallery', galleryController.listGallery);
router.get('/gallery/:item_id', galleryController.getGalleryItem);

router.get('/admin/gallery', authenticate, galleryController.adminListGallery);
router.post('/admin/gallery', authenticate, galleryController.createGallery);
router.put('/admin/gallery/:item_id', authenticate, galleryController.updateGallery);
router.delete('/admin/gallery/:item_id', authenticate, galleryController.deleteGallery);

module.exports = router;
