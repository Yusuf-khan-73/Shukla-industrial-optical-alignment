const express = require('express');
const { authenticate } = require('../middleware/auth');
const heroController = require('../controllers/heroController');

const router = express.Router();

router.get('/hero-slides', heroController.listHeroSlides);

router.get('/admin/hero-slides', authenticate, heroController.adminListHeroSlides);
router.post('/admin/hero-slides', authenticate, heroController.createHeroSlide);
router.put('/admin/hero-slides/:item_id', authenticate, heroController.updateHeroSlide);
router.delete('/admin/hero-slides/:item_id', authenticate, heroController.deleteHeroSlide);

module.exports = router;
