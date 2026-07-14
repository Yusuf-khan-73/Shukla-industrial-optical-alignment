const express = require('express');
const { authenticate } = require('../middleware/auth');
const servicesController = require('../controllers/servicesController');

const router = express.Router();

router.get('/services', servicesController.listServices);
router.get('/services/:slug', servicesController.getServiceBySlug);

router.get('/admin/services', authenticate, servicesController.adminListServices);
router.post('/admin/services', authenticate, servicesController.createService);
router.put('/admin/services/:item_id', authenticate, servicesController.updateService);
router.delete('/admin/services/:item_id', authenticate, servicesController.deleteService);

module.exports = router;
