const express = require('express');
const { authenticate } = require('../middleware/auth');
const projectsController = require('../controllers/projectsController');

const router = express.Router();

router.get('/projects', projectsController.listProjects);
router.get('/projects/:item_id', projectsController.getProject);

router.get('/admin/projects', authenticate, projectsController.adminListProjects);
router.post('/admin/projects', authenticate, projectsController.createProject);
router.put('/admin/projects/:item_id', authenticate, projectsController.updateProject);
router.delete('/admin/projects/:item_id', authenticate, projectsController.deleteProject);

module.exports = router;
