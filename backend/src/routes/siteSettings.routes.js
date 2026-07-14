const express = require('express');
const { authenticate } = require('../middleware/auth');
const siteSettingsController = require('../controllers/siteSettingsController');

const router = express.Router();

router.get('/site-settings', siteSettingsController.getSiteSettings);
router.put(
  '/admin/site-settings',
  authenticate,
  siteSettingsController.updateSiteSettings
);

module.exports = router;
