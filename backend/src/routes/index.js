const express = require('express');

const authRoutes = require('./auth.routes');
const projectsRoutes = require('./projects.routes');
const galleryRoutes = require('./gallery.routes');
const clientsRoutes = require('./clients.routes');
const servicesRoutes = require('./services.routes');
const testimonialsRoutes = require('./testimonials.routes');
const heroRoutes = require('./hero.routes');
const contactRoutes = require('./contact.routes');
const companyRoutes = require('./company.routes');
const siteSettingsRoutes = require('./siteSettings.routes');
const uploadsRoutes = require('./uploads.routes');
const healthController = require('../controllers/healthController');

const router = express.Router();

router.get('/health', healthController.healthCheck);

router.use('/auth', authRoutes);
router.use(projectsRoutes);
router.use(galleryRoutes);
router.use(clientsRoutes);
router.use(servicesRoutes);
router.use(testimonialsRoutes);
router.use(heroRoutes);
router.use(contactRoutes);
router.use(companyRoutes);
router.use(siteSettingsRoutes);
router.use('/admin/uploads', uploadsRoutes);

module.exports = router;
